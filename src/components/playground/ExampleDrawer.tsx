"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXAMPLES, CATEGORY_LABELS } from "@/lib/examples";
import { Example } from "@/lib/examples";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

interface ExampleDrawerProps {
  onSelect: (example: Example) => void;
}

export default function ExampleDrawer({ onSelect }: ExampleDrawerProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("all");

  const categories = Object.keys(CATEGORY_LABELS);
  const filtered =
    category === "all"
      ? EXAMPLES
      : EXAMPLES.filter((e) => e.category === category);

  const handleSelect = (example: Example) => {
    onSelect(example);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-code-surface hover:bg-gallery-border/20 transition-colors duration-200 text-sm text-code-text"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span>示例库</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gallery-border flex-shrink-0">
                <h3 className="text-base font-bold text-gallery-black">示例库</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              {/* Category filter */}
              <div className="flex gap-2 px-5 py-3 border-b border-gallery-border overflow-x-auto flex-shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                      category === cat
                        ? "bg-code-purple text-white"
                        : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

              {/* Example list */}
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {filtered.map((example) => {
                  const lang = SUPPORTED_LANGUAGES.find(
                    (l) => l.value === example.language
                  );
                  return (
                    <button
                      key={example.id}
                      onClick={() => handleSelect(example)}
                      className="w-full text-left p-4 rounded-xl border border-gallery-border hover:border-code-purple/30 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium text-gallery-black">
                          {example.title}
                        </h4>
                        {lang && (
                          <span
                            className="w-2 h-2 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: lang.color }}
                          />
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gallery-bg text-gallery-gray">
                          {CATEGORY_LABELS[example.category]}
                        </span>
                      </div>
                      <p className="text-xs text-gallery-gray leading-relaxed">
                        {example.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
