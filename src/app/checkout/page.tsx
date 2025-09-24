'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would process payment here
    toast({
      title: "Order Placed!",
      description: "Thank you for your purchase. Your art is on its way!",
    });
    clearCart();
    router.push('/');
  };

  if (items.length === 0) {
    // This could happen if a user navigates here directly after cart is cleared
    return (
        <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-3xl font-headline font-bold">Your cart is empty.</h1>
            <Button onClick={() => router.push('/')} className="mt-4">Go to Homepage</Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" required />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" required />
                </div>
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
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>$5.00</p>
                  </div>
                   <div className="flex justify-between text-lg font-bold">
                    <p>Total</p>
                    <p>${(totalPrice + 5.00).toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full mt-6">
              Place Order
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
