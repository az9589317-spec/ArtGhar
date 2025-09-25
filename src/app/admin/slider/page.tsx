
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  productIds: z.array(z.string()).refine((value) => value.length > 0 && value.length <= 3, {
    message: "You must select between 1 and 3 products for the slider.",
  }),
});

export default function AdminSliderPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'products');
  }, [firestore]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Pre-select first 3 products once loaded
      productIds: [],
    },
  });

  // Set default values once products are loaded
  React.useEffect(() => {
    if (products) {
      form.reset({
        productIds: products.slice(0, 3).map(p => p.id),
      });
    }
  }, [products, form]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "Slider Updated!",
      description: "In a real app, the homepage would now show your selected products.",
    });
    console.log("Selected product IDs for slider:", data.productIds);
  }

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Homepage Slider</CardTitle>
                <CardDescription>
                Select up to 3 products to feature in the homepage carousel.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
  }

  if (!products || products.length === 0) {
    return (
        <Card>
             <CardHeader>
                <CardTitle>Homepage Slider</CardTitle>
             </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground py-12">No products found. Please add products to manage the homepage slider.</p>
            </CardContent>
        </Card>
    )
  }


  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Homepage Slider</CardTitle>
            <CardDescription>
              Select up to 3 products to feature in the homepage carousel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="productIds"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  {products.map((product) => (
                    <FormField
                      key={product.id}
                      control={form.control}
                      name="productIds"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={product.id}
                            className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4"
                          >
                            <Checkbox
                              checked={field.value?.includes(product.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), product.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== product.id
                                      )
                                    );
                              }}
                            />
                             {product.imageUrls && product.imageUrls[0] && (
                                <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                    <Image 
                                        src={product.imageUrls[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                             )}
                            <FormLabel className="font-normal w-full cursor-pointer">
                              {product.name}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Slider</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
