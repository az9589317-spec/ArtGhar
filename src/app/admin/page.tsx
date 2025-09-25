
'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, Receipt } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import type { Order, Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/lib/types";

const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "secondary",
    Processing: "default",
    Shipped: "outline",
    Delivered: "default", 
    Cancelled: "destructive",
}

export default function AdminDashboard() {
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const ordersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'orders');
  }, [firestore]);
  
  const recentOrdersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'orders'), orderBy('createdAt', 'desc'), limit(5));
  }, [firestore]);

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  const { data: orders, isLoading: isLoadingOrders } = useCollection<Order>(ordersQuery);
  const { data: recentOrders, isLoading: isLoadingRecent } = useCollection<Order>(recentOrdersQuery);

  const isLoading = isLoadingProducts || isLoadingOrders || isLoadingRecent;

  const totalRevenue = useMemoFirebase(() => {
    if (!orders) return 0;
    return orders
        .filter(o => o.status === 'Delivered' || o.status === 'Shipped')
        .reduce((acc, order) => acc + order.total, 0);
  }, [orders]);

  const salesCount = orders?.length ?? 0;
  const productCount = products?.length ?? 0;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/sales">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-3/4" /> : (
                <>
                  <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    Based on delivered and shipped orders
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/orders">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-1/2" /> : (
                <>
                  <div className="text-2xl font-bold">+{salesCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Total orders placed
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/products">
            <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {isLoading ? <Skeleton className="h-8 w-1/2" /> : (
                    <>
                        <div className="text-2xl font-bold">{productCount}</div>
                        <p className="text-xs text-muted-foreground">
                        Currently listed products
                        </p>
                    </>
                )}
            </CardContent>
            </Card>
        </Link>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
                <div className="space-y-4">
                    {Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : recentOrders && recentOrders.length > 0 ? (
                <>
                {/* Desktop View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer & Products</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>
                                <div className="font-medium">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</div>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex -space-x-2 overflow-hidden">
                                    {order.products.slice(0, 3).map(p => (
                                        <div key={p.id} className="relative h-6 w-6 rounded-full overflow-hidden border-2 border-background ring-1 ring-muted">
                                            <Image src={p.image} alt={p.name} fill className="object-cover"/>
                                        </div>
                                    ))}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {order.products.map(p => p.name).join(', ')}
                                    </div>
                                </div>
                            </TableCell>
                             <TableCell>{format(order.createdAt.toDate(), "PP")}</TableCell>
                             <TableCell>
                               <Badge variant={statusVariantMap[order.status]} className="capitalize">{order.status}</Badge>
                             </TableCell>
                             <TableCell className="text-right">₹{order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile View */}
                <div className="sm:hidden space-y-4">
                    {recentOrders.map(order => (
                        <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-bold">#{order.id.substring(0, 7).toUpperCase()}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                        </div>
                                        <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                                    </div>
                                     <p className="text-xs text-muted-foreground pt-1">{format(order.createdAt.toDate(), "PPp")}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex -space-x-2 overflow-hidden">
                                        {order.products.slice(0, 3).map(p => (
                                            <div key={p.id} className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-background ring-1 ring-muted">
                                                <Image src={p.image} alt={p.name} fill className="object-cover"/>
                                            </div>
                                        ))}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {order.products.map(p => p.name).join(', ')}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardContent className="pt-2 text-right">
                                    <p className="text-lg font-bold">₹{order.total.toFixed(2)}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
                </>
            ) : (
              <p className="text-muted-foreground text-center py-8">No recent sales data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
