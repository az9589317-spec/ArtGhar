
"use client"

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { initialOrders, type Order, type OrderStatus } from "../page";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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


export default function OrderDetailsPage() {
  const { id } = useParams();
  // In a real app, you'd fetch this data, but for now we find it.
  const orderData = initialOrders.find(o => o.id === id);

  // We use state to manage status changes locally on this page.
  // In a real app, this would be tied to the global state or a data store.
  const [status, setStatus] = useState<OrderStatus | undefined>(orderData?.status);
  
  if (!orderData || !status) {
    return notFound();
  }

  const subtotal = orderData.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const shipping = 40.00;
  const total = subtotal + shipping;
  
  // Note: In a real app, updating the status here would also update the source of truth (e.g., a database).
  // For this demo, this will only visually update the status on this page.
  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    // You could also show a toast notification here.
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to orders</span>
          </Link>
        </Button>
        <div className="flex-grow">
          <h1 className="text-xl md:text-2xl font-bold truncate">Order {orderData.id}</h1>
          <p className="text-sm text-muted-foreground">{orderData.date}</p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[150px] h-9 focus:ring-0 text-base">
                    <SelectValue>
                         <Badge variant={statusVariantMap[status]} className="text-base">
                            <div className={`w-2 h-2 rounded-full mr-2 ${statusColorMap[status]}`} />
                            {status}
                        </Badge>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
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
                    {orderData.products.map(product => (
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
                {orderData.products.map(product => (
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

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer & Shipping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{orderData.shippingAddress.name}</p>
              <p className="text-sm text-muted-foreground">{orderData.shippingAddress.email}</p>
              <p className="text-sm text-muted-foreground pt-2">
                {orderData.shippingAddress.address}<br />
                {orderData.shippingAddress.city}, {orderData.shippingAddress.zip}
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

    