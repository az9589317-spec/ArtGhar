"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { getProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from 'react';

export default function Home() {
  const products = getProducts();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <div className="flex flex-col">
       <section className="w-full py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {products.slice(0, 5).map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt}
                          fill
                          className="object-cover rounded-lg"
                          data-ai-hint={product.images[0].hint}
                        />
                         <div className="absolute inset-0 bg-black/30 rounded-lg" />
                         <div className="relative z-10 text-white text-center p-4">
                            <h3 className="text-2xl font-headline font-bold drop-shadow-md">{product.name}</h3>
                            <Button asChild className="mt-4" variant="secondary">
                              <Link href={`/products/${product.slug}`}>View Product</Link>
                            </Button>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <section id="featured-products" className="pb-12 md:pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-10">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
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
