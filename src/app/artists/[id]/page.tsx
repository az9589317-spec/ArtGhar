'use client';
import React from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import ProductCard from '@/components/product-card';
import GenerateBioForm from './generate-bio-form';
import { useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import type { Artist, Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ArtistPage() {
    const { id } = useParams<{ id: string }>();
    const firestore = useFirestore();

    const artistRef = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return doc(firestore, 'artists', id);
    }, [firestore, id]);

    const productsQuery = useMemoFirebase(() => {
        if (!firestore || !id) return null;
        return query(collection(firestore, 'products'), where('artistId', '==', id));
    }, [firestore, id]);

    const { data: artist, isLoading: isArtistLoading } = useDoc<Artist>(artistRef);
    const { data: products, isLoading: areProductsLoading } = useCollection<Product>(productsQuery);

  if (isArtistLoading) {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12">
                <Skeleton className="h-40 w-40 rounded-full" />
                <div className="text-center md:text-left space-y-4 flex-grow">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
            <Skeleton className="h-10 w-1/3 mx-auto mb-10" />
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                ))}
             </div>
        </div>
    )
  }

  if (!artist) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12">
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-full shadow-lg">
          <Image
            src={artist.avatarUrl || ''}
            alt={artist.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">{artist.name}</h1>
          <GenerateBioForm artist={artist} products={products || []} />
        </div>
      </div>
      
      <h2 className="text-3xl font-headline font-bold text-center mb-10">Creations by {artist.name}</h2>
      {areProductsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
            ))}
         </div>
      ) : products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">This artist has not listed any products yet.</p>
      )}
    </div>
  );
}
