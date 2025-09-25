
'use client';

import React from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { Order, OrderStatus } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "secondary",
    Processing: "default",
    Shipped: "outline",
    Delivered: "default", 
    Cancelled: "destructive",
}

export default function MyOrdersPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  
  const ordersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, 'orders'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersQuery);
  const isLoading = isUserLoading || areOrdersLoading;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-headline font-bold mb-8">My Orders</h1>
      <Card>
        <CardContent className="p-0">
          {(isLoading || (orders && orders.length > 0)) ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && Array.from({length: 3}).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-9 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))}
                    {!isLoading && orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link href={`/my-orders/${order.id}`} className="text-primary hover:underline">
                            #{order.id.substring(0, 7).toUpperCase()}
                          </Link>
                        </TableCell>
                        <TableCell>{format(order.createdAt.toDate(), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                           <Badge variant={statusVariantMap[order.status]}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden">
                 {isLoading && Array.from({length: 3}).map((_, i) => (
                    <Card key={i} className="w-full rounded-none border-x-0 border-t-0">
                       <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                       <CardContent className="space-y-4">
                            <Skeleton className="h-16 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                       </CardContent>
                       <CardFooter><Skeleton className="h-8 w-1/4" /></CardFooter>
                    </Card>
                 ))}
                {!isLoading && orders?.map((order) => (
                    <Link key={order.id} href={`/my-orders/${order.id}`} className="block">
                    <Card className="w-full rounded-none border-x-0 border-t-0 hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Order #{order.id.substring(0, 7).toUpperCase()}</CardTitle>
                                <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{format(order.createdAt.toDate(), "PP")}</p>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-4">
                            <div className="flex -space-x-4">
                                {order.products.slice(0, 3).map(p => (
                                    <div key={p.id} className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-background ring-2 ring-primary">
                                        <Image src={p.image} alt={p.name} fill className="object-cover"/>
                                    </div>
                                ))}
                            </div>
                            <div>
                                {order.products.map(p => (
                                    <p key={p.id} className="text-sm text-muted-foreground truncate">{p.name}</p>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                            <div className="flex justify-between items-center w-full">
                                <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                                <span className="text-sm text-primary">View Details</span>
                            </div>
                        </CardFooter>
                    </Card>
                    </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 px-4">
                <ShoppingBag className="mx-auto h-32 w-32 text-muted-foreground/30" strokeWidth={1} />
                <h2 className="mt-8 text-3xl font-headline font-bold">No orders yet</h2>
                <p className="mt-4 text-lg text-muted-foreground">Looks like you haven't placed any orders.</p>
                <Button asChild className="mt-8" size="lg">
                <Link href="/products">Start Shopping</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
