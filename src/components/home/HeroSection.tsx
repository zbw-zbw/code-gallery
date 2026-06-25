"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gallery-border bg-gallery-white/80 backdrop-blur-sm mb-8"
        >
          <span className="text-xs md:text-sm text-gallery-gray">
            TRAE AI 创造力大赛 · 学习工作赛道
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span className="bg-gradient-to-r from-code-purple via-flow-blue to-code-purple bg-clip-text text-transparent">
            代码画廊
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-xl md:text-2xl font-medium text-gallery-black mb-4"
        >
          AI 把代码变成可交互的视觉故事
        </motion.p>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="text-base md:text-lg text-gallery-gray max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          人脑处理视觉信息比文字快 60000 倍，但我们理解代码的方式一直停留在逐行阅读
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            href="/playground"
            className="px-8 py-3.5 bg-code-purple hover:bg-code-purple-light text-white font-medium rounded-xl transition-colors duration-200 text-base"
          >
            开始体验
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 border border-gallery-border hover:border-gallery-gray text-gallery-black font-medium rounded-xl transition-colors duration-200 text-base"
          >
            了解更多
          </a>
        </motion.div>

        {/* Hero Animation */}
        <HeroDecoration />
      </div>
    </section>
  );
}

function HeroDecoration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="relative max-w-3xl mx-auto w-full h-[200px] rounded-2xl bg-code-bg border border-code-surface overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center gap-8 md:gap-16 px-8">
        {/* Left: Code blocks */}
        <div className="flex flex-col gap-2 w-[120px] md:w-[160px]">
          <div className="h-3 rounded bg-code-purple/60 w-full" />
          <div className="h-3 rounded bg-flow-blue/60 w-3/4" />
          <div className="h-3 rounded bg-data-green/60 w-5/6" />
          <div className="h-3 rounded bg-code-purple/40 w-2/3" />
        </div>

        {/* Middle: Flowing lines */}
        <div className="relative w-[80px] md:w-[120px] h-[80px]">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 120 80"
            fill="none"
          >
            {/* Top flow line */}
            <path
              d="M0 20 Q30 20 60 40 T120 20"
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-flow-line"
              opacity="0.8"
            />
            {/* Middle flow line */}
            <path
              d="M0 40 Q30 40 60 40 T120 40"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-flow-line"
              style={{ animationDelay: "0.3s" }}
              opacity="0.8"
            />
            {/* Bottom flow line */}
            <path
              d="M0 60 Q30 60 60 40 T120 60"
              stroke="#34d399"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="animate-flow-line"
              style={{ animationDelay: "0.6s" }}
              opacity="0.8"
            />
          </svg>
          {/* Arrow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Right: Visualization nodes */}
        <div className="relative w-[100px] md:w-[140px] h-[100px]">
          {/* Nodes */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-code-purple" />
          <div className="absolute top-1/2 left-2 -translate-y-1/2 w-4 h-4 rounded-full bg-flow-blue" />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4 rounded-full bg-data-green" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-code-purple-light" />

          {/* Connecting lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 140 100"
            fill="none"
          >
            <line
              x1="70"
              y1="10"
              x2="30"
              y2="50"
              stroke="#6366f1"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="70"
              y1="10"
              x2="110"
              y2="50"
              stroke="#38bdf8"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="30"
              y1="50"
              x2="70"
              y2="90"
              stroke="#34d399"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <line
              x1="110"
              y1="50"
              x2="70"
              y2="90"
              stroke="#818cf8"
              strokeWidth="1.5"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-gallery-gray font-mono">
        AI 自动生成可视化
      </div>
    </motion.div>
  );
}
