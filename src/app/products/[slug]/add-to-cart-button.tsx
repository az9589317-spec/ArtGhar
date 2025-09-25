
'use client'

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { ShoppingBag } from "lucide-react"

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const imageUrl = product.imageUrls?.[0];
    if (!imageUrl) {
        toast({
            variant: "destructive",
            title: "Cannot Add to Cart",
            description: "This product is missing images.",
        });
        return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      slug: product.slug,
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <Button size="lg" variant="outline" onClick={handleAddToCart}>
      <ShoppingBag className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  )
}
