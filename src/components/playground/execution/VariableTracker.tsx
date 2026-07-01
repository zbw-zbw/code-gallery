"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionStep } from "@/types";

interface VariableTrackerProps {
  steps: ExecutionStep[];
  currentStep: number;
}

function formatValue(value: string, type: string): React.ReactNode {
  if (type === "array" || type === "object") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return <ArrayVisualizer value={parsed} />;
      }
      return (
        <span className="text-sm font-mono text-code-text">
          {JSON.stringify(parsed, null, 1)}
        </span>
      );
    } catch {
      return <span className="text-sm font-mono text-code-text">{value}</span>;
    }
  }
  return <span className="text-sm font-mono text-code-text">{value}</span>;
}

function ArrayVisualizer({ value }: { value: unknown[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {value.map((item, i) => {
        const isNumber = typeof item === "number";
        return (
          <motion.div
            key={`${i}-${String(item)}`}
            layout
            className={`min-w-[32px] h-7 flex items-center justify-center rounded-md text-xs font-mono font-medium ${
              isNumber
                ? "bg-code-purple/20 text-code-purple-light border border-code-purple/30"
                : "bg-code-surface text-code-text border border-gallery-border/20"
            }`}
          >
            {String(item)}
          </motion.div>
        );
      })}
    </div>
  );
}

export default function VariableTracker({
  steps,
  currentStep,
}: VariableTrackerProps) {
  const currentStepData = steps[currentStep];
  const variables = currentStepData?.variables ?? [];
  const prevVariables = useMemo(() => {
    if (currentStep <= 0) return new Map<string, string>();
    const prev = steps[currentStep - 1];
    const map = new Map<string, string>();
    prev?.variables?.forEach((v) => map.set(v.name, v.value));
    return map;
  }, [currentStep, steps]);

  return (
    <div className="flex flex-col h-full bg-code-bg rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-code-surface flex-shrink-0">
        <span className="text-sm font-medium text-code-text">变量状态</span>
        <span className="text-xs text-gallery-gray font-mono">
          Step {currentStep + 1}/{steps.length}
        </span>
      </div>

      {/* Variable list */}
      <div className="flex-1 overflow-auto p-3 code-scroll-dark">
        {variables.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-gallery-gray">
            暂无变量
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {variables.map((variable) => {
                const changed = variable.changed;
                const prevValue = prevVariables.get(variable.name);
                const isArray = variable.type === "array" || variable.type === "object";

                return (
                  <motion.div
                    key={`${variable.name}-${currentStep}`}
                    layout
                    initial={changed ? { backgroundColor: "rgba(52, 211, 153, 0.2)" } : false}
                    animate={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                    transition={{ duration: 0.6 }}
                    className="flex items-start gap-3 px-3 py-2 rounded-lg"
                  >
                    {/* Variable name */}
                    <div className="w-20 flex-shrink-0 truncate" title={variable.name}>
                      <span className="text-sm font-mono text-flow-blue truncate block">
                        {variable.name}
                      </span>
                    </div>

                    {/* Value */}
                    <div className="flex-1 min-w-0">
                      {isArray ? (
                        formatValue(variable.value, variable.type)
                      ) : (
                        <div className="text-sm font-mono break-all">
                          {changed && prevValue !== undefined && prevValue !== variable.value && (
                            <span className="text-xs text-gallery-gray line-through mr-1">{prevValue}</span>
                          )}
                          <span className={changed ? "text-data-green" : "text-code-text"}>
                            {variable.value}
                          </span>
                        </div>
                      )}

                      {/* Type tag */}
                      <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-code-surface text-gallery-gray">
                        {variable.type}
                      </span>
                    </div>

                    {/* Changed indicator */}
                    {changed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-1.5 h-1.5 rounded-full bg-data-green flex-shrink-0 mt-2"
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
