
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
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {year} ArtGhar. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2 text-sm text-muted-foreground">
            <h3 className="font-bold text-foreground mb-2">Policies</h3>
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
            <Link href="/cancellations-and-refund" className="hover:text-primary transition-colors">Cancellations & Refund</Link>
          </div>
           <div className="flex flex-col items-center md:items-start gap-2 text-sm text-muted-foreground">
             <h3 className="font-bold text-foreground mb-2">Connect</h3>
             <Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link>
            <div className="flex gap-4 mt-2">
                {socialLinks?.twitter && (
                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Twitter className="h-5 w-5" />
                        <span className="sr-only">Twitter</span>
                    </a>
                )}
                {socialLinks?.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Instagram className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </a>
                )}
                {socialLinks?.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Facebook className="h-5 w-5" />
                        <span className="sr-only">Facebook</span>
                    </a>
                )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
