"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  group: string;
  action: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
  open: boolean;
  onClose: () => void;
}

export function useCommandPalette(items: CommandItem[]) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const executeCommand = useCallback((id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      item.action();
      setOpen(false);
    }
  }, [items]);

  return { open, setOpen, executeCommand };
}

export default function CommandPalette({ items, open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of items) {
      const list = map.get(item.group) || [];
      list.push(item);
      map.set(item.group, list);
    }
    return Array.from(map.entries());
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lower = query.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(lower) ||
        item.description?.toLowerCase().includes(lower) ||
        item.group.toLowerCase().includes(lower)
    );
  }, [items, query]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      // Small delay for animation to start
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useFocusTrap({ open, onClose, containerRef: listRef });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filteredItems, selectedIndex, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const selected = container.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[92vw] max-w-lg bg-gallery-white rounded-2xl shadow-2xl z-[101] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="命令面板"
            ref={listRef}
            onKeyDown={handleKeyDown}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gallery-border/50">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gallery-gray flex-shrink-0"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索命令..."
                className="flex-1 bg-transparent text-sm text-gallery-black placeholder:text-gallery-gray/50 outline-none"
                aria-label="搜索命令"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] text-gallery-gray bg-gallery-bg rounded border border-gallery-border/50 font-mono">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[40vh] overflow-y-auto py-2">
              {filteredItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gallery-gray">
                  没有找到匹配的命令
                </div>
              ) : (
                <>
                  {query.trim() === "" &&
                    groups.map(([group]) => {
                      const groupItems = filteredItems.filter((i) => i.group === group);
                      if (groupItems.length === 0) return null;
                      return (
                        <div key={group}>
                          <div className="px-4 py-1.5 text-[10px] font-semibold text-gallery-gray uppercase tracking-wider">
                            {group}
                          </div>
                          {groupItems.map((item) => (
                            <CommandItemRow
                              key={item.id}
                              item={item}
                              index={filteredItems.indexOf(item)}
                              isSelected={filteredItems.indexOf(item) === selectedIndex}
                              onSelect={() => {
                                item.action();
                                onClose();
                              }}
                              onHover={() => setSelectedIndex(filteredItems.indexOf(item))}
                            />
                          ))}
                        </div>
                      );
                    })}
                  {query.trim() !== "" &&
                    filteredItems.map((item, i) => (
                      <CommandItemRow
                        key={item.id}
                        item={item}
                        index={i}
                        isSelected={i === selectedIndex}
                        onSelect={() => {
                          item.action();
                          onClose();
                        }}
                        onHover={() => setSelectedIndex(i)}
                      />
                    ))}
                </>
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-gallery-border/30 text-[10px] text-gallery-gray">
              <span>
                <kbd className="px-1 py-0.5 bg-gallery-bg rounded border border-gallery-border/50 font-mono text-gallery-gray">
                  ↑↓
                </kbd>{" "}
                导航{" "}
                <kbd className="px-1 py-0.5 bg-gallery-bg rounded border border-gallery-border/50 font-mono text-gallery-gray">
                  ↵
                </kbd>{" "}
                执行
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-gallery-bg rounded border border-gallery-border/50 font-mono text-gallery-gray">
                  Ctrl+K
                </kbd>{" "}
                打开
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CommandItemRow({
  item,
  index,
  isSelected,
  onSelect,
  onHover,
}: {
  item: CommandItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onHover: () => void;
}) {
  return (
    <button
      data-selected={isSelected}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75 ${
        isSelected
          ? "bg-code-purple/10 text-gallery-black"
          : "text-gallery-gray hover:bg-gallery-bg"
      }`}
    >
      {item.icon && (
        <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-code-purple">
          {item.icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${isSelected ? "text-gallery-black" : ""}`}>
          {item.label}
        </p>
        {item.description && (
          <p className="text-xs text-gallery-gray/70 truncate">{item.description}</p>
        )}
      </div>
      {item.shortcut && (
        <kbd className="flex-shrink-0 px-1.5 py-0.5 text-[10px] text-gallery-gray bg-gallery-bg rounded border border-gallery-border/50 font-mono">
          {item.shortcut}
        </kbd>
      )}
    </button>
  );
}
