
'use client';

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantitySelector({ quantity, onQuantityChange, min = 1, max = 99 }: QuantitySelectorProps) {
  const handleDecrement = () => {
    const newQuantity = Math.max(min, quantity - 1);
    onQuantityChange(newQuantity);
  };

  const handleIncrement = () => {
    const newQuantity = Math.min(max, quantity + 1);
    onQuantityChange(newQuantity);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < min) {
      value = min;
    }
    if (value > max) {
      value = max;
    }
    onQuantityChange(value);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrement}
        disabled={quantity <= min}
      >
        <Minus className="h-4 w-4" />
        <span className="sr-only">Decrease quantity</span>
      </Button>
      <input
        type="text"
        className="w-12 h-8 rounded-md border-input border text-center text-sm"
        value={quantity}
        onChange={handleChange}
        aria-label="Quantity"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrement}
        disabled={quantity >= max}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Increase quantity</span>
      </Button>
    </div>
  );
}
