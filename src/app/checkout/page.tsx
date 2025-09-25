
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { Order, ShippingAddress } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { createOrder, verifyPayment } from '@/app/actions/razorpay';
import React, { useEffect } from 'react';


const shippingFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "A valid 10-digit phone number is required."),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(1, "ZIP code is required"),
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const form = useForm<z.infer<typeof shippingFormSchema>>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      zip: "",
    },
  });
  
  const shippingCost = 40.00;
  const totalAmount = totalPrice + shippingCost;

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isProcessing) {
      router.push('/');
    }
  }, [items.length, isProcessing, router]);


  const handleSubmit = async (shippingDetails: ShippingAddress) => {
    setIsProcessing(true);
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to place an order.",
      });
      setIsProcessing(false);
      return;
    }
    
    // 1. Create Razorpay Order
    const razorpayOrder = await createOrder(totalAmount * 100); // Amount in paise
    if (!razorpayOrder) {
        toast({
            variant: "destructive",
            title: "Payment Error",
            description: "Could not create a payment order. Please try again.",
        });
        setIsProcessing(false);
        return;
    }

    // 2. Open Razorpay Checkout
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ArtGhar',
        description: 'Artisan Marketplace Purchase',
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
            // 3. Verify Payment
            const verificationResult = await verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
            });

            if (!verificationResult.isValid) {
                 toast({
                    variant: "destructive",
                    title: "Payment Failed",
                    description: "Payment verification failed. Please contact support.",
                });
                setIsProcessing(false);
                return;
            }

            // 4. Create Firestore Order
            const orderData: Omit<Order, 'id'> = {
                userId: user.uid,
                createdAt: serverTimestamp(),
                status: "Pending" as const,
                products: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: shippingDetails,
                subtotal: totalPrice,
                shippingCost,
                total: totalAmount,
                paymentDetails: {
                    gateway: 'razorpay',
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id
                }
            };
            
            try {
                const docRef = await addDoc(collection(firestore, 'orders'), orderData);
                
                // 5. Send notification email
                try {
                  await fetch('/api/send-order-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ orderId: docRef.id, ...orderData }),
                  });
                } catch (emailError) {
                  console.error("Failed to send order notification email:", emailError);
                  // Don't block the user flow for this, just log it.
                }

                toast({
                    title: "Order Placed!",
                    description: "Thank you for your purchase. Your art is on its way!",
                });
                clearCart();
                router.push(`/my-orders/${docRef.id}`);
            } catch (error) {
                 console.error("Error placing order:", error);
                const contextualError = new FirestorePermissionError({
                    operation: 'create',
                    path: `orders/[new_id]`,
                    requestResourceData: orderData
                });
                errorEmitter.emit('permission-error', contextualError);
                // The global listener will show the toast
            } finally {
                setIsProcessing(false);
            }
        },
        prefill: {
            name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
            email: shippingDetails.email,
            contact: shippingDetails.phone,
        },
        theme: {
            color: "#E07A5F"
        },
        modal: {
            ondismiss: () => {
                setIsProcessing(false);
                toast({
                    variant: "destructive",
                    title: "Payment Cancelled",
                    description: "You closed the payment window.",
                });
            }
        }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (items.length === 0) {
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-headline font-bold">Your cart is empty. Redirecting...</h1>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem className="col-span-2"><FormLabel>City</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} disabled={isProcessing} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
              </CardContent>
            </Card>

            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                          </div>
                          <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                      </div>
                      <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <p>Subtotal</p>
                      <p>₹{totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Shipping</p>
                      <p>₹{shippingCost.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <p>Total</p>
                      <p>₹{totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button type="submit" size="lg" className="w-full mt-6" disabled={isProcessing}>
                 {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Place Order
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
