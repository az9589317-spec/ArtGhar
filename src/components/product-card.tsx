'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getArtistById } from '@/lib/data';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const artist = getArtistById(product.artistId);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      slug: product.slug,
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your cart.`,
    });
  };
  
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 border-b">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.images[0].hint}
            />
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
