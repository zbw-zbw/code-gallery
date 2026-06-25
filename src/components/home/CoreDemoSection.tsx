"use client";

import { motion } from "framer-motion";
import SectionTitle from "@/components/shared/SectionTitle";
import CodeBlock from "@/components/shared/CodeBlock";
import { BUBBLE_SORT_CODE } from "@/lib/constants";

export default function CoreDemoSection() {
  return (
    <section id="demo" className="py-24 md:py-32 bg-gallery-bg">
      <div className="max-w-6xl mx-auto px-6">
        <SectionTitle
          title="粘贴代码，看见逻辑"
          subtitle="AI 自动将代码转化为可视化执行动画"
        />

        {/* Arrow indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="text-sm text-gallery-gray">代码输入</span>
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
          <span className="text-sm font-medium text-code-purple">
            AI 自动生成
          </span>
        </motion.div>

        {/* Demo container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="rounded-2xl overflow-hidden bg-gallery-white shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Code */}
            <div>
              <CodeBlock code={BUBBLE_SORT_CODE} filename="bubbleSort.js" />
            </div>

            {/* Right: Visualization */}
            <div className="p-6 md:p-8 flex flex-col items-center justify-center bg-gallery-white">
              <div className="text-sm font-medium text-gallery-gray mb-6">
                AI 生成的执行可视化
              </div>

              {/* Bars container */}
              <div className="flex items-end justify-center gap-3 mb-6 h-[180px]">
                {/* Bar 1: value 5 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div
                      className="w-10 rounded-t-lg bg-code-purple transition-colors duration-300 animate-bubble-1"
                      style={{ height: "100px" }}
                    />
                  </div>
                  <span className="text-sm font-mono text-gallery-gray">5</span>
                </div>

                {/* Bar 2: value 3 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div
                      className="w-10 rounded-t-lg bg-flow-blue transition-colors duration-300 animate-bubble-2"
                      style={{ height: "60px" }}
                    />
                  </div>
                  <span className="text-sm font-mono text-gallery-gray">3</span>
                </div>

                {/* Bar 3: value 8 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div
                      className="w-10 rounded-t-lg bg-code-purple transition-colors duration-300 animate-bubble-3"
                      style={{ height: "160px" }}
                    />
                  </div>
                  <span className="text-sm font-mono text-gallery-gray">8</span>
                </div>

                {/* Bar 4: value 1 */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <div
                      className="w-10 rounded-t-lg bg-flow-blue transition-colors duration-300 animate-bubble-4"
                      style={{ height: "20px" }}
                    />
                  </div>
                  <span className="text-sm font-mono text-gallery-gray">1</span>
                </div>

                {/* Bar 5: value 4 */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 rounded-t-lg bg-data-green transition-colors duration-300"
                    style={{ height: "80px" }}
                  />
                  <span className="text-sm font-mono text-gallery-gray">4</span>
                </div>
              </div>

              {/* Step label */}
              <div className="h-6 flex items-center justify-center">
                <span className="text-sm text-gallery-gray animate-step-label">
                  比较 arr[0] 和 arr[1]...
                </span>
                <span
                  className="text-sm text-gallery-gray animate-step-label absolute"
                  style={{ animationDelay: "3s" }}
                >
                  交换位置，3 向前移动...
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
