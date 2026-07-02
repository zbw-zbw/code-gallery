"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import KeyboardShortcuts from "./KeyboardShortcuts";

interface PlaygroundLayoutProps {
  children: ReactNode;
}

export default function PlaygroundLayout({ children }: PlaygroundLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useFocusTrap({ open: menuOpen, onClose: () => setMenuOpen(false), containerRef: menuRef });

  return (
    <div className="h-screen flex flex-col bg-gallery-white">
      {/* Top bar */}
      <header className="h-14 flex items-center px-4 bg-gallery-white flex-shrink-0 border-b border-gallery-border/30">
        <div className="flex items-center gap-2.5">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
            aria-expanded={menuOpen}
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

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-code-purple to-flow-blue flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg
                width="14"
                height="14"
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
            <span className="text-base font-bold text-gallery-black tracking-tight hidden sm:inline">
              代码画廊
            </span>
          </Link>
        </div>

        <h1 className="flex-1 text-center text-sm font-medium text-gallery-gray">Playground</h1>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/#features" className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-200">
            功能
          </Link>
          <Link href="/examples" className="text-sm text-gallery-gray hover:text-gallery-black transition-colors duration-200">
            示例
          </Link>
          <div className="w-7" />
        </nav>

        {/* Mobile spacer */}
        <div className="md:hidden w-9" />
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          <motion.div
            ref={menuRef}
            className="fixed top-14 left-0 right-0 z-50 bg-gallery-white shadow-lg md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <nav className="px-4 py-3 space-y-1" aria-label="移动端导航">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
              >
                首页
              </Link>
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
            </nav>
          </motion.div>
        </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main id="main" className="flex-1 min-h-0 overflow-auto md:overflow-hidden flex flex-col">{children}</main>

      {/* Global keyboard shortcuts panel */}
      <KeyboardShortcuts />
    </div>
  );
}
