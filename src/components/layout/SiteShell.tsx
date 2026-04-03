'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Scroll-reveal observer — runs on every route change
  useEffect(() => {
    const SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger';

    const revealAll = () => {
      document.querySelectorAll<HTMLElement>(SELECTOR).forEach(el => {
        el.classList.add('visible');
      });
    };

    const run = () => {
      const elements = document.querySelectorAll<HTMLElement>(SELECTOR);
      if (!elements.length) return () => {};

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        // rootMargin positive top so elements above fold are caught immediately
        { threshold: 0, rootMargin: '120px 0px 0px 0px' }
      );
      elements.forEach((el) => observer.observe(el));

      // Safety fallback — if observer misses anything, reveal all after 1.5s
      const fallback = setTimeout(revealAll, 1500);

      return () => {
        observer.disconnect();
        clearTimeout(fallback);
      };
    };

    // Run immediately + after short paint delay
    const cleanup = run();
    const t = setTimeout(run, 100);

    return () => {
      cleanup();
      clearTimeout(t);
    };
  }, [pathname]);

  if (pathname.startsWith('/admin')) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}