"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ExecutionStep } from "@/types";

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

export default function CodeHighlight({
  code,
  steps,
  currentStep,
  fileName,
}: CodeHighlightProps) {
  const lines = code.split("\n");
  const currentStepData = steps[currentStep];
  const activeLine = currentStepData?.lineNumber ?? 0;
  const highlight = currentStepData?.highlight ?? "normal";
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-scroll active line into view
  useEffect(() => {
    if (activeLine > 0 && lineRefs.current[activeLine - 1]) {
      lineRefs.current[activeLine - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLine]);

  return (
    <div className="flex flex-col h-full bg-code-bg rounded-xl overflow-hidden border border-code-surface">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-code-surface border-b border-gallery-border/10 flex-shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gallery-gray ml-2 font-mono">
          {fileName || "code.js"}
        </span>
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
                      ▶
                    </span>
                  )}
                  {lineNum}
                </div>

                {/* Code content */}
                <div
                  className={`relative flex-1 py-0.5 pr-4 text-sm font-mono whitespace-pre ${
                    isActive ? "text-code-text" : "text-gallery-gray/70"
                  }`}
                >
                  {line || " "}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
