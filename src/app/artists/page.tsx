import { getArtists } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ArtistsPage() {
  const artists = getArtists();

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
        Meet Our Artisans
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {artists.map((artist) => (
          <Link key={artist.id} href={`/artists/${artist.id}`} className="group">
            <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={artist.avatar.url}
                    alt={artist.avatar.alt}
                    fill
                    className="object-cover"
                    data-ai-hint={artist.avatar.hint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-headline font-bold group-hover:text-primary transition-colors">
                  {artist.name}
                </h2>
                <p className="mt-2 text-muted-foreground line-clamp-3">
                  {artist.bio}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
