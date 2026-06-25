"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ExecutionStep } from "@/types";
import { motion } from "framer-motion";
import CodeHighlight from "./CodeHighlight";
import VariableTracker from "./VariableTracker";
import StepDescription from "./StepDescription";
import PlayerControls from "./PlayerControls";

interface ExecutionViewProps {
  code: string;
  steps: ExecutionStep[];
  fileName?: string;
}

export default function ExecutionView({
  code,
  steps,
  fileName,
}: ExecutionViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = steps.length;

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500 / playSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
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
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  }, [totalSteps]);

  const goToLast = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(totalSteps - 1);
  }, [totalSteps]);

  const handleSeek = useCallback(
    (step: number) => {
      setIsPlaying(false);
      setCurrentStep(Math.max(0, Math.min(totalSteps - 1, step)));
    },
    [totalSteps]
  );

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaySpeed(speed);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;

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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePlayPause, goToPrev, goToNext]);

  // Empty state
  if (totalSteps === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gallery-gray">
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
        <p className="text-sm">AI 没有返回执行步骤数据</p>
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
      {/* Main view area */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-5 gap-3 p-3 min-h-0">
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
      </div>

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
