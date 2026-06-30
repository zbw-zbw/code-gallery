"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EXAMPLES, CATEGORY_LABELS, DIFFICULTY_LABELS, DIFFICULTY_STYLES } from "@/lib/examples";
import { Example } from "@/lib/examples";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";

interface ExampleDrawerProps {
  onSelect: (example: Example) => void;
}

export default function ExampleDrawer({ onSelect }: ExampleDrawerProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [search, setSearch] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ open, onClose: () => setOpen(false), containerRef: drawerRef });

  const categories = Object.keys(CATEGORY_LABELS);
  const difficulties = Object.keys(DIFFICULTY_LABELS);

  const searchLower = search.toLowerCase().trim();
  const filtered = EXAMPLES.filter((e) => {
    const matchCategory = category === "all" || e.category === category;
    const matchDifficulty = difficulty === "all" || e.difficulty === difficulty;
    const matchSearch = !searchLower ||
      e.title.toLowerCase().includes(searchLower) ||
      e.description.toLowerCase().includes(searchLower);
    return matchCategory && matchDifficulty && matchSearch;
  });

  const handleSelect = (example: Example) => {
    onSelect(example);
    setOpen(false);
  };

  const renderExampleItem = (example: Example) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.value === example.language);
    return (
      <button
        key={example.id}
        onClick={() => handleSelect(example)}
        className="w-full text-left p-4 rounded-xl hover:shadow-md transition-all duration-200 bg-gallery-bg/50 hover:bg-gallery-white"
      >
        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${DIFFICULTY_STYLES[example.difficulty]}`}>
            {DIFFICULTY_LABELS[example.difficulty]}
          </span>
        </div>
        <p className="text-xs text-gallery-gray leading-relaxed">
          {example.description}
        </p>
      </button>
    );
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setSearch(""); }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-code-surface hover:bg-gallery-border/20 transition-colors duration-200 text-sm text-code-text"
        aria-label="打开示例库"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        <span className="hidden sm:inline">示例库</span>
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
            <div ref={drawerRef}>
              {/* Desktop: centered modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                role="dialog"
                aria-modal="true"
                aria-label="示例库"
              >
                <div className="w-full max-w-2xl h-[70vh] bg-gallery-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto hidden md:flex overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-gallery-black">示例库</h3>
                      <button
                        onClick={() => setOpen(false)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
                        aria-label="关闭示例库"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="搜索示例..."
                      autoFocus
                      className="w-full mt-3 px-3 py-2 rounded-lg bg-gallery-bg text-sm text-gallery-black placeholder:text-gallery-gray outline-none focus:ring-2 focus:ring-code-purple/30 transition-all duration-200"
                    />
                  </div>

                  {/* Filters */}
                  <div className="px-6 flex-shrink-0">
                    <div className="flex gap-2 py-2 overflow-x-auto">
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
                    <div className="flex gap-2 py-2 overflow-x-auto">
                      {difficulties.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                            difficulty === d
                              ? "bg-gallery-black text-white"
                              : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
                          }`}
                        >
                          {DIFFICULTY_LABELS[d]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Example list - fixed flex layout */}
                  <div className="flex-1 min-h-0 overflow-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filtered.map(renderExampleItem)}
                    </div>
                    {filtered.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-gallery-gray text-sm">
                        没有符合条件的示例
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Mobile: sidebar from right */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gallery-white z-50 shadow-2xl flex flex-col md:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="示例库"
              >
                {/* Header */}
                <div className="px-5 py-4 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-gallery-black">示例库</h3>
                    <button
                      onClick={() => setOpen(false)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
                      aria-label="关闭示例库"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="搜索示例..."
                    className="w-full mt-3 px-3 py-2 rounded-lg bg-gallery-bg text-sm text-gallery-black placeholder:text-gallery-gray outline-none focus:ring-2 focus:ring-code-purple/30 transition-all duration-200"
                  />
                </div>

                {/* Filters */}
                <div className="px-5 flex-shrink-0">
                  <div className="flex gap-2 py-2 overflow-x-auto">
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
                  <div className="flex gap-2 py-2 overflow-x-auto">
                    {difficulties.map((d) => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                          difficulty === d
                            ? "bg-gallery-black text-white"
                            : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
                        }`}
                      >
                        {DIFFICULTY_LABELS[d]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Example list */}
                <div className="flex-1 min-h-0 overflow-auto p-4">
                  <div className="space-y-3">
                    {filtered.map(renderExampleItem)}
                  </div>
                  {filtered.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gallery-gray text-sm">
                      没有符合条件的示例
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
