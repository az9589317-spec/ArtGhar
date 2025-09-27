
'use client';
import { Logo } from './logo';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';

type SocialLinks = {
    twitter?: string;
    instagram?: string;
    facebook?: string;
}

export default function Footer() {
  const year = new Date().getFullYear();
  const firestore = useFirestore();

  const socialLinksRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'settings', 'socialMedia');
  }, [firestore]);

  const { data: socialLinks } = useDoc<SocialLinks>(socialLinksRef);

  return (
    <footer className="bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground max-w-sm text-center md:text-left">
              Discover unique, handcrafted pieces from talented artisans around the world.
            </p>
             <div className="flex gap-4 mt-2">
                {socialLinks?.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                )}
                {socialLinks?.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </a>
                )}
                {socialLinks?.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                    </a>
                )}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-bold text-foreground mb-4">Policies</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
              <Link href="/cancellations-and-refund" className="hover:text-primary transition-colors">Cancellations & Refund</Link>
            </div>
          </div>
           <div className="text-center md:text-left">
             <h3 className="font-bold text-foreground mb-4">Connect</h3>
             <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
              <Link href="/artists" className="hover:text-primary transition-colors">Our Artists</Link>
              <Link href="/products" className="hover:text-primary transition-colors">Shop All</Link>
             </div>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
           &copy; {year} ArtGhar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
