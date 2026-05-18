"use client";

import Image from "next/image";
import { useState } from "react";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#000029]">
      <div className="flex w-full items-center justify-between px-6 py-4 sm:px-10 lg:px-12 xl:px-16">
        <Image
          src="/siemens-3-logo-png-transparent2.png"
          alt="Siemens"
          width={272}
          height={68}
          priority
          className="h-14 w-auto sm:h-16"
        />

        <nav className="hidden items-center gap-7 text-base font-semibold text-[#00d7c7] sm:flex sm:text-lg">
          <a
            href="#highlights"
            className="hitech-interactive rounded px-2 py-1 transition hover:text-[#7de6d5]"
          >
            Summit Highlights
          </a>
          <a
            href="#agenda"
            className="hitech-interactive rounded px-2 py-1 transition hover:text-[#7de6d5]"
          >
            Program
          </a>
          <a
            href="#register"
            className="hitech-interactive rounded px-2 py-1 transition hover:text-[#7de6d5]"
          >
            Register Now
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="hitech-interactive inline-flex h-10 w-10 items-center justify-center rounded border border-white/30 text-white sm:hidden"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <span className="text-lg">{isOpen ? "X" : "≡"}</span>
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-[#000029] px-4 pb-4 pt-2 sm:hidden">
          <div className="flex flex-col gap-2 text-sm font-semibold text-[#00d7c7]">
            <a
              href="#highlights"
              onClick={closeMenu}
              className="hitech-interactive rounded px-3 py-2 hover:text-[#7de6d5]"
            >
              Summit Highlights
            </a>
            <a
              href="#agenda"
              onClick={closeMenu}
              className="hitech-interactive rounded px-3 py-2 hover:text-[#7de6d5]"
            >
              Program
            </a>
            <a
              href="#register"
              onClick={closeMenu}
              className="hitech-interactive rounded px-3 py-2 hover:text-[#7de6d5]"
            >
              Register Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
