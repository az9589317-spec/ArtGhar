
'use client';

import React, { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from './add-to-cart-button';
import { BuyNowButton } from './buy-now-button';
import { useDoc, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, limit } from 'firebase/firestore';
import type { Artist, Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/product-card';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const firestore = useFirestore();
  const [primaryImage, setPrimaryImage] = useState<string | null>(null);

  const productQuery = useMemoFirebase(() => {
    if (!firestore || !slug) return null;
    return query(collection(firestore, 'products'), where('slug', '==', slug), limit(1));
  }, [firestore, slug]);
  
  const { data: products, isLoading: isProductLoading } = useCollection<Product>(productQuery);
  
  const product = products?.[0];

  React.useEffect(() => {
    if (product?.imageUrls && product.imageUrls.length > 0) {
      setPrimaryImage(product.imageUrls[0]);
    }
  }, [product]);

  const artistRef = useMemoFirebase(() => {
    if (!firestore || !product?.artistId) return null;
    return doc(firestore, 'artists', product.artistId);
  }, [firestore, product]);
  
  const { data: artist, isLoading: isArtistLoading } = useDoc<Artist>(artistRef);

  const relatedProductsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(5));
  }, [firestore]);

  const { data: relatedProducts, isLoading: areRelatedProductsLoading } = useCollection<Product>(relatedProductsQuery);

  const filteredRelatedProducts = React.useMemo(() => {
    if (!relatedProducts || !product) return [];
    return relatedProducts.filter(p => p.id !== product.id).slice(0, 4);
  }, [relatedProducts, product]);


  if (isProductLoading) {
    return (
        <div className="container mx-auto px-4 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                <div className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="grid grid-cols-5 gap-4">
                        {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="aspect-square w-full rounded-lg" />)}
                    </div>
                </div>
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

  if (!product) {
    notFound();
  }


  return (
    <div className="bg-brand-sand">
        <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="md:sticky top-24">
                <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg mb-4 border bg-white">
                {primaryImage && (
                    <Image
                    src={primaryImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    />
                )}
                </div>
                <div className="grid grid-cols-5 gap-2 md:gap-4">
                    {product.imageUrls?.map(url => (
                        <button key={url} onClick={() => setPrimaryImage(url)} className={cn("relative aspect-square w-full overflow-hidden rounded-md border-2 transition-all", primaryImage === url ? "border-primary" : "border-transparent hover:border-muted-foreground/50")}>
                            <Image src={url} alt="Product thumbnail" fill className="object-cover" />
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col bg-white/50 backdrop-blur-sm rounded-lg shadow-sm p-8">
            <h1 className="text-3xl md:text-4xl font-headline font-bold">{product.name}</h1>
            
            <p className="text-3xl font-bold text-foreground mt-4">₹{product.price.toFixed(2)}</p>

            <Separator className="my-6" />

            <div className="prose max-w-none text-foreground/80">
                <p>{product.description}</p>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <AddToCartButton product={product} />
                <BuyNowButton product={product} />
            </div>

            <Separator className="my-6" />
            
            {isArtistLoading ? (
                <Skeleton className="h-12 w-1/2" />
            ) : artist ? (
                <Link href={`/artists/${artist.id}`} className="group">
                    <div className="flex items-center gap-4 p-3 -m-3 rounded-lg hover:bg-black/5 transition-colors">
                        <Avatar className="h-12 w-12 border">
                            <AvatarImage src={artist.avatarUrl} alt={artist.name} />
                            <AvatarFallback>
                                <UserIcon />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm text-muted-foreground">Sold by</p>
                            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{artist.name}</p>
                        </div>
                    </div>
                </Link>
            ) : null}

            </div>
        </div>
        
        <div className="mt-20 md:mt-28">
            <h2 className="text-3xl font-headline font-bold text-center mb-10">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {(areRelatedProductsLoading) && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-64 w-full" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                ))}
                {!areRelatedProductsLoading && filteredRelatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>

        </div>
    </div>
  );
}
