"use client";

import { useEffect, useRef, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ExecutionStep } from "@/types";
import { getHighlightedHtml } from "@/components/shared/SyntaxHighlighter";
import { useToast } from "@/components/shared/Toast";

interface CodeHighlightProps {
  code: string;
  steps: ExecutionStep[];
  currentStep: number;
  fileName?: string;
}

const HIGHLIGHT_COLORS: Record<ExecutionStep["highlight"], string> = {
  normal: "text-code-purple",
  "branch-true": "text-data-green",
  "branch-false": "text-gallery-gray",
  "loop-start": "text-flow-blue",
  "loop-end": "text-flow-blue",
  "function-call": "text-code-purple-light",
  return: "text-data-green",
};

function detectLang(fname?: string): string {
  if (!fname) return "javascript";
  if (fname.endsWith(".py")) return "python";
  if (fname.endsWith(".tsx") || fname.endsWith(".ts")) return "typescript";
  if (fname.endsWith(".jsx") || fname.endsWith(".js")) return "javascript";
  if (fname.endsWith(".java")) return "java";
  if (fname.endsWith(".go")) return "go";
  if (fname.endsWith(".rs")) return "rust";
  if (fname.endsWith(".cpp") || fname.endsWith(".cc")) return "cpp";
  return "javascript";
}

export default function CodeHighlight({
  code,
  steps,
  currentStep,
  fileName,
}: CodeHighlightProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();
  const lines = useMemo(() => code.split("\n"), [code]);
  const currentStepData = steps[currentStep];
  const activeLine = currentStepData?.lineNumber ?? 0;
  const highlight = currentStepData?.highlight ?? "normal";
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Memoize highlighted HTML to avoid re-highlighting on every step change
  const language = useMemo(() => detectLang(fileName), [fileName]);
  const highlightedLines = useMemo(() => {
    const html = getHighlightedHtml(code, language);
    return html.split("\n");
  }, [code, language]);

  // Auto-scroll active line into view
  useEffect(() => {
    if (activeLine > 0 && lineRefs.current[activeLine - 1]) {
      lineRefs.current[activeLine - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLine]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast("代码已复制");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("复制失败");
    }
  }, [code, showToast]);

  return (
    <div className="flex flex-col h-full bg-code-bg rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-code-surface flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gallery-gray ml-2 font-mono flex-1 truncate">
          {fileName || "code.js"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gallery-gray hover:text-code-text hover:bg-gallery-border/20 transition-colors duration-200"
          aria-label="复制代码"
          title="复制代码"
        >
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto">
        <div className="py-2">
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const isActive = lineNum === activeLine;
            const lineColor = isActive
              ? HIGHLIGHT_COLORS[highlight]
              : "text-gallery-gray";

            return (
              <div
                key={index}
                ref={(el) => { lineRefs.current[index] = el; }}
                className="relative flex items-stretch"
              >
                {/* Active line background */}
                {isActive && (
                  <motion.div
                    layoutId="activeLine"
                    className="absolute inset-0 bg-code-purple/15"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                  />
                )}

                {/* Left border indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeBorder"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-code-purple"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                  />
                )}

                {/* Line number */}
                <div
                  className={`relative w-12 flex-shrink-0 text-right pr-3 py-0.5 text-sm font-mono select-none ${lineColor}`}
                >
                  {isActive && (
                    <span className="inline-block mr-1 text-code-purple">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </span>
                  )}
                  {lineNum}
                </div>

                {/* Code content with syntax highlighting */}
                <div
                  className={`relative flex-1 py-0.5 pr-4 text-sm font-mono whitespace-pre ${
                    isActive ? "text-code-text" : "text-gallery-gray/70"
                  }`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightedLines[index] || " ",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
