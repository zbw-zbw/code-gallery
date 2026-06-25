"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/shared/Toast";
import { generateMarkdown } from "@/lib/export";
import { AnalysisResult } from "@/types";

interface ShareButtonProps {
  result: AnalysisResult;
}

export default function ShareButton({ result }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("链接已复制到剪贴板");
    } catch {
      showToast("复制失败");
    }
    setOpen(false);
  };

  const handleCopyMarkdown = async () => {
    const md = generateMarkdown(
      result.codeInput.code,
      result.codeInput.language,
      result.summary,
      result.executionSteps.length,
      result.architecture.mermaidCode
    );
    try {
      await navigator.clipboard.writeText(md);
      showToast("Markdown 已复制到剪贴板");
    } catch {
      showToast("复制失败");
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="hidden sm:inline">分享</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gallery-border z-50 overflow-hidden"
            >
              <button
                onClick={handleCopyLink}
                className="w-full text-left px-4 py-3 text-sm text-gallery-black hover:bg-gallery-bg transition-colors duration-150 flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
                复制链接
              </button>
              <button
                onClick={handleCopyMarkdown}
                className="w-full text-left px-4 py-3 text-sm text-gallery-black hover:bg-gallery-bg transition-colors duration-150 flex items-center gap-2 border-t border-gallery-border"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                复制为 Markdown
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
