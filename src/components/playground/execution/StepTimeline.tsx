"use client";

import { motion } from "framer-motion";
import { ExecutionStep } from "@/types";

interface StepTimelineProps {
  steps: ExecutionStep[];
  currentStep: number;
  onSeek: (step: number) => void;
}

// Color coding for each step highlight type
const STEP_COLORS: Record<ExecutionStep["highlight"], string> = {
  normal: "bg-gallery-border/40",
  "branch-true": "bg-data-green",
  "branch-false": "bg-gallery-gray/50",
  "loop-start": "bg-flow-blue",
  "loop-end": "bg-flow-blue/70",
  "function-call": "bg-code-purple",
  return: "bg-data-green/80",
};

const STEP_LABELS: Record<ExecutionStep["highlight"], string> = {
  normal: "普通",
  "branch-true": "分支✓",
  "branch-false": "分支✗",
  "loop-start": "循环开始",
  "loop-end": "循环结束",
  "function-call": "函数调用",
  return: "返回",
};

// Collect unique types for the legend
function getUniqueTypes(steps: ExecutionStep[]): ExecutionStep["highlight"][] {
  const seen = new Set<ExecutionStep["highlight"]>();
  for (const s of steps) {
    seen.add(s.highlight);
  }
  // Sort by a sensible order
  const order: ExecutionStep["highlight"][] = [
    "normal", "branch-true", "branch-false", "loop-start", "loop-end", "function-call", "return",
  ];
  return order.filter((t) => seen.has(t));
}

export default function StepTimeline({ steps, currentStep, onSeek }: StepTimelineProps) {
  const uniqueTypes = getUniqueTypes(steps);
  if (steps.length === 0) return null;

  return (
    <div className="flex-shrink-0 px-3 pb-2">
      <div className="bg-code-surface/50 rounded-lg p-2.5">
        {/* Timeline bar */}
        <div className="flex items-center gap-0.5 h-6 mb-1.5">
          {steps.map((step, i) => {
            const isActive = i === currentStep;
            const color = STEP_COLORS[step.highlight] || STEP_COLORS.normal;
            return (
              <button
                key={i}
                onClick={() => onSeek(i)}
                className="group relative flex-1 h-full min-w-[6px] flex items-end"
                title={`第 ${i + 1} 步: ${step.description.slice(0, 50)}${step.description.length > 50 ? "..." : ""}`}
                aria-label={`跳到第 ${i + 1} 步`}
              >
                <div
                  className={`w-full rounded-sm transition-all duration-150 ${color} ${
                    isActive
                      ? "h-full ring-1 ring-white/60"
                      : "h-2.5 group-hover:h-3.5 opacity-70 group-hover:opacity-100"
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="timeline-cursor"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "5px solid currentColor",
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        {uniqueTypes.length > 1 && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {uniqueTypes.map((type) => (
              <div key={type} className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-sm ${STEP_COLORS[type]}`}
                  aria-hidden="true"
                />
                <span className="text-[10px] text-gallery-gray">{STEP_LABELS[type]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
