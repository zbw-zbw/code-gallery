"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

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
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <a
            href="#features"
            className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-200 hidden sm:block"
          >
            功能
          </a>
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
        </nav>
      </div>
    </header>
  );
}
