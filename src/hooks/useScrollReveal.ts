'use client';
import { useEffect } from 'react';

export function useScrollReveal(selector = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger') {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, stop observing (one-shot reveal)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold:  0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

// Use this on a wrapper component that wraps every page
export function usePageReveal() {
  useScrollReveal('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger');
}
