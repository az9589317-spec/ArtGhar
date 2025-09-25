
"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const firestore = useFirestore();
  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(8));
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  const heroProducts = products?.filter(p => p.imageUrls && p.imageUrls.length > 0).slice(0, 3) || [];

  return (
    <div className="flex flex-col">
      <section className="w-full">
        {isLoading && (
           <Skeleton className="w-full h-[60vh] md:h-[70vh]" />
        )}
        {!isLoading && heroProducts.length > 0 && (
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {heroProducts.map((product) => (
                <CarouselItem key={product.id}>
                  <div className="relative w-full h-[60vh] md:h-[70vh]">
                    {product.imageUrls && product.imageUrls[0] && (
                        <Image
                            src={product.imageUrls[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority={heroProducts.indexOf(product) === 0}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                      <h2 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
                        {product.name}
                      </h2>
                      <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">
                        {product.description}
                      </p>
                      <Button asChild className="mt-8" size="lg">
                        <Link href={`/products/${product.slug}`}>Discover Now</Link>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          </Carousel>
        )}
      </section>

      <section id="featured-products" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
            ))}
            {!isLoading && products && products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
           <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/products">Shop All Creations</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
