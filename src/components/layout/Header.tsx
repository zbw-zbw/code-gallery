"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-gallery-white/80 backdrop-blur-md transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-code-purple to-flow-blue flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gallery-black tracking-tight">
            代码画廊
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            href="/#features"
            className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-200 hidden sm:block"
          >
            功能
          </Link>
          <Link
            href="/examples"
            className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-200 hidden sm:block"
          >
            示例
          </Link>
          <Link
            href="/playground"
            className="text-sm font-medium bg-code-purple hover:bg-code-purple-light text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Playground
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
            aria-label="菜单"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </nav>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gallery-white px-4 py-3 space-y-1">
          <Link
            href="/#features"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
          >
            功能
          </Link>
          <Link
            href="/examples"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
          >
            示例
          </Link>
          <Link
            href="/playground"
            onClick={() => setMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-code-purple hover:bg-gallery-bg transition-colors duration-200"
          >
            Playground
          </Link>
        </div>
      )}
    </header>
  );
}
