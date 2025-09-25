
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useDoc, useFirestore, useMemoFirebase } from "@/firebase"
import { doc, setDoc } from "firebase/firestore"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  twitter: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  instagram: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
  facebook: z.string().url({ message: "Please enter a valid URL." }).or(z.literal('')),
});

type SocialLinks = z.infer<typeof formSchema>;

export default function SocialMediaPage() {
    const { toast } = useToast();
    const firestore = useFirestore();

    const settingsRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return doc(firestore, 'settings', 'socialMedia');
    }, [firestore]);
    
    const { data: socialLinks, isLoading } = useDoc<SocialLinks>(settingsRef);
    
    const form = useForm<SocialLinks>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            twitter: "",
            instagram: "",
            facebook: "",
        },
    });

    useEffect(() => {
        if (socialLinks) {
            form.reset(socialLinks);
        }
    }, [socialLinks, form]);
    
    async function onSubmit(values: SocialLinks) {
        if (!firestore || !settingsRef) {
            toast({ variant: "destructive", title: "Error", description: "Firestore is not available." });
            return;
        }

        try {
            await setDoc(settingsRef, values, { merge: true });
            toast({
                title: "Social Links Updated!",
                description: "Your social media links have been saved.",
            });
        } catch (error) {
            console.error("Error updating social links:", error);
            toast({
                variant: "destructive",
                title: "Error Saving",
                description: "Could not save your social media links. Please try again.",
            });
        }
    }

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Manage Social Media</CardTitle>
                    <CardDescription>Link to your social media profiles from the website footer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <Loader2 className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Manage Social Media</CardTitle>
                        <CardDescription>Link to your social media profiles from the website footer. Leave blank to hide an icon.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twitter URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://twitter.com/your-profile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Instagram URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://instagram.com/your-profile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="facebook"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Facebook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://facebook.com/your-profile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                             {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}
