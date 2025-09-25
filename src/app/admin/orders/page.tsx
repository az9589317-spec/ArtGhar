
'use client';

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import type { Order, OrderStatus } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";


const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "secondary",
    Processing: "default",
    Shipped: "outline",
    Delivered: "default", 
    Cancelled: "destructive",
}

const statusColorMap: Record<OrderStatus, string> = {
    Pending: "bg-yellow-500",
    Processing: "bg-blue-500",
    Shipped: "bg-purple-500",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-500",
}


export default function AdminOrdersPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'orders');
  }, [firestore]);

  const { data: orders, isLoading } = useCollection<Order>(ordersQuery);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!firestore) return;
    const orderRef = doc(firestore, 'orders', orderId);
    try {
      await updateDoc(orderRef, { status: newStatus });
       toast({
        title: "Status Updated",
        description: `Order ${orderId} is now ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update order status.",
      });
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {(isLoading || (orders && orders.length > 0)) ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading && Array.from({length: 5}).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-9 w-[140px]" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
                      </TableRow>
                    ))}
                    {!isLoading && orders?.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                            #{order.id.substring(0, 7).toUpperCase()}
                          </Link>
                        </TableCell>
                        <TableCell>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</TableCell>
                        <TableCell>{format(order.createdAt.toDate(), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                           <Select
                            value={order.status}
                            onValueChange={(newStatus: OrderStatus) => handleStatusChange(order.id, newStatus)}
                          >
                            <SelectTrigger className="w-[140px] h-9 focus:ring-0">
                                <Badge variant={statusVariantMap[order.status]}>
                                    <div className={`w-2 h-2 rounded-full mr-2 ${statusColorMap[order.status]}`} />
                                    {order.status}
                                </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="Processing">Processing</SelectItem>
                              <SelectItem value="Shipped">Shipped</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                 {isLoading && Array.from({length: 5}).map((_, i) => (
                    <Card key={i} className="w-full">
                       <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                       <CardContent><Skeleton className="h-4 w-1/2" /></CardContent>
                       <CardFooter><Skeleton className="h-8 w-1/4" /></CardFooter>
                    </Card>
                 ))}
                {!isLoading && orders?.map((order) => (
                    <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                    <Card className="w-full hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Order #{order.id.substring(0, 7).toUpperCase()}</CardTitle>
                                <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{format(order.createdAt.toDate(), "PP")}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div>
                                <p className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="text-sm text-muted-foreground">Customer</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <p className="font-bold text-lg">₹{order.total.toFixed(2)}</p>
                        </CardFooter>
                    </Card>
                    </Link>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12">No orders to display yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Exporting types for use in other components
export type { Order, OrderStatus };
