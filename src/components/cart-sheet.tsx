'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '@/lib/types';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateItemQuantity, totalItems, totalPrice } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {items.length > 0 ? (
            <ScrollArea className="h-full pr-6">
              <div className="flex flex-col gap-6 py-4">
                {items.map((item) => (
                  <CartSheetItem key={item.id} item={item} onRemove={removeItem} onUpdateQuantity={updateItemQuantity} />
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="h-24 w-24 text-muted-foreground/30" strokeWidth={1} />
              <h3 className="font-headline text-xl">Your cart is empty</h3>
              <p className="text-muted-foreground">Add some beautiful creations to your cart.</p>
              <Button onClick={() => onOpenChange(false)} asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <SheetFooter className="bg-background border-t px-6 py-4 sm:flex-col sm:items-stretch sm:space-x-0">
            <div className="flex justify-between text-base font-medium text-foreground">
              <p>Subtotal</p>
              <p>${totalPrice.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout.
            </p>
            <div className="mt-6">
              <Button asChild className="w-full" size="lg" onClick={() => onOpenChange(false)}>
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartSheetItem({ item, onRemove, onUpdateQuantity }: { item: CartItem; onRemove: (id: string) => void; onUpdateQuantity: (id: string, q: number) => void; }) {
  return (
    <div className="flex gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-foreground">
            <h3>
              <Link href={`/products/${item.slug}`}>{item.name}</Link>
            </h3>
            <p className="ml-4">${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
            className="w-20 h-9"
            min="1"
          />
          <div className="flex">
            <Button variant="ghost" size="sm" onClick={() => onRemove(item.id)}>
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
