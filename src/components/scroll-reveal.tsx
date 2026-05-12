"use client";

import { useEffect, useRef } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
};

export function ScrollReveal({ children, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.classList.add("reveal-visible");
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-on-scroll ${className ?? ""}`}>
      {children}
    </div>
  );
}
