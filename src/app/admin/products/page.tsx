import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AdminProductsPage() {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button asChild>
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Product management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
