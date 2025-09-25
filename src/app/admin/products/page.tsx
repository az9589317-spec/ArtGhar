
'use client';
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminProductsPage() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">
                  Price
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="hidden sm:table-cell">
                     <Skeleton className="h-16 w-16 rounded-md" />
                  </TableCell>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    {product.imageUrl && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                        <Image
                          alt={product.name}
                          className="object-cover"
                          src={product.imageUrl}
                          fill
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    ₹{product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {/* Add actions here e.g. Edit, Delete */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!isLoading && products?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No products found. Add one to get started.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
