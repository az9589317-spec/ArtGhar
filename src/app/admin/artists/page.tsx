
'use client';
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";
import type { Artist } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { User as UserIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


export default function AdminArtistsPage() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [artistToDelete, setArtistToDelete] = useState<Artist | null>(null);

    const artistsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'artists');
    }, [firestore]);

    const { data: artists, isLoading } = useCollection<Artist>(artistsQuery);

    const handleDeleteClick = (artist: Artist) => {
        setArtistToDelete(artist);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!artistToDelete || !firestore) return;
        const artistRef = doc(firestore, 'artists', artistToDelete.id);
        try {
            await deleteDoc(artistRef);
            toast({
                title: "Artist Deleted",
                description: `"${artistToDelete.name}" has been successfully deleted.`,
            });
        } catch (error) {
            console.error("Error deleting artist:", error);
            toast({
                variant: "destructive",
                title: "Error Deleting Artist",
                description: "There was a problem deleting the artist. Please try again.",
            });
        } finally {
            setShowDeleteDialog(false);
            setArtistToDelete(null);
        }
    };


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
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
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
                    <TableCell>
                        <Skeleton className="h-8 w-8" />
                    </TableCell>
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
                   <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                           <Link href={`/admin/artists/${artist.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4"/>
                              Edit
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(artist)} className="text-destructive">
                           <Trash2 className="mr-2 h-4 w-4"/>
                           Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!isLoading && artists?.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No artists found. Add one to get started.</p>
           )}
        </CardContent>
      </Card>
       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the artist
              "{artistToDelete?.name}" and all of their associated products.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
