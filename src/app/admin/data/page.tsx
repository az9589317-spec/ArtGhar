
"use client"

import { useState } from "react"
import { getFirestore, writeBatch, doc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getProducts, getArtists, getCategories } from "@/lib/data"
import { initializeFirebase } from "@/firebase"
import { Loader2 } from "lucide-react"

export default function DataPage() {
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    const { firestore } = initializeFirebase()
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Firestore not available",
        description: "Please check your Firebase configuration.",
      })
      setIsSeeding(false)
      return
    }

    try {
      const batch = writeBatch(firestore)

      // Seed products
      const products = getProducts()
      products.forEach((product) => {
        const { images, ...productData } = product; // Exclude local-only fields if necessary
        const productRef = doc(firestore, "products", product.id)
        batch.set(productRef, productData)
      })

      // Seed artists
      const artists = getArtists()
      artists.forEach((artist) => {
        const { avatar, ...artistData } = artist;
        const artistRef = doc(firestore, "artists", artist.id)
        batch.set(artistRef, {
            ...artistData,
            avatarUrl: avatar.url, // Store URL directly
        })
      })
        
      // Seed categories
      const categories = getCategories()
      categories.forEach((category) => {
        const categoryRef = doc(firestore, "categories", category.id)
        batch.set(categoryRef, category)
      })

      await batch.commit()

      toast({
        title: "Database Seeded!",
        description: `${products.length} products, ${artists.length} artists, and ${categories.length} categories have been added to Firestore.`,
      })
    } catch (error: any) {
      console.error("Error seeding database:", error)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not seed the database. Check console for details.",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
        <CardDescription>
          Use this section to manage your application's data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Click the button below to populate your Firestore database with the
            initial set of products, artists, and categories defined in the
            application code. This is useful for initial setup or for resetting
            your data to the default state.
          </p>
          <p className="font-semibold text-destructive">
            Warning: This will overwrite any existing data in the 'products', 'artists', and 'categories' collections with the same IDs.
          </p>
          <Button onClick={handleSeedDatabase} disabled={isSeeding}>
            {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Seed Database
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
