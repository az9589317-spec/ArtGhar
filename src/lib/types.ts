
export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: {
    id: string;
    url: string;
    alt: string;
    hint: string;
  }[];
  artistId: string;
  category: string;
  imageUrl?: string;
};

export type Artist = {
  id: string;
  name: string;
  bio: string;
  avatar: {
    id: string;
    url: string;
    alt: string;
    hint: string;
  };
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
