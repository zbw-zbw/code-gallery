"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExecutionStep } from "@/types";

interface StepDescriptionProps {
  steps: ExecutionStep[];
  currentStep: number;
}

const DOT_COLORS: Record<ExecutionStep["highlight"], string> = {
  normal: "bg-code-purple",
  "branch-true": "bg-data-green",
  "branch-false": "bg-gallery-gray",
  "loop-start": "bg-flow-blue",
  "loop-end": "bg-flow-blue",
  "function-call": "bg-code-purple-light",
  return: "bg-data-green",
};

const HIGHLIGHT_LABELS: Partial<Record<ExecutionStep["highlight"], string>> = {
  normal: "执行",
  "branch-true": "条件为真",
  "branch-false": "条件为假",
  "loop-start": "循环开始",
  "loop-end": "循环结束",
  "function-call": "函数调用",
  return: "返回值",
};

export default function StepDescription({
  steps,
  currentStep,
}: StepDescriptionProps) {
  const step = steps[currentStep];
  if (!step) return null;

  return (
    <div className="bg-code-bg rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header with step progress */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-code-surface flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${DOT_COLORS[step.highlight]}`} />
          <span className="text-xs text-gallery-gray">
            {HIGHLIGHT_LABELS[step.highlight] || "步骤"}
          </span>
        </div>
        <span className="text-xs text-gallery-gray font-mono">
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      {/* Step detail — aria-live notifies screen readers on step change */}
      <div className="flex-1 overflow-auto p-4" aria-live="polite" aria-atomic="true">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="text-base font-medium text-code-text leading-relaxed">
              {step.description}
            </p>
            {step.annotation && (
              <p className="text-sm text-gallery-gray mt-2 leading-relaxed">
                {step.annotation}
              </p>
            )}

            {/* Loop indicator */}
            {(step.highlight === "loop-start" || step.highlight === "loop-end") && (
              <div className="mt-3 flex items-center gap-2 text-xs text-flow-blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                <span>
                  {step.highlight === "loop-start"
                    ? "进入循环迭代"
                    : "循环迭代结束"}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
