"use client";

import { useState, useEffect, useRef } from "react";
import { AnalysisResult } from "@/types";
import ExecutionView from "./execution/ExecutionView";
import ArchitectureView from "./architecture/ArchitectureView";
import DataFlowView from "./dataflow/DataFlowView";
import ExportPanel from "./ExportPanel";
import ShareButton from "./ShareButton";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
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

const TABS = [
  { key: "execution" as const, label: "执行流程", Icon: ExecutionIcon },
  { key: "architecture" as const, label: "架构图", Icon: ArchitectureIcon },
  { key: "dataflow" as const, label: "数据流", Icon: DataFlowIcon },
];

export default function ResultPanel({
  result,
  isAnalyzing,
  error,
  onRetry,
}: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<"execution" | "architecture" | "dataflow">("execution");
  const [stageIndex, setStageIndex] = useState(0);
  const visualRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);

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

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.findIndex((t) => t.key === activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = (index + 1) % TABS.length;
      setActiveTab(TABS[next].key);
      tablistRef.current?.querySelectorAll("button")[next]?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (index - 1 + TABS.length) % TABS.length;
      setActiveTab(TABS[prev].key);
      tablistRef.current?.querySelectorAll("button")[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(TABS[0].key);
      tablistRef.current?.querySelectorAll("button")[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(TABS[TABS.length - 1].key);
      tablistRef.current?.querySelectorAll("button")[TABS.length - 1]?.focus();
    }
  };

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
    <div className="flex flex-col flex-1 min-h-0 bg-gallery-white overflow-hidden relative">
      {/* Loading overlay - covers entire panel, blocks all interaction */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gallery-white/80 backdrop-blur-sm"
          >
            <svg className="animate-spin w-8 h-8 text-code-purple mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium text-code-purple">{LOADING_STAGES[stageIndex]}</span>
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
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="分析结果视图"
            className="flex relative bg-gallery-bg/30 flex-shrink-0"
          >
            {TABS.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`tabpanel-${tab.key}`}
                  id={`tab-${tab.key}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveTab(tab.key)}
                  onKeyDown={handleTabKeyDown}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${
                    selected
                      ? "text-code-purple"
                      : "text-gallery-gray hover:text-gallery-black"
                  }`}
                >
                  <tab.Icon />
                  <span>{tab.label}</span>
                  {selected && (
                    <motion.div
                      layoutId="tabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-code-purple"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              ref={visualRef}
              role="tabpanel"
              id={`tabpanel-${activeTab}`}
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex-1 overflow-hidden"
            >
              <ErrorBoundary key={activeTab}>
                {activeTab === "execution" && (
                  <ExecutionView code={result.codeInput.code} steps={result.executionSteps} fileName={result.codeInput.fileName} />
                )}
                {activeTab === "architecture" && (
                  <ArchitectureView nodes={result.architecture.nodes} edges={result.architecture.edges} mermaidCode={result.architecture.mermaidCode} />
                )}
                {activeTab === "dataflow" && (
                  <DataFlowView nodes={result.dataFlow.nodes} edges={result.dataFlow.edges} mermaidCode={result.dataFlow.mermaidCode} />
                )}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        /* Empty state */
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
          <p className="text-sm text-gallery-gray text-center max-w-sm mb-6">AI 将为你生成执行动画、架构图和数据流图</p>

          <div className="flex flex-col items-center gap-3 text-xs text-gallery-gray">
            <div className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-code-surface text-code-text font-mono">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-code-surface text-code-text font-mono">Enter</kbd>
              <span className="ml-1">快捷分析</span>
            </div>
            <span>或点击左侧工具栏「示例库」查看预置代码</span>
          </div>
        </div>
      )}
    </div>
  );
}
