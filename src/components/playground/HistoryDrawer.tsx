"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HistoryEntry, getHistory, removeHistory, clearHistory, getPreview, formatTimeAgo } from "@/lib/codeHistory";
import { Language } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useToast } from "@/components/shared/Toast";

interface HistoryDrawerProps {
  onSelect: (code: string, language: Language) => void;
}

export default function HistoryDrawer({ onSelect }: HistoryDrawerProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const loadHistory = useCallback(() => {
    setHistory(getHistory());
  }, []);

  const handleOpen = useCallback(() => {
    loadHistory();
    setOpen(true);
  }, [loadHistory]);

  useFocusTrap({ open, onClose: () => setOpen(false), containerRef: drawerRef });

  const handleSelect = (entry: HistoryEntry) => {
    onSelect(entry.code, entry.language);
    setOpen(false);
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeHistory(id);
    setHistory(getHistory());
    showToast("已删除");
  };

  const [confirmingClear, setConfirmingClear] = useState(false);

  const handleClearAll = () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      // Auto-cancel confirmation after 4 seconds
      setTimeout(() => setConfirmingClear(false), 4000);
      return;
    }
    clearHistory();
    setHistory([]);
    setConfirmingClear(false);
    showToast("历史记录已清空", "success");
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setConfirmingClear(false);
  }, []);

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-code-surface hover:bg-gallery-border/20 transition-colors duration-200 text-sm text-code-text"
        aria-label="历史记录"
        title="历史记录"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="hidden sm:inline">历史</span>
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
                aria-label="历史记录"
              >
                <div className="w-full max-w-lg bg-gallery-white rounded-2xl shadow-2xl flex flex-col pointer-events-auto hidden md:flex overflow-hidden max-h-[70vh]">
                  <HistoryContent
                    history={history}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                    onClearAll={handleClearAll}
                    onClose={handleClose}
                    confirmingClear={confirmingClear}
                  />
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
                aria-label="历史记录"
              >
                <HistoryContent
                  history={history}
                  onSelect={handleSelect}
                  onRemove={handleRemove}
                  onClearAll={handleClearAll}
                  onClose={handleClose}
                  confirmingClear={confirmingClear}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function HistoryContent({
  history,
  onSelect,
  onRemove,
  onClearAll,
  onClose,
  confirmingClear,
}: {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onRemove: (e: React.MouseEvent, id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  confirmingClear: boolean;
}) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0 border-b border-gallery-border/30">
        <h3 className="text-base font-bold text-gallery-black">历史记录</h3>
        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className={`text-xs transition-colors duration-200 ${
                confirmingClear
                  ? "text-red-500 font-medium"
                  : "text-gallery-gray hover:text-red-400"
              }`}
            >
              {confirmingClear ? "确认清空？" : "清空全部"}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors duration-200"
            aria-label="关闭历史记录"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-auto">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gallery-gray text-sm py-16">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mb-3 opacity-50"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p>暂无历史记录</p>
            <p className="text-xs mt-1">分析代码后会自动保存到这里</p>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {history.map((entry) => {
              const lang = SUPPORTED_LANGUAGES.find((l) => l.value === entry.language);
              return (
                <div
                  key={entry.id}
                  onClick={() => onSelect(entry)}
                  className="w-full text-left p-3.5 rounded-xl hover:shadow-md transition-all duration-200 bg-gallery-bg/50 hover:bg-gallery-border/30 group cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelect(entry);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      {/* Summary or preview */}
                      <p className="text-sm text-gallery-black truncate mb-1">
                        {entry.summary || getPreview(entry.code)}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-gallery-gray">
                        {lang && (
                          <span
                            className="w-2 h-2 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: lang.color }}
                          />
                        )}
                        <span>{lang?.label || entry.language}</span>
                        <span className="mx-0.5">·</span>
                        <span>{formatTimeAgo(entry.timestamp)}</span>
                      </div>
                    </div>
                    {/* Delete button — now a real button, not nested */}
                    <button
                      onClick={(e) => onRemove(e, entry.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gallery-gray opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 hover:text-red-400 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                      aria-label="删除此记录"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
