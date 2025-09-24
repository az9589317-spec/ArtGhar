'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Image as ImageIcon } from 'lucide-react';
import type { Artist, Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import React from 'react';
import { doc } from 'firebase/firestore';


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const firestore = useFirestore();

    const artistRef = useMemoFirebase(() => {
        if (!firestore || !product.artistId) return null;
        return doc(firestore, 'artists', product.artistId);
    }, [firestore, product.artistId]);

  const { data: artist } = useDoc<Artist>(artistRef);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      slug: product.slug,
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your cart.`,
    });
  };
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <CardHeader className="p-0 border-b">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-square relative overflow-hidden">
            {product.imageUrl ? (
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h3 className="text-lg font-headline font-semibold">
          <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">{product.name}</Link>
        </h3>
        {artist && (
          <p className="text-sm text-muted-foreground">
            by <Link href={`/artists/${artist.id}`} className="hover:underline">{artist.name}</Link>
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-bold text-foreground">₹{product.price.toFixed(2)}</p>
        <Button variant="outline" size="sm" onClick={handleAddToCart}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}
