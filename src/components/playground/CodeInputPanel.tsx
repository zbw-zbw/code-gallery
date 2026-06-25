"use client";

import { useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { Language } from "@/types";
import { detectLanguage, SUPPORTED_LANGUAGES } from "@/lib/constants";
import LanguageSelector from "./LanguageSelector";

interface CodeInputPanelProps {
  code: string;
  language: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: Language) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  extraToolbar?: ReactNode;
}

export default function CodeInputPanel({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
  isAnalyzing,
  extraToolbar,
}: CodeInputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  // Auto-detect language when code changes
  useEffect(() => {
    if (code.trim().length > 0) {
      const detected = detectLanguage(code);
      if (detected !== language) {
        onLanguageChange(detected);
      }
    }
    setLineCount(code.split("\n").length || 1);
  }, [code, language, onLanguageChange]);

  // Sync scroll between textarea and line numbers
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  // Handle Tab key to insert spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      onCodeChange(newValue);
      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
    }
  };

  const handleClear = () => {
    onCodeChange("");
    textareaRef.current?.focus();
  };

  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);
  const isEmpty = code.trim().length === 0;

  return (
    <div className="flex flex-col h-full bg-code-bg">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-code-surface">
        <div className="flex items-center gap-3">
          <LanguageSelector value={language} onChange={onLanguageChange} />
          {extraToolbar}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg text-sm text-gallery-gray hover:text-code-text hover:bg-code-surface transition-colors duration-200"
          >
            清空
          </button>
          <button
            onClick={onAnalyze}
            disabled={isEmpty || isAnalyzing}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isEmpty || isAnalyzing
                ? "bg-gallery-border text-gallery-gray cursor-not-allowed"
                : "bg-code-purple hover:bg-code-purple-light text-white"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                分析中...
              </span>
            ) : (
              "分析代码"
            )}
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="w-12 flex-shrink-0 py-4 text-right pr-3 text-sm font-mono text-gallery-gray select-none overflow-hidden bg-code-bg"
        >
          {lines.map((n) => (
            <div key={n} className="leading-6">{n}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          placeholder="粘贴你的代码到这里...（或选择右上角的示例）"
          spellCheck={false}
          className="flex-1 py-4 pl-2 pr-4 bg-code-bg text-code-text text-sm font-mono leading-6 resize-none outline-none border-none placeholder:text-gallery-gray/50"
        />
      </div>

      {/* Bottom info bar */}
      <div className="px-4 py-2 border-t border-code-surface text-xs text-gallery-gray flex items-center justify-between">
        <span>
          共 {lineCount} 行 · 语言:{" "}
          {SUPPORTED_LANGUAGES.find((l) => l.value === language)?.label}
        </span>
        <span>{code.length} 字符</span>
      </div>
    </div>
  );
}
