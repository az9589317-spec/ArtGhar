
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminSalesPage() {
  // In a real app, this data would come from your database
  const sales = [
    // { id: 'ORD001', customer: 'Jane Doe', date: '2024-05-20', total: 125.00, status: 'Completed' },
    // { id: 'ORD002', customer: 'John Smith', date: '2024-05-19', total: 75.50, status: 'Shipped' },
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>All Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {sales.length > 0 ? (
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
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{sale.customer}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.status}</TableCell>
                    <TableCell className="text-right">₹{sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-12">No sales data to display yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
