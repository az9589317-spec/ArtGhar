import { Palette } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Palette className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
      <span className="text-2xl font-headline font-bold text-foreground tracking-wide">
        Artisanal Abode
      </span>
    </Link>
  );
}
