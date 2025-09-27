
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Image as ImageIcon } from 'lucide-react';
import type { Artist, Product } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const imageUrl = product.imageUrls?.[0];
    if (imageUrl) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: imageUrl,
          slug: product.slug,
        });
        toast({
          title: "Added to cart!",
          description: `${product.name} is now in your cart.`,
        });
    } else {
        toast({
          variant: "destructive",
          title: "Image missing",
          description: "This product cannot be added to the cart as it is missing an image.",
        });
    }
  };
  
  return (
    <Card className="group overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/30 border-none">
        <CardHeader className="p-0">
            <Link href={`/products/${product.slug}`} className="block relative">
                <div className="aspect-square w-full relative">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                        <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                            <ImageIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={handleAddToCart}>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Link>
        </CardHeader>
        <CardContent className="p-4">
            <Link href={`/products/${product.slug}`}>
                <h3 className="text-lg font-headline font-semibold group-hover:text-primary transition-colors truncate">
                    {product.name}
                </h3>
            </Link>
            <div className="flex justify-between items-baseline">
                {artist ? (
                <Link href={`/artists/${artist.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    by {artist.name}
                </Link>
                ) : (
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-md" />
                )}
                <p className="text-lg font-bold text-foreground">₹{product.price.toFixed(2)}</p>
            </div>
        </CardContent>
    </Card>
  );
}
