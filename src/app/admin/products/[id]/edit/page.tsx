
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter, useParams, notFound } from "next/navigation"
import React, { useEffect, useState } from "react"
import Image from "next/image"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useDoc, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase"
import { collection, doc, updateDoc } from "firebase/firestore"
import type { Artist, Category, Product } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, UploadCloud } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.coerce.number().positive({
    message: "Price must be a positive number.",
  }),
  artistId: z.string({
    required_error: "Please select an artist.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
  imageUrl: z.string().url({ message: "Please upload an image." }),
});

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams();
  const { id } = params;
  const { toast } = useToast()
  const firestore = useFirestore()
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const productRef = useMemoFirebase(() => (firestore && typeof id === 'string') ? doc(firestore, 'products', id) : null, [firestore, id]);
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);

  const artistsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'artists') : null, [firestore]);
  const categoriesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'categories') : null, [firestore]);

  const { data: artists } = useCollection<Artist>(artistsQuery);
  const { data: categories } = useCollection<Category>(categoriesQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset(product);
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    }
  }, [product, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return;

    setIsUploading(true)
    setImagePreview(URL.createObjectURL(file))

    const formData = new FormData()
    formData.append("source", file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json()

      if (response.ok) {
        form.setValue("imageUrl", result.image.url, { shouldValidate: true })
        toast({ title: "Image Uploaded", description: "Your new image is ready." })
      } else {
        throw new Error(result.error?.message || "Unknown error occurred")
      }
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "There was a problem uploading the image.",
      });
      // Revert to original image if upload fails
      setImagePreview(product?.imageUrl || null);
      form.setValue("imageUrl", product?.imageUrl || "", { shouldValidate: true });
    } finally {
      setIsUploading(false)
    }
  }


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore || !productRef) {
        toast({ variant: "destructive", title: "Error", description: "Firestore is not available" });
        return;
    }
    const slug = values.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const productData = { ...values, slug };

    updateDoc(productRef, productData).catch(error => {
        const contextualError = new FirestorePermissionError({
            operation: 'update',
            path: productRef.path,
            requestResourceData: productData
        });
        errorEmitter.emit('permission-error', contextualError);
    });
    
    toast({
        title: "Product Updated!",
        description: `${values.name} has been successfully updated.`,
    });
    router.push("/admin/products");
  }

  if (isProductLoading) {
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
                <Skeleton className="h-20 w-full" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  if (!product) {
      return notFound();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Product</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Handcrafted Ceramic Mug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the product in detail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 45.00" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            {categories?.map(category => (
                                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <FormField
              control={form.control}
              name="artistId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artist</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an artist" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {artists?.map(artist => (
                        <SelectItem key={artist.id} value={artist.id}>{artist.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Assign this product to an artist.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Image</FormLabel>
                  <FormControl>
                    <div>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="relative flex justify-center items-center h-48 w-full rounded-md border-2 border-dashed border-input bg-background hover:bg-accent text-muted-foreground">
                          {isUploading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                          ) : imagePreview ? (
                            <Image src={imagePreview} alt="Image preview" fill className="object-contain rounded-md p-2" />
                          ) : (
                            <div className="text-center">
                              <UploadCloud className="mx-auto h-8 w-8" />
                              <p>Click to upload an image</p>
                              <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </label>
                      <Input
                        id="image-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleImageUpload}
                        accept="image/png, image/jpeg, image/gif"
                        disabled={isUploading}
                      />
                    </div>
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
