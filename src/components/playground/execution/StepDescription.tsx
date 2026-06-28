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

export default function StepDescription({
  steps,
  currentStep,
}: StepDescriptionProps) {
  const step = steps[currentStep];
  if (!step) return null;

  return (
    <div className="bg-code-bg rounded-xl shadow-sm p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="flex items-start gap-3">
            <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${DOT_COLORS[step.highlight]}`} />
            <div className="flex-1">
              <p className="text-base font-medium text-code-text leading-relaxed">
                {step.description}
              </p>
              {step.annotation && (
                <p className="text-sm text-gallery-gray mt-2 leading-relaxed">
                  {step.annotation}
                </p>
              )}
            </div>
          </div>

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
  );
}
