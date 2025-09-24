"use client"

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { getProducts } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import React from 'react';

export default function Home() {
  const products = getProducts();
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )

  return (
    <div className="flex flex-col">
      <section className="w-full">
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}
        >
          <CarouselContent>
            {products.slice(0, 3).map((product) => (
              <CarouselItem key={product.id}>
                <div className="relative w-full h-[60vh] md:h-[70vh]">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    fill
                    className="object-cover"
                    data-ai-hint={product.images[0].hint}
                    priority={products.indexOf(product) === 0}
                  />
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
      </section>

      <section id="featured-products" className="py-12 md:py-20">
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
