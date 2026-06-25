"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface PlaygroundLayoutProps {
  children: ReactNode;
}

export default function PlaygroundLayout({ children }: PlaygroundLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-gallery-white">
      {/* Simplified top bar */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-gallery-border bg-gallery-white flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
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
          <span className="text-base font-bold text-gallery-black tracking-tight">
            代码画廊
          </span>
        </Link>

        <h1 className="text-sm font-medium text-gallery-gray">Playground</h1>

        <div className="w-20" />
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
