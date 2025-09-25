
'use client';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Artist } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon } from "lucide-react";

export default function AdminArtistsPage() {
    const firestore = useFirestore();
    const artistsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'artists');
    }, [firestore]);

    const { data: artists, isLoading } = useCollection<Artist>(artistsQuery);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Artists</CardTitle>
          <Button asChild>
            <Link href="/admin/artists/new">Add Artist</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Bio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell>
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-full" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && artists?.map((artist) => (
                <TableRow key={artist.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border">
                      {artist.avatarUrl ? (
                        <Image 
                          src={artist.avatarUrl} 
                          alt={artist.name} 
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                           <UserIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{artist.name}</TableCell>
                  <TableCell className="text-muted-foreground line-clamp-3">{artist.bio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && artists?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No artists found. Add one to get started.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
