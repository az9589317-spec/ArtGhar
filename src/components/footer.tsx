
'use client';
import { Logo } from './logo';
import { Twitter, Instagram, Facebook } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

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
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo />
          <p className="text-sm text-muted-foreground">
            &copy; {year} Artisanal Abode. All rights reserved.
          </p>
          <div className="flex gap-4">
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
    </footer>
  );
}
