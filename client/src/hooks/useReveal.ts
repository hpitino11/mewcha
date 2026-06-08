import { useEffect, useRef } from 'react';

export function useReveal(delay = 0) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const id = setTimeout(() => el.classList.add('is-visible'), delay);
          observer.disconnect();
          return () => clearTimeout(id);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref as React.RefObject<HTMLDivElement>;
}

// Staggered reveal for a list of children — attach to a container
export function useStaggerReveal(itemCount: number, stagger = 80) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const items = container.querySelectorAll<HTMLElement>('[data-stagger]');
        items.forEach((el, i) => {
          const delay = prefersReduced ? 0 : i * stagger;
          setTimeout(() => el.classList.add('is-visible'), delay);
        });
        observer.disconnect();
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [itemCount, stagger]);

  return ref as React.RefObject<HTMLDivElement>;
}

// Make TypeScript happy with the React import
import type React from 'react';
