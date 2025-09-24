import { getProducts, getProductBySlug, getArtistById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from './add-to-cart-button';
import { BuyNowButton } from './buy-now-button';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const artist = getArtistById(product.artistId);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div className="aspect-square relative w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            data-ai-hint={product.images[0].hint}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-headline font-bold">{product.name}</h1>
          {artist && (
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
