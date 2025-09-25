
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { generateArtistBio } from "@/ai/flows/generate-artist-bio"
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
import { Loader2 } from "lucide-react"
import { useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase"
import { collection, addDoc } from "firebase/firestore"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Artist name must be at least 2 characters.",
  }),
  bio: z.string().min(10, {
    message: "Bio must be at least 10 characters.",
  }),
  productCategories: z.string().min(3, {
    message: "Please list at least one product category.",
  }),
  pastSalesDescription: z.string().optional(),
  avatarUrl: z.string().url({ message: "Please enter a valid image URL for the avatar." }),
});

export default function AddArtistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const firestore = useFirestore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      productCategories: "Pottery, Paintings",
      pastSalesDescription: "Sold over 100 pieces to happy customers worldwide.",
      avatarUrl: "",
    },
  })

  async function handleGenerateBio() {
    setIsGenerating(true);
    const { name, productCategories, pastSalesDescription } = form.getValues();
    if (!name || !productCategories) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill out the artist's name and product categories to generate a bio.",
      });
      setIsGenerating(false);
      return;
    }

    try {
      const result = await generateArtistBio({
        artistName: name,
        productCategories,
        pastSalesDescription,
      });
      if (result.bio) {
        form.setValue("bio", result.bio, { shouldValidate: true });
        toast({ title: "Success!", description: "A new bio has been generated." });
      }
    } catch (error) {
      console.error("Error generating bio:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "There was a problem generating the bio. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
      toast({ variant: "destructive", title: "Error", description: "Firestore is not available" });
      return;
    }

    const { name, bio, avatarUrl } = values;
    const artistsCollection = collection(firestore, 'artists');
    const artistData = { name, bio, avatarUrl };
    
    addDoc(artistsCollection, artistData).catch(error => {
        const contextualError = new FirestorePermissionError({
            operation: 'create',
            path: 'artists/[new_id]',
            requestResourceData: artistData
        });
        errorEmitter.emit('permission-error', contextualError);
    });
    
    toast({
        title: "Artist Added!",
        description: `${name} has been successfully added.`,
    });
    router.push("/admin/artists");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Artist</CardTitle>
        <CardDescription>Add a new artist to your platform. Use the AI bio generator for a creative boost!</CardDescription>
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
             <Card className="border-dashed">
                <CardHeader>
                    <CardTitle className="text-lg">Bio Generation</CardTitle>
                    <CardDescription>Provide some details and let AI write the artist's bio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                    control={form.control}
                    name="productCategories"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Product Categories</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Ceramics, Watercolor Paintings, Jewelry" {...field} />
                        </FormControl>
                        <FormDescription>
                            Comma-separated list of what the artist creates.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="pastSalesDescription"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Achievements / Past Sales (Optional)</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., Featured in Artisan Monthly, sold over 500 prints..." {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <Button type="button" variant="outline" onClick={handleGenerateBio} disabled={isGenerating}>
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Bio with AI
                    </Button>
                </CardContent>
             </Card>

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

            <Button type="submit">Add Artist</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
