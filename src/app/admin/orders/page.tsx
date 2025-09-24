
"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getProducts } from "@/lib/data";

const products = getProducts();

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type ProductInOrder = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

type ShippingAddress = {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  products: ProductInOrder[];
};

export const initialOrders: Order[] = [
  { 
    id: 'ORD001', 
    customer: 'Jane Doe', 
    date: '2024-08-25', 
    total: 125.00, 
    status: 'Processing',
    shippingAddress: {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      address: "123 Art Lane",
      city: "Creativity City",
      zip: "54321"
    },
    products: [
      { id: products[0].id, name: products[0].name, image: products[0].images[0].url, quantity: 1, price: products[0].price },
      { id: products[4].id, name: products[4].name, image: products[4].images[0].url, quantity: 1, price: products[4].price }
    ]
  },
  { 
    id: 'ORD002', 
    customer: 'John Smith', 
    date: '2024-08-24', 
    total: 75.50, 
    status: 'Shipped',
    shippingAddress: {
      name: "John Smith",
      email: "john.smith@example.com",
      address: "456 Craft Ave",
      city: "Maker Town",
      zip: "98765"
    },
    products: [
      { id: products[2].id, name: products[2].name, image: products[2].images[0].url, quantity: 1, price: products[2].price }
    ]
  },
  { 
    id: 'ORD003', 
    customer: 'Peter Jones', 
    date: '2024-08-23', 
    total: 250.00, 
    status: 'Pending',
    shippingAddress: {
      name: "Peter Jones",
      email: "peter.jones@example.com",
      address: "789 Design Blvd",
      city: "Studio City",
      zip: "13579"
    },
    products: [
      { id: products[1].id, name: products[1].name, image: products[1].images[0].url, quantity: 1, price: 350.00 },
    ]
  },
  { 
    id: 'ORD004', 
    customer: 'Mary Johnson', 
    date: '2024-08-22', 
    total: 45.00, 
    status: 'Delivered',
    shippingAddress: {
      name: "Mary Johnson",
      email: "mary.j@example.com",
      address: "101 Gallery Rd",
      city: "Artville",
      zip: "24680"
    },
    products: [
      { id: products[6].id, name: products[6].name, image: products[6].images[0].url, quantity: 1, price: products[6].price },
    ]
  },
  { 
    id: 'ORD005', 
    customer: 'Chris Lee', 
    date: '2024-08-21', 
    total: 99.99, 
    status: 'Cancelled',
    shippingAddress: {
      name: "Chris Lee",
      email: "chris.lee@example.com",
      address: "222 Pottery Path",
      city: "Clayton",
      zip: "11223"
    },
    products: [
      { id: products[7].id, name: products[7].name, image: products[7].images[0].url, quantity: 1, price: products[7].price }
    ]
  },
];

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
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
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
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.date}</TableCell>
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
                {orders.map((order) => (
                    <Link key={order.id} href={`/admin/orders/${order.id}`} className="block">
                    <Card className="w-full hover:bg-muted/50 transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">{order.id}</CardTitle>
                                <Badge variant={statusVariantMap[order.status]}>{order.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{order.date}</p>
                        </CardHeader>
                        <CardContent className="space-y-2">
                             <div>
                                <p className="font-medium">{order.customer}</p>
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
