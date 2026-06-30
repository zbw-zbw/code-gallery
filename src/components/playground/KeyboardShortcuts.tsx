"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const SHORTCUTS = [
  { keys: ["Ctrl", "Enter"], description: "分析代码" },
  { keys: ["Space"], description: "播放/暂停（执行流程）" },
  { keys: ["←", "→"], description: "上一步/下一步" },
  { keys: ["Home", "End"], description: "首步/末步" },
  { keys: ["1", "2", "3"], description: "切换视图（执行/架构/数据流）" },
  { keys: ["?"], description: "显示快捷键面板" },
  { keys: ["Esc"], description: "关闭弹窗/取消分析" },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap({ open, onClose: () => setOpen(false), containerRef: panelRef });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in textarea/input
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      )
        return;

      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="键盘快捷键"
          >
            <div className="w-full max-w-sm bg-gallery-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gallery-border/30">
                <h3 className="text-base font-bold text-gallery-black">键盘快捷键</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gallery-gray hover:text-gallery-black hover:bg-gallery-bg transition-colors"
                  aria-label="关闭"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Shortcuts list */}
              <div className="px-5 py-4 space-y-3">
                {SHORTCUTS.map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm text-gallery-gray">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && (
                            <span className="text-xs text-gallery-gray mx-0.5">+</span>
                          )}
                          <kbd className="px-2 py-1 rounded-md bg-gallery-bg text-xs font-mono text-gallery-black shadow-sm border border-gallery-border/30">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-gallery-bg/50 border-t border-gallery-border/30 text-center">
                <p className="text-xs text-gallery-gray">
                  按 <kbd className="px-1.5 py-0.5 rounded bg-gallery-white text-[10px] font-mono border border-gallery-border/30">?</kbd> 随时打开此面板
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
