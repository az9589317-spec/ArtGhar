
import type { Artist as ArtistType, Category } from './types';
import { PlaceHolderImages } from './placeholder-images';

// This is a temporary type that matches the local data structure before it's seeded.
// The main `Artist` type in `types.ts` uses `avatarUrl`.
type LocalArtist = {
  id: string;
  name: string;
  bio: string;
  avatar: {
    id: string;
    url: string;
    alt: string;
    hint: string;
  };
};

// This is a temporary type that matches the local data structure before it's seeded.
// The main `Product` type in `types.ts` uses `imageUrls`.
type LocalProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: { id: string; url: string; alt: string; hint: string; }[];
  artistId: string;
  category: string;
};


// NOTE: This data is used for seeding the database on the /admin/data page.
// It is not the source of truth for what users see on the live site.
// The live site fetches data directly from Firestore.

const artists: LocalArtist[] = [
  { 
    id: '1', 
    name: 'Elena Vance', 
    bio: 'Elena Vance is a ceramic artist from the Pacific Northwest. Her work is inspired by the textures and colors of the natural world, resulting in functional pieces that bring a sense of calm and beauty to everyday rituals.',
    avatar: { id: 'artist-1', url: PlaceHolderImages.find(p => p.id === 'artist-1')?.imageUrl!, alt: 'Portrait of Elena Vance', hint: 'artist portrait' } 
  },
  { 
    id: '2', 
    name: 'Marcus Reid', 
    bio: 'Marcus Reid is a painter and illustrator whose vibrant, abstract works explore the interplay of color and emotion. He uses bold strokes and a dynamic palette to create pieces that are both energetic and thought-provoking.',
    avatar: { id: 'artist-2', url: PlaceHolderImages.find(p => p.id === 'artist-2')?.imageUrl!, alt: 'Portrait of Marcus Reid', hint: 'artist portrait' } 
  },
  { 
    id: '3', 
    name: 'Clara Jenkins', 
    bio: 'Clara Jenkins is a jewelry designer who works with recycled metals and ethically sourced gemstones. Her designs are delicate and minimalist, inspired by celestial patterns and ancient symbols.',
    avatar: { id: 'artist-3', url: PlaceHolderImages.find(p => p.id === 'artist-3')?.imageUrl!, alt: 'Portrait of Clara Jenkins', hint: 'artist portrait' }
  },
];

const categories: Category[] = [
    { id: '1', name: 'Pottery', slug: 'pottery' },
    { id: '2', name: 'Oil Painting', slug: 'oil-painting' },
    { id: '3', name: 'Jewelry', slug: 'jewelry' },
    { id: '4', name: 'Textiles', slug: 'textiles' },
    { id: '5', name: 'Home Goods', slug: 'home-goods' },
    { id: '6', name: 'Prints', slug: 'prints' },
    { id: '7', name: 'Bouquet', slug: 'bouquet' },
    { id: '8', name: 'Sculpture', slug: 'sculpture' },
    { id: '9', name: 'Glass Art', slug: 'glass-art' },
    { id: '10', name: 'Woodworking', slug: 'woodworking' },
    { id: '11', name: 'Leathercraft', slug: 'leathercraft' },
    { id: '13', name: 'Acrylic Painting', slug: 'acrylic-painting' },
    { id: '14', name: 'Watercolor Painting', slug: 'watercolor-painting' },
    { id: '15', name: 'Abstract Painting', slug: 'abstract-painting' },
    { id: '16', name: 'Landscape Painting', slug: 'landscape-painting' },
    { id: '17', name: 'Portrait Painting', slug: 'portrait-painting' },
    { id: '12', name: 'Others', slug: 'others' },
]

const products: LocalProduct[] = [
  {
    id: '1',
    name: 'Ceramic Mug Set',
    slug: 'ceramic-mug-set',
    description: 'A set of two handcrafted ceramic mugs, perfect for your morning coffee. Each piece is unique, with a speckled glaze finish.',
    price: 45.00,
    images: [{ id: 'product-1', url: PlaceHolderImages.find(p => p.id === 'product-1')?.imageUrl!, alt: 'A set of handcrafted ceramic mugs.', hint: 'ceramic mugs' }],
    artistId: '1',
    category: 'Pottery',
  },
  {
    id: '2',
    name: '“Crimson Flow” Abstract Painting',
    slug: 'crimson-flow-abstract-painting',
    description: 'A large abstract oil painting on canvas. "Crimson Flow" features a dynamic composition of red, gold, and black.',
    price: 350.00,
    images: [{ id: 'product-2', url: PlaceHolderImages.find(p => p.id === 'product-2')?.imageUrl!, alt: 'An abstract oil painting with vibrant colors.', hint: 'abstract painting' }],
    artistId: '2',
    category: 'Abstract Painting',
  },
  {
    id: '3',
    name: 'Silver Leaf Pendant Necklace',
    slug: 'silver-leaf-pendant-necklace',
    description: 'A delicate necklace made from recycled sterling silver, featuring a hand-hammered leaf pendant on a fine chain.',
    price: 75.00,
    images: [{ id: 'product-3', url: PlaceHolderImages.find(p => p.id === 'product-3')?.imageUrl!, alt: 'A delicate silver necklace with a leaf pendant.', hint: 'silver necklace' }],
    artistId: '3',
    category: 'Jewelry',
  },
  {
    id: '4',
    name: 'Handwoven Wool Throw',
    slug: 'handwoven-wool-throw',
    description: 'A cozy and warm throw blanket, handwoven from 100% merino wool with a timeless geometric pattern.',
    price: 180.00,
    images: [{ id: 'product-4', url: PlaceHolderImages.find(p => p.id === 'product-4')?.imageUrl!, alt: 'A handwoven wool blanket with geometric patterns.', hint: 'woven blanket' }],
    artistId: '1',
    category: 'Textiles',
  },
  {
    id: '5',
    name: 'Soy Candle Set',
    slug: 'soy-candle-set',
    description: 'A set of four scented soy candles in reusable glass jars. Scents include Lavender, Sandalwood, Lemon Verbena, and Eucalyptus.',
    price: 55.00,
    images: [{ id: 'product-5', url: PlaceHolderImages.find(p => p.id === 'product-5')?.imageUrl!, alt: 'A set of four scented soy candles in glass jars.', hint: 'scented candles' }],
    artistId: '3',
    category: 'Home Goods',
  },
  {
    id: '6',
    name: 'Embossed Leather Journal',
    slug: 'embossed-leather-journal',
    description: 'A beautiful journal bound in soft, genuine leather with an embossed cover. Contains 200 pages of unlined, handmade paper.',
    price: 60.00,
    images: [{ id: 'product-6', url: PlaceHolderImages.find(p => p.id === 'product-6')?.imageUrl!, alt: 'A leather-bound journal with embossed details.', hint: 'leather journal' }],
    artistId: '2',
    category: 'Home Goods',
  },
  {
    id: '7',
    name: 'Forest Vista Watercolor Print',
    slug: 'forest-vista-watercolor-print',
    description: 'A high-quality giclée print of an original watercolor painting depicting a misty forest landscape. Available in multiple sizes.',
    price: 40.00,
    images: [{ id: 'product-7', url: PlaceHolderImages.find(p => p.id === 'product-7')?.imageUrl!, alt: 'A watercolor print of a forest landscape.', hint: 'watercolor print' }],
    artistId: '2',
    category: 'Prints',
  },
  {
    id: '8',
    name: 'Hand-Carved Wooden Bowl',
    slug: 'hand-carved-wooden-bowl',
    description: 'A decorative bowl hand-carved from a single piece of maple wood, finished with a food-safe oil. Ideal as a centerpiece or for serving.',
    price: 120.00,
    images: [{ id: 'product-8', url: PlaceHolderImages.find(p => p.id === 'product-8')?.imageUrl!, alt: 'A hand-carved wooden bowl.', hint: 'wooden bowl' }],
    artistId: '1',
    category: 'Home Goods',
  },
];

export function getProducts() {
  return products.map(p => ({ ...p, imageUrls: p.images.map(i => i.url) }));
}

export function getProductBySlug(slug: string) {
  const product = products.find(p => p.slug === slug);
  return product ? { ...product, imageUrls: product.images.map(i => i.url) } : undefined;
}

export function getProductsByArtist(artistId: string) {
    const artistProducts = products.filter(p => p.artistId === artistId);
    return artistProducts.map(p => ({ ...p, imageUrls: p.images.map(i => i.url) }));
}

export function getArtists(): LocalArtist[] {
  return artists;
}

export function getArtistById(id: string) {
  return artists.find(a => a.id === id);
}

export function getCategories() {
    return categories;
}
