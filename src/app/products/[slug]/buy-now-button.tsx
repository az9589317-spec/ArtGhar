
'use client'

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function BuyNowButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  const handleBuyNow = () => {
    const imageUrl = product.imageUrls?.[0];
     if (!imageUrl) {
        toast({
            variant: "destructive",
            title: "Cannot Buy Now",
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
    router.push('/checkout');
  };

  return (
    <Button size="lg" onClick={handleBuyNow}>
      Buy Now
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  )
}
