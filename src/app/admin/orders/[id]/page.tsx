
"use client"

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { initialOrders, type Order } from "../page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const statusVariantMap: Record<Order['status'], "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "secondary",
  Processing: "default",
  Shipped: "outline",
  Delivered: "default", 
  Cancelled: "destructive",
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = initialOrders.find(o => o.id === id);

  if (!order) {
    return notFound();
  }

  const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const shipping = 40.00;
  const total = subtotal + shipping;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to orders</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Order {order.id}</h1>
          <p className="text-muted-foreground">{order.date}</p>
        </div>
        <Badge variant={statusVariantMap[order.status]} className="ml-auto text-base">{order.status}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Products Ordered</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress.name}</p>
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
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
