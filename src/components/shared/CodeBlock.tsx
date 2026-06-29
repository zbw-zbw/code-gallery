"use client";

import { motion } from "framer-motion";
import { getHighlightedHtml } from "@/components/shared/SyntaxHighlighter";

interface CodeBlockProps {
  code: string;
  filename?: string;
}

export default function CodeBlock({ code, filename }: CodeBlockProps) {
  // Use hljs for safe syntax highlighting (HTML-escaped by default)
  const highlightedHtml = getHighlightedHtml(code, "javascript");
  const highlightedLines = highlightedHtml.split("\n");

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
          {highlightedLines.map((line, i) => (
            <div
              key={i}
              className="whitespace-pre"
              dangerouslySetInnerHTML={{ __html: line || " " }}
            />
          ))}
        </pre>
      </div>
    </motion.div>
  );
}
