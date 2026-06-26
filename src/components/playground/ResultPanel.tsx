"use client";

import { useState, useEffect, useRef } from "react";
import { AnalysisResult } from "@/types";
import ExecutionView from "./execution/ExecutionView";
import ArchitectureView from "./architecture/ArchitectureView";
import DataFlowView from "./dataflow/DataFlowView";
import ExportPanel from "./ExportPanel";
import ShareButton from "./ShareButton";
import { motion, AnimatePresence } from "framer-motion";

interface ResultPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
  onRetry: () => void;
}

const LOADING_STAGES = [
  "解析代码结构...",
  "分析执行流程...",
  "生成可视化数据...",
];

// Tab icons as SVG components
const ExecutionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const ArchitectureIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const DataFlowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    <path d="M14.5 6.5L17.5 9.5" />
  </svg>
);

export default function ResultPanel({
  result,
  isAnalyzing,
  error,
  onRetry,
}: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<"execution" | "architecture" | "dataflow">("execution");
  const [stageIndex, setStageIndex] = useState(0);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAnalyzing) {
      setStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Error state
  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gallery-white px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-base font-medium text-gallery-black mb-2">分析失败</p>
        <p className="text-sm text-gallery-gray text-center mb-6 max-w-sm">{error}</p>
        <button onClick={onRetry} className="px-5 py-2 bg-code-purple hover:bg-code-purple-light text-white text-sm font-medium rounded-lg transition-colors duration-200">
          重试
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gallery-white overflow-hidden relative">
      {/* Loading overlay - always stacked on top of content/empty state */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <svg className="animate-spin w-10 h-10 text-code-purple" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="mt-4 text-base font-medium text-gallery-black">
              AI 正在分析你的代码...
            </p>
            <p className="mt-2 text-sm text-gallery-gray">
              {LOADING_STAGES[stageIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {result ? (
        <>
          {/* Summary */}
          <div className="px-5 py-3 bg-gallery-bg/50 flex items-start justify-between gap-4 flex-shrink-0">
            <div className="min-w-0">
              <p className="text-sm text-gallery-gray mb-0.5">代码概述</p>
              <p className="text-base font-medium text-gallery-black truncate">{result.summary}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ExportPanel
                targetRef={visualRef}
                svgContent={
                  activeTab === "architecture"
                    ? result.architecture.mermaidCode
                    : activeTab === "dataflow"
                    ? result.dataFlow.mermaidCode
                    : undefined
                }
              />
              <ShareButton result={result} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex relative bg-gallery-bg/30 flex-shrink-0">
            {[
              { key: "execution" as const, label: "执行流程", Icon: ExecutionIcon },
              { key: "architecture" as const, label: "架构图", Icon: ArchitectureIcon },
              { key: "dataflow" as const, label: "数据流", Icon: DataFlowIcon },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${
                  activeTab === tab.key
                    ? "text-code-purple"
                    : "text-gallery-gray hover:text-gallery-black"
                }`}
              >
                <tab.Icon />
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-code-purple"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              ref={visualRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              {activeTab === "execution" && (
                <ExecutionView code={result.codeInput.code} steps={result.executionSteps} fileName={result.codeInput.fileName} />
              )}
              {activeTab === "architecture" && (
                <ArchitectureView nodes={result.architecture.nodes} edges={result.architecture.edges} mermaidCode={result.architecture.mermaidCode} />
              )}
              {activeTab === "dataflow" && (
                <DataFlowView nodes={result.dataFlow.nodes} edges={result.dataFlow.edges} mermaidCode={result.dataFlow.mermaidCode} />
              )}
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        /* Empty state - rendered even during first analysis so overlay stacks on top */
        <div className="h-full flex flex-col items-center justify-center px-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl bg-code-bg flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <div className="w-16 h-16 rounded-xl bg-gallery-bg flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </div>
          </div>
          <p className="text-lg font-medium text-gallery-black mb-2">粘贴代码并点击「分析代码」</p>
          <p className="text-sm text-gallery-gray text-center max-w-sm">AI 将为你生成执行动画、架构图和数据流图</p>
        </div>
      )}
    </div>
  );
}
