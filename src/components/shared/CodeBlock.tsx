"use client";

import { motion } from "framer-motion";

interface CodeBlockProps {
  code: string;
  filename?: string;
}

export default function CodeBlock({ code, filename }: CodeBlockProps) {
  // Simple manual syntax highlighting for bubble sort demo
  const highlightCode = (code: string) => {
    return code.split("\n").map((line, i) => {
      // Highlight keywords
      let highlighted = line
        .replace(
          /\b(function|for|let|if|return)\b/g,
          '<span class="text-code-purple-light">$1</span>'
        )
        .replace(
          /\b(bubbleSort|arr|length|j)\b/g,
          '<span class="text-flow-blue-light">$1</span>'
        )
        .replace(
          /\b(0|1)\b/g,
          '<span class="text-data-green">$1</span>'
        )
        .replace(
          /([=><!+-])/g,
          '<span class="text-code-text">$1</span>'
        );

      return (
        <div
          key={i}
          className="whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-2xl overflow-hidden bg-code-bg shadow-sm"
    >
      {filename && (
        <div className="flex items-center gap-2 px-4 py-3 bg-code-surface">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-sm text-gallery-gray ml-2 font-mono">
            {filename}
          </span>
        </div>
      )}
      <div className="p-4 md:p-6 overflow-x-auto">
        <pre className="text-sm md:text-base leading-relaxed font-mono text-code-text">
          {highlightCode(code)}
        </pre>
      </div>
    </motion.div>
  );
}
