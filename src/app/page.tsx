import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { getProducts } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const products = getProducts();
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-1");

  return (
    <div className="flex flex-col">
      {heroImage && (
        <section className="relative w-full h-[50vh] md:h-[60vh] text-white">
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-4">
            <h1 className="text-4xl md:text-6xl font-headline font-bold drop-shadow-lg">
              Discover Unique Handmade Creations
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
              Explore a curated collection of art and crafts from independent artists.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="#featured-products">Shop All Creations</Link>
            </Button>
          </div>
        </section>
      )}

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
        </div>
      </section>
    </div>
  );
}
