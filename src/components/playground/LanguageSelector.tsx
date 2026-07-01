"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Language } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { motion, AnimatePresence } from "framer-motion";

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
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const selectedIndex = SUPPORTED_LANGUAGES.findIndex((l) => l.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Sync focused index with selected when opening
  useEffect(() => {
    if (open) {
      setFocusedIndex(selectedIndex);
    }
  }, [open, selectedIndex]);

  useFocusTrap({ open, onClose: () => { setOpen(false); setFocusedIndex(-1); }, containerRef: panelRef });

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const count = SUPPORTED_LANGUAGES.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % count);
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + count) % count);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < count) {
          onChange(SUPPORTED_LANGUAGES[focusedIndex].value);
          setOpen(false);
          setFocusedIndex(-1);
        }
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(count - 1);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        setFocusedIndex(-1);
        break;
    }
  }, [focusedIndex, onChange]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
            if (!open) {
              e.preventDefault();
              setOpen(true);
            }
          }
        }}
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

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => { setOpen(false); setFocusedIndex(-1); }}
              aria-hidden="true"
            />
            <motion.div
              ref={panelRef}
              role="listbox"
              aria-label="选择语言"
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-1.5 w-40 rounded-xl bg-code-bg shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto"
              onKeyDown={handleKeyDown}
            >
              {SUPPORTED_LANGUAGES.map((lang, i) => (
                <button
                  key={lang.value}
                  role="option"
                  id={`lang-option-${lang.value}`}
                  aria-selected={lang.value === value}
                  tabIndex={focusedIndex === i ? 0 : -1}
                  ref={(el) => {
                    if (focusedIndex === i && el) el.focus();
                  }}
                  onClick={() => {
                    onChange(lang.value);
                    setOpen(false);
                    setFocusedIndex(-1);
                  }}
                  onMouseEnter={() => setFocusedIndex(i)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150 outline-none ${
                    lang.value === value
                      ? "bg-code-purple/20 text-code-purple-light"
                      : focusedIndex === i
                      ? "bg-code-surface text-code-text"
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
