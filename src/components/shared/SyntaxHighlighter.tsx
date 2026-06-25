"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  go: "go",
  rust: "rust",
  cpp: "cpp",
};

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

export default function SyntaxHighlighter({
  code,
  language = "javascript",
  className = "",
}: SyntaxHighlighterProps) {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute("data-highlighted");
      hljs.highlightElement(ref.current);
    }
  }, [code, language]);

  const hljsLang = LANGUAGE_MAP[language] || "javascript";

  return (
    <pre className={`${className} m-0`} style={{ margin: 0, padding: 0, background: "transparent" }}>
      <code ref={ref} className={`language-${hljsLang}`} style={{ background: "transparent", padding: 0 }}>
        {code}
      </code>
    </pre>
  );
}

// Utility to get highlighted HTML string for overlay approach
export function getHighlightedHtml(code: string, language: string): string {
  const hljsLang = LANGUAGE_MAP[language] || "javascript";
  try {
    const result = hljs.highlight(code, { language: hljsLang });
    return result.value;
  } catch {
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
