
'use client';

import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from './add-to-cart-button';
import { BuyNowButton } from './buy-now-button';
import { useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import type { Artist, Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const firestore = useFirestore();

  const productQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);
  
  const { data: products, isLoading: isProductLoading } = useCollection<Product>(productQuery);
  const product = products?.[0];

  const artistRef = useMemoFirebase(() => {
    if (!firestore || !product?.artistId) return null;
    return doc(firestore, 'artists', product.artistId);
  }, [firestore, product?.artistId]);
  
  const { data: artist, isLoading: isArtistLoading } = useDoc<Artist>(artistRef);

  if (isProductLoading) {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="flex flex-col justify-center space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-20 w-full" />
                    <div className="flex gap-4">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-32" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (!product && !isProductLoading) {
    notFound();
  }

  // This check is necessary because product can be null here, even if not loading
  if (!product) {
    // You can return a more specific "product not found" component here if you wish
    return notFound();
  }


  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
          {product.imageUrl && (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold">{product.name}</h1>
          {isArtistLoading ? (
             <Skeleton className="h-6 w-1/4 mt-2" />
          ) : artist && (
            <p className="text-lg mt-2 text-muted-foreground">
              by <Link href={`/artists/${artist.id}`} className="text-primary hover:underline">{artist.name}</Link>
            </p>
          )}
          <p className="text-3xl font-bold text-foreground mt-4">₹{product.price.toFixed(2)}</p>
          <div className="mt-6 prose max-w-none text-foreground/80">
            <p>{product.description}</p>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <AddToCartButton product={product} />
            <BuyNowButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
