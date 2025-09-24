import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AdminProductsPage() {
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Button>Add Product</Button>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Product management interface will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
