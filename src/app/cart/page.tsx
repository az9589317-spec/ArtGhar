'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { CartItem } from '@/lib/types';
import { QuantitySelector } from '@/components/ui/quantity-selector';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateItemQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-32 w-32 text-muted-foreground/30" strokeWidth={1} />
        <h1 className="mt-8 text-4xl font-headline font-bold">Your Cart is Empty</h1>
        <p className="mt-4 text-lg text-muted-foreground">Looks like you haven't added any masterpieces yet.</p>
        <Button asChild className="mt-8" size="lg">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-headline font-bold mb-8">Your Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] hidden md:table-cell">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <CartTableRow key={item.id} item={item} onRemove={removeItem} onUpdateQuantity={updateItemQuantity} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-muted-foreground">Calculated at next step</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CartTableRow({ item, onRemove, onUpdateQuantity }: { item: CartItem; onRemove: (id: string) => void; onUpdateQuantity: (id: string, q: number) => void; }) {
  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">
        <div className="aspect-square relative h-16 w-16 rounded-md overflow-hidden">
            <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <Link href={`/products/${item.slug}`} className="hover:text-primary">{item.name}</Link>
      </TableCell>
      <TableCell>
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={(newQuantity) => onUpdateQuantity(item.id, newQuantity)}
        />
      </TableCell>
      <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
      <TableCell>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onRemove(item.id)}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
