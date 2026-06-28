"use client";

import { useState, useRef, useEffect } from "react";
import { Language } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface LanguageSelectorProps {
  value: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector({
  value,
  onChange,
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const selected = SUPPORTED_LANGUAGES.find((l) => l.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useFocusTrap({ open, onClose: () => setOpen(false), containerRef: panelRef });

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-code-surface hover:bg-gallery-border/20 transition-colors duration-200 text-sm text-code-text"
        aria-label={`选择语言，当前: ${selected?.label || value}`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected && (
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: selected.color }}
          />
        )}
        <span>{selected?.label || value}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          role="listbox"
          aria-label="选择语言"
          className="absolute top-full left-0 mt-1.5 w-40 rounded-xl bg-code-bg shadow-xl overflow-hidden z-50"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              key={lang.value}
              role="option"
              aria-selected={lang.value === value}
              onClick={() => {
                onChange(lang.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150 ${
                lang.value === value
                  ? "bg-code-purple/20 text-code-purple-light"
                  : "text-code-text hover:bg-code-surface"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
