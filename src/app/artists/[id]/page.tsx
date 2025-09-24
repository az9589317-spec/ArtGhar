import { getArtistById, getProductsByArtist } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductCard from '@/components/product-card';
import GenerateBioForm from './generate-bio-form';

type ArtistPageProps = {
  params: {
    id: string;
  };
};

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = getArtistById(params.id);
  
  if (!artist) {
    notFound();
  }

  const products = getProductsByArtist(params.id);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 mb-12">
        <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-full shadow-lg">
          <Image
            src={artist.avatar.url}
            alt={artist.avatar.alt}
            fill
            className="object-cover"
            data-ai-hint={artist.avatar.hint}
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">{artist.name}</h1>
          <GenerateBioForm artist={artist} products={products} />
        </div>
      </div>
      
      <h2 className="text-3xl font-headline font-bold text-center mb-10">Creations by {artist.name}</h2>
      {products.length > 0 ? (
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
