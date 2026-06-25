"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExecutionStep } from "@/types";

interface StepDescriptionProps {
  steps: ExecutionStep[];
  currentStep: number;
}

const BORDER_COLORS: Record<ExecutionStep["highlight"], string> = {
  normal: "border-code-purple",
  "branch-true": "border-data-green",
  "branch-false": "border-gallery-gray",
  "loop-start": "border-flow-blue",
  "loop-end": "border-flow-blue",
  "function-call": "border-code-purple-light",
  return: "border-data-green",
};

export default function StepDescription({
  steps,
  currentStep,
}: StepDescriptionProps) {
  const step = steps[currentStep];
  if (!step) return null;

  return (
    <div className="bg-code-bg rounded-xl border border-code-surface p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className={`border-l-[3px] pl-4 ${BORDER_COLORS[step.highlight]}`}>
            <p className="text-base font-medium text-code-text leading-relaxed">
              {step.description}
            </p>
            {step.annotation && (
              <p className="text-sm text-gallery-gray mt-2 leading-relaxed">
                {step.annotation}
              </p>
            )}
          </div>

          {/* Loop indicator */}
          {(step.highlight === "loop-start" || step.highlight === "loop-end") && (
            <div className="mt-3 flex items-center gap-2 text-xs text-flow-blue">
              <span>🔄</span>
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
