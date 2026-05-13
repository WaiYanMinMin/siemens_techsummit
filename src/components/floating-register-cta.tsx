"use client";

import { useEffect, useState } from "react";

type FloatingRegisterCtaProps = {
  startId: string;
  endId: string;
};

export function FloatingRegisterCta({ startId, endId }: FloatingRegisterCtaProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const startEl = document.getElementById(startId);
      const endEl = document.getElementById(endId);
      if (!startEl || !endEl) return;

      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();
      const stickyBottomOffset = 12; // bottom-3
      const buttonHeight = 36; // h-9
      const stopBuffer = 8;

      const stopLine = window.innerHeight - (stickyBottomOffset + buttonHeight + stopBuffer);
      const ended = endRect.top <= stopLine;
      
      const startOffset = 100; // tweak this
      const started = startRect.top <= window.innerHeight - startOffset;
      setIsVisible(started && !ended);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [startId, endId]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-4 py-2 sm:px-8 lg:px-12">
      <a
        href="#register"
        className="hitech-interactive inline-flex h-9 items-center rounded-sm bg-[#7de6d5] px-5 text-[11px] font-bold text-[#00153b] transition hover:brightness-95 sm:h-11 sm:px-8 sm:text-sm"
      >
        Register Now
      </a>
    </div>
  );
}
