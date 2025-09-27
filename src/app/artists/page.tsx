
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Artist } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { User as UserIcon, ArrowRight } from 'lucide-react';


export default function ArtistsPage() {
  const firestore = useFirestore();
  const artistsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'artists');
  }, [firestore]);

  const { data: artists, isLoading } = useCollection<Artist>(artistsQuery);


  return (
    <div className="bg-brand-sand">
        <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-center mb-12">
            Meet Our Artisans
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col h-full overflow-hidden">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <CardContent className="p-6 text-center space-y-2">
                        <Skeleton className="h-8 w-1/2 mx-auto" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                     <CardFooter className="p-6 pt-0 mt-auto">
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
            {!isLoading && artists?.map((artist) => (
            <Card key={artist.id} className="group flex flex-col bg-white/50 overflow-hidden rounded-lg shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="aspect-[4/3] relative">
                  {artist.avatarUrl ? (
                     <Image
                        src={artist.avatarUrl}
                        alt={artist.name}
                        fill
                        className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                        <UserIcon className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              <CardContent className="p-6 text-center">
                <h2 className="text-2xl font-headline font-bold text-foreground">
                  {artist.name}
                </h2>
                <p className="mt-2 text-muted-foreground line-clamp-3 h-[4.5rem]">
                  {artist.bio}
                </p>
              </CardContent>
               <CardFooter className="p-6 pt-0 mt-auto">
                 <Button asChild className="w-full" variant="outline">
                    <Link href={`/artists/${artist.id}`}>
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
               </CardFooter>
            </Card>
            ))}
        </div>
        </div>
    </div>
  );
}
