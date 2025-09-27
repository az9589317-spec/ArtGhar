
import { Timestamp } from "firebase/firestore";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  artistId: string;
  categoryId: string;
  imageUrls?: string[];
};

export type Artist = {
  id: string;
  name: string;
  bio: string;
  avatarUrl?: string;
};

export type Category = {
  id:string;
  name: string;
  slug: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
};

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type ProductInOrder = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export type ShippingAddress = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

export type Order = {
  id: string;
  orderId?: string; // Add this to match the structure we send to the API
  userId: string;
  createdAt: Timestamp | any;
  status: OrderStatus;
  products: ProductInOrder[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentDetails?: {
    gateway: string;
    orderId?: string;
    paymentId?: string;
  }
};

    