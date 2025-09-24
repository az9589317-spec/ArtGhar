"use client"

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: OrderStatus;
};

const initialOrders: Order[] = [
  { id: 'ORD001', customer: 'Jane Doe', date: '2024-08-25', total: 125.00, status: 'Processing' },
  { id: 'ORD002', customer: 'John Smith', date: '2024-08-24', total: 75.50, status: 'Shipped' },
  { id: 'ORD003', customer: 'Peter Jones', date: '2024-08-23', total: 250.00, status: 'Pending' },
  { id: 'ORD004', customer: 'Mary Johnson', date: '2024-08-22', total: 45.00, status: 'Delivered' },
  { id: 'ORD005', customer: 'Chris Lee', date: '2024-08-21', total: 99.99, status: 'Cancelled' },
];

const statusVariantMap: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
    Pending: "default",
    Processing: "secondary",
    Shipped: "outline",
    Delivered: "secondary", // Would be nice to have a success variant
    Cancelled: "destructive",
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
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status}
                        onValueChange={(newStatus: OrderStatus) => handleStatusChange(order.id, newStatus)}
                      >
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="Status" />
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
          ) : (
            <p className="text-center text-muted-foreground py-12">No orders to display yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}