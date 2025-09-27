
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useParams, notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase"
import { doc, updateDoc } from "firebase/firestore"
import type { Artist } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Artist name must be at least 2 characters.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  avatarUrl: z.string().url({ message: "Please enter a valid image URL for the avatar." }),
});

export default function EditArtistPage() {
  const router = useRouter()
  const params = useParams();
  const { id } = params;
  const { toast } = useToast()
  const firestore = useFirestore()

  const artistRef = useMemoFirebase(() => (firestore && typeof id === 'string') ? doc(firestore, 'artists', id) : null, [firestore, id]);
  const { data: artist, isLoading: isArtistLoading } = useDoc<Artist>(artistRef);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      avatarUrl: "",
    },
  })

  useEffect(() => {
    if (artist) {
      form.reset(artist);
    }
  }, [artist, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !artistRef) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available" });
      return;
    }

    updateDoc(artistRef, values).catch(error => {
        const contextualError = new FirestorePermissionError({
            operation: 'update',
            path: artistRef.path,
            requestResourceData: values
        });
        errorEmitter.emit('permission-error', contextualError);
    });
    
    toast({
        title: "Artist Updated!",
        description: `${values.name} has been successfully updated.`,
    });
    router.push("/admin/artists");
  }

  if (isArtistLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!artist) {
      return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Artist</CardTitle>
        <CardDescription>Update the details for this artist.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Elena Vance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                   <FormDescription>
                    URL for the artist's profile picture.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A short biography of the artist..."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

