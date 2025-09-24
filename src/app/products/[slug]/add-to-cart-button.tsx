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
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      slug: product.slug,
    });
    toast({
      title: "Added to cart!",
      description: `${product.name} is now in your cart.`,
    });
  };

  return (
    <Button size="lg" onClick={handleAddToCart}>
      <ShoppingBag className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  )
}
