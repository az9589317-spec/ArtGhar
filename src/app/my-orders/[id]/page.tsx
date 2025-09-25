'use client';

import { useParams, notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import type { Order, OrderStatus } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Package, Truck, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "secondary",
  Processing: "default",
  Shipped: "outline",
  Delivered: "default", 
  Cancelled: "destructive",
}

const statusTimeline = ["Pending", "Processing", "Shipped", "Delivered"];

const statusIcons = {
    Pending: <Package className="h-5 w-5" />,
    Processing: <Package className="h-5 w-5" />,
    Shipped: <Truck className="h-5 w-5" />,
    Delivered: <Home className="h-5 w-5" />,
    Cancelled: <Package className="h-5 w-5" />,
};


export default function MyOrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const firestore = useFirestore();
  const { user } = useUser();

  const orderRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, "orders", id);
  }, [firestore, id]);

  const { data: order, isLoading } = useDoc<Order>(orderRef);

  // Security check: if the order loads but doesn't belong to the current user, redirect.
  useEffect(() => {
    if (!isLoading && order && user && order.userId !== user.uid) {
        router.push('/my-orders');
    }
  }, [isLoading, order, user, router]);


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 md:py-20 space-y-6">
        <div className="flex items-center gap-4">
           <Skeleton className="h-9 w-9" />
           <Skeleton className="h-8 w-48" />
           <Skeleton className="h-9 w-24 ml-auto" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-48 w-full" /></CardContent>
                </Card>
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
            </div>
            <div className="space-y-6">
                 <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                </Card>
                 <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                </Card>
            </div>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return notFound();
  }

  const currentStatusIndex = statusTimeline.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/my-orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to my orders</span>
          </Link>
        </Button>
        <div className="flex-grow">
          <h1 className="text-xl md:text-2xl font-bold truncate">Order #{order.id.substring(0, 7).toUpperCase()}</h1>
          <p className="text-sm text-muted-foreground">Placed on {format(order.createdAt.toDate(), "PPp")}</p>
        </div>
        <Badge variant={statusVariantMap[order.status]} className="text-base ml-auto flex-shrink-0">{order.status}</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Tracking</CardTitle>
            </CardHeader>
            <CardContent>
                 {order.status === 'Cancelled' ? (
                     <p className="text-muted-foreground">This order has been cancelled.</p>
                 ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-border" aria-hidden="true" />
                        <ul className="space-y-8">
                            {statusTimeline.map((status, index) => {
                                const isCompleted = index <= currentStatusIndex;
                                const isCurrent = index === currentStatusIndex;
                                return (
                                    <li key={status} className="flex items-start gap-4">
                                        <div className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full border-2",
                                            isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border"
                                        )}>
                                            {isCompleted ? <CheckCircle className="h-5 w-5" /> : statusIcons[status as OrderStatus]}
                                        </div>
                                        <div className="pt-1">
                                            <p className={cn("font-medium", isCurrent && "text-primary")}>{status}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {isCurrent && "Your order is currently being processed."}
                                                {isCompleted && !isCurrent && `Your order has been ${status.toLowerCase()}.`}
                                            </p>
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                 )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products.map(product => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-right">₹{product.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">₹{(product.price * product.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {order.products.map(product => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0">
                             <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow p-4">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {product.quantity}</p>
                            <p className="text-sm font-bold mt-2">₹{(product.price * product.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Shipping To</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.email}</p>
              <p className="text-sm text-muted-foreground pt-2">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.zip}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}