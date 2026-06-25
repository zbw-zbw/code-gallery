"use client";

import { motion } from "framer-motion";

interface PlayerControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playSpeed: number;
  onFirst: () => void;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onLast: () => void;
  onSeek: (step: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlayerControls({
  currentStep,
  totalSteps,
  isPlaying,
  playSpeed,
  onFirst,
  onPrev,
  onPlayPause,
  onNext,
  onLast,
  onSeek,
  onSpeedChange,
}: PlayerControlsProps) {
  const isFirst = currentStep <= 0;
  const isLast = currentStep >= totalSteps - 1;
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  const speeds = [0.5, 1, 2];

  return (
    <div className="bg-gallery-bg border-t border-gallery-border px-4 py-3 flex-shrink-0">
      <div className="flex items-center justify-center gap-3 md:gap-4">
        {/* Desktop controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* First */}
          <button
            onClick={onFirst}
            disabled={isFirst}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isFirst
                ? "text-gallery-border cursor-not-allowed"
                : "text-gallery-black hover:bg-gallery-border/50"
            }`}
            title="首步"
          >
            <span className="text-sm font-mono">|◁</span>
          </button>

          {/* Previous */}
          <button
            onClick={onPrev}
            disabled={isFirst}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isFirst
                ? "text-gallery-border cursor-not-allowed"
                : "text-gallery-black hover:bg-gallery-border/50"
            }`}
            title="上一步"
          >
            <span className="text-sm font-mono">◁</span>
          </button>
        </div>

        {/* Play / Pause */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onPlayPause}
          className="w-12 h-12 rounded-full bg-code-purple hover:bg-code-purple-light text-white flex items-center justify-center transition-colors duration-200 shadow-md"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>

        {/* Mobile simplified controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onPrev}
            disabled={isFirst}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isFirst
                ? "text-gallery-border cursor-not-allowed"
                : "text-gallery-black hover:bg-gallery-border/50"
            }`}
          >
            <span className="text-sm font-mono">◁</span>
          </button>
          <button
            onClick={onNext}
            disabled={isLast}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isLast
                ? "text-gallery-border cursor-not-allowed"
                : "text-gallery-black hover:bg-gallery-border/50"
            }`}
          >
            <span className="text-sm font-mono">▷</span>
          </button>
        </div>

        {/* Desktop next / last */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onNext}
            disabled={isLast}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isLast
                ? "text-gallery-border cursor-not-allowed"
                : "text-gallery-black hover:bg-gallery-border/50"
            }`}
            title="下一步"
          >
            <span className="text-sm font-mono">▷</span>
          </button>

          <button
            onClick={onLast}
            disabled={isLast}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
              isLast
                ? "text-gallery-border cursor-not-allowed"
                : "text-gallery-black hover:bg-gallery-border/50"
            }`}
            title="末步"
          >
            <span className="text-sm font-mono">▷|</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 max-w-[200px] md:max-w-xs flex items-center gap-3">
          <div className="flex-1 relative h-1.5 bg-gallery-border rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-code-purple rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={Math.max(totalSteps - 1, 0)}
              value={currentStep}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-xs font-mono text-gallery-gray flex-shrink-0">
            {currentStep + 1}/{totalSteps}
          </span>
        </div>

        {/* Speed controls */}
        <div className="hidden md:flex items-center gap-1">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => onSpeedChange(speed)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
                playSpeed === speed
                  ? "text-code-purple border-b-2 border-code-purple"
                  : "text-gallery-gray hover:text-gallery-black"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
