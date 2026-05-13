"use client";

import { useEffect, useState } from "react";

export function FloatingRegisterCta() {
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const trigger = document.getElementById("highlight-register-trigger");
      const agendaEnd = document.getElementById("agenda-register-end");
      if (!trigger || !agendaEnd) return;

      const triggerBottom = trigger.getBoundingClientRect().bottom;
      const agendaEndTop = agendaEnd.getBoundingClientRect().top;
      const viewportHeight = window.innerHeight;

      const passedHighlightTrigger = triggerBottom < 0;
      const reachedAgendaEnd = agendaEndTop <= viewportHeight;

      setShowFloating(passedHighlightTrigger && !reachedAgendaEnd);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!showFloating) return null;

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center px-5 py-2 sm:px-8 lg:px-12">
      <a
        href="#register"
        className="hitech-interactive inline-flex h-12 items-center rounded-sm bg-[#7de6d5] px-10 text-base font-bold text-[#00153b] transition hover:brightness-95"
      >
        Register Now
      </a>
    </div>
  );
}
