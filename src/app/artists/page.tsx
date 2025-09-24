'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Artist } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


export default function ArtistsPage() {
  const firestore = useFirestore();
  const artistsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'artists');
  }, [firestore]);

  const { data: artists, isLoading } = useCollection<Artist>(artistsQuery);


  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
        Meet Our Artisans
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
             <Card key={i} className="flex flex-col h-full overflow-hidden">
                <CardHeader className="p-0">
                    <Skeleton className="aspect-[4/3] w-full" />
                </CardHeader>
                <CardContent className="p-6 text-center space-y-2">
                    <Skeleton className="h-8 w-1/2 mx-auto" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
             </Card>
        ))}
        {!isLoading && artists?.map((artist) => (
          <Link key={artist.id} href={`/artists/${artist.id}`} className="group">
            <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardHeader className="p-0">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={artist.avatarUrl || ''}
                    alt={artist.name}
                    fill
                    className="object-cover"
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
