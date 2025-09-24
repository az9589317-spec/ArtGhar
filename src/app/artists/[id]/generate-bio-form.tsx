"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { generateArtistBio } from "@/ai/flows/generate-artist-bio";
import type { Artist, Product } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  pastSalesDescription: z.string().min(10, "Please provide a bit more detail."),
});

type GenerateBioFormProps = {
  artist: Artist;
  products: Product[];
};

export default function GenerateBioForm({ artist, products }: GenerateBioFormProps) {
  const [bio, setBio] = useState(artist.bio);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pastSalesDescription: "I have sold over 100 pieces to happy customers worldwide and was featured in 'Artisan Monthly' magazine last year.",
    },
  });

  const productCategories = [...new Set(products.map(p => p.category))].join(', ');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
      const result = await generateArtistBio({
        artistName: artist.name,
        productCategories: productCategories || "various handmade goods",
        pastSalesDescription: values.pastSalesDescription,
      });
      if (result.bio) {
        setBio(result.bio);
        toast({ title: "Success!", description: "A new bio has been generated." });
      }
    } catch (error) {
      console.error("Error generating bio:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem generating the bio. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mt-4 max-w-2xl w-full">
      <Card className="bg-background/70">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">About Me</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80 mb-6 whitespace-pre-line">{bio}</p>

          <Card className="mt-6 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg font-headline">Generate a New Bio with AI</CardTitle>
              <CardDescription>
                Not happy with the current bio? Describe your achievements and let AI write a new one for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="pastSalesDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievements / Past Sales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., Sold over 500 prints, featured in a local gallery..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Bio"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
