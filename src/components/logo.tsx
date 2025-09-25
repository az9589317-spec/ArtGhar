import { Palette } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Palette className="h-6 w-6 text-primary transition-transform group-hover:rotate-12 md:h-7 md:w-7" />
      <span className="text-xl md:text-2xl font-headline font-bold text-foreground tracking-wide">
        ArtGhar
      </span>
    </Link>
  );
}
