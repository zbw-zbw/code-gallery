"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ExecutionStep } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import CodeHighlight from "./CodeHighlight";
import VariableTracker from "./VariableTracker";
import StepDescription from "./StepDescription";
import PlayerControls from "./PlayerControls";
import StepTimeline from "./StepTimeline";

interface ExecutionViewProps {
  code: string;
  steps: ExecutionStep[];
  fileName?: string;
}

type MobileTab = "code" | "variables" | "description";

const MOBILE_TABS: { key: MobileTab; label: string }[] = [
  { key: "code", label: "代码" },
  { key: "variables", label: "变量" },
  { key: "description", label: "说明" },
];

export default function ExecutionView({
  code,
  steps,
  fileName,
}: ExecutionViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [mobileTab, setMobileTab] = useState<MobileTab>("code");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track step count (primitive) instead of array reference to avoid spurious resets
  const totalSteps = steps.length;
  const stepsKey = steps.length > 0 ? `${steps[0].stepNumber}-${steps.length}` : "empty";

  // Reset currentStep when a NEW analysis result is loaded (detected by content key, not reference)
  useEffect(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setMobileTab("code");
  }, [stepsKey]);

  // Auto-play logic with proper cleanup
  useEffect(() => {
    if (!isPlaying) return;

    // Use a ref-like pattern: read currentStep from state via a closure variable
    // that we update inside the interval callback itself
    let step = currentStep;
    intervalRef.current = setInterval(() => {
      if (step >= totalSteps - 1) {
        step = totalSteps - 1;
        setIsPlaying(false);
        return;
      }
      step += 1;
      setCurrentStep(step);
    }, 1500 / playSpeed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, playSpeed, totalSteps]);

  const goToFirst = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const goToPrev = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep((prev) => (totalSteps > 0 ? Math.min(totalSteps - 1, prev + 1) : 0));
  }, [totalSteps]);

  const goToLast = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(totalSteps > 0 ? totalSteps - 1 : 0);
  }, [totalSteps]);

  const handleSeek = useCallback(
    (step: number) => {
      setIsPlaying(false);
      setCurrentStep(totalSteps > 0 ? Math.max(0, Math.min(totalSteps - 1, step)) : 0);
    },
    [totalSteps]
  );

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev && currentStep >= totalSteps - 1) {
        setCurrentStep(0);
        return true;
      }
      return !prev;
    });
  }, [currentStep, totalSteps]);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaySpeed(speed);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLButtonElement
      )
        return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          handlePlayPause();
          break;
        case "ArrowLeft":
          e.preventDefault();
          goToPrev();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "Home":
          e.preventDefault();
          goToFirst();
          break;
        case "End":
          e.preventDefault();
          goToLast();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, goToPrev, goToNext, goToFirst, goToLast]);

  // Empty state
  if (totalSteps === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gallery-gray px-6">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mb-4 opacity-50"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <p className="text-sm font-medium text-gallery-black mb-2">AI 没有返回执行步骤数据</p>
        <p className="text-xs text-gallery-gray text-center max-w-xs">
          可能是代码过于简单或 AI 分析失败。请尝试修改代码后重新分析，或切换到"架构图"或"数据流"视图查看其他可视化结果。
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      {/* Mobile tab bar — visible only on small screens */}
      <div
        className="md:hidden flex items-center bg-code-surface flex-shrink-0 border-b border-code-bg/30"
        role="tablist"
        aria-label="执行视图切换"
      >
        {MOBILE_TABS.map((tab) => {
          const isActive = mobileTab === tab.key;
          const badgeCount =
            tab.key === "variables"
              ? steps[currentStep]?.variables?.length ?? 0
              : 0;
          return (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              onKeyDown={(e) => {
                const index = MOBILE_TABS.findIndex((t) => t.key === tab.key);
                if (e.key === "ArrowRight") {
                  e.preventDefault();
                  const next = (index + 1) % MOBILE_TABS.length;
                  setMobileTab(MOBILE_TABS[next].key);
                  (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
                } else if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  const prev = (index - 1 + MOBILE_TABS.length) % MOBILE_TABS.length;
                  setMobileTab(MOBILE_TABS[prev].key);
                  (e.currentTarget.parentElement?.children[prev] as HTMLElement)?.focus();
                }
              }}
              className={`flex-1 relative flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors duration-200 ${
                isActive
                  ? "text-code-purple-light"
                  : "text-gallery-gray hover:text-code-text"
              }`}
              role="tab"
              aria-selected={isActive}
            >
              <span>{tab.label}</span>
              {tab.key === "variables" && badgeCount > 0 && (
                <span
                  className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-code-purple/30 text-code-purple-light"
                      : "bg-gallery-border/30 text-gallery-gray"
                  }`}
                >
                  {badgeCount}
                </span>
              )}
              {isActive && (
                <motion.div
                  layoutId="mobile-exec-tab"
                  className="absolute bottom-0 left-2 right-2 h-[2px] bg-code-purple rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main view area */}
      <div className="flex-1 overflow-hidden min-h-0 relative">
        {/* Desktop: side-by-side layout */}
        <div className="hidden md:grid md:grid-cols-5 gap-3 p-3 h-full">
          {/* Left: Code */}
          <div className="md:col-span-3 h-full min-h-0">
            <CodeHighlight
              code={code}
              steps={steps}
              currentStep={currentStep}
              fileName={fileName}
            />
          </div>

          {/* Right: Variables + Description */}
          <div className="md:col-span-2 flex flex-col gap-3 h-full min-h-0">
            <div className="flex-1 min-h-0">
              <VariableTracker steps={steps} currentStep={currentStep} />
            </div>
            <div className="flex-shrink-0">
              <StepDescription steps={steps} currentStep={currentStep} />
            </div>
          </div>

          {/* Keyboard shortcuts hint - desktop only, dismissible */}
          {showShortcuts ? (
            <div className="hidden md:flex absolute bottom-3 right-3 items-center gap-3 px-3 py-2 bg-code-surface/95 backdrop-blur rounded-lg shadow-md text-[11px] text-gallery-gray font-mono z-20">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-code-bg text-code-text">Space</kbd>
                播放
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-code-bg text-code-text">←</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-code-bg text-code-text">→</kbd>
                步骤
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-code-bg text-code-text">Home</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-code-bg text-code-text">End</kbd>
                首末
              </span>
              <button
                onClick={() => setShowShortcuts(false)}
                className="ml-1 text-gallery-gray hover:text-code-text transition-colors"
                aria-label="关闭快捷键提示"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowShortcuts(true)}
              className="hidden md:flex absolute bottom-3 right-3 w-8 h-8 items-center justify-center bg-code-surface/80 backdrop-blur rounded-lg shadow-md text-gallery-gray hover:text-code-text transition-colors z-20"
              aria-label="显示快捷键提示"
              title="快捷键提示"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile: tab-switched layout */}
        <div className="md:hidden h-full">
          <AnimatePresence mode="wait">
            {mobileTab === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="h-full p-2"
              >
                <CodeHighlight
                  code={code}
                  steps={steps}
                  currentStep={currentStep}
                  fileName={fileName}
                />
              </motion.div>
            )}
            {mobileTab === "variables" && (
              <motion.div
                key="variables"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="h-full p-2"
              >
                <VariableTracker steps={steps} currentStep={currentStep} />
              </motion.div>
            )}
            {mobileTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="h-full p-2"
              >
                <StepDescription steps={steps} currentStep={currentStep} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Step timeline — visual overview of all steps with type color coding */}
      <StepTimeline steps={steps} currentStep={currentStep} onSeek={handleSeek} />

      {/* Player controls */}
      <PlayerControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        isPlaying={isPlaying}
        playSpeed={playSpeed}
        onFirst={goToFirst}
        onPrev={goToPrev}
        onPlayPause={handlePlayPause}
        onNext={goToNext}
        onLast={goToLast}
        onSeek={handleSeek}
        onSpeedChange={handleSpeedChange}
      />
    </motion.div>
  );
}
