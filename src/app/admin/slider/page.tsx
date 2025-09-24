"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { getProducts } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const products = getProducts();

const formSchema = z.object({
  productIds: z.array(z.string()).refine((value) => value.length > 0 && value.length <= 3, {
    message: "You must select between 1 and 3 products for the slider.",
  }),
});

export default function AdminSliderPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // For demonstration, pre-select the first 3 products
      productIds: products.slice(0, 3).map(p => p.id),
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast({
      title: "Slider Updated!",
      description: "In a real app, the homepage would now show your selected products.",
    });
    console.log("Selected product IDs for slider:", data.productIds);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Homepage Slider</CardTitle>
            <CardDescription>
              Select up to 3 products to feature in the homepage carousel. The
              homepage currently shows the first 3 products by default.
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
                             <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                <Image 
                                    src={product.images[0].url}
                                    alt={product.images[0].alt}
                                    fill
                                    className="object-cover"
                                />
                             </div>
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
