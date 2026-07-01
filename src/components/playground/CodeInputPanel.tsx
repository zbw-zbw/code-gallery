"use client";

import { useState, useRef, useCallback, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language } from "@/types";
import { detectLanguage, SUPPORTED_LANGUAGES } from "@/lib/constants";
import LanguageSelector from "./LanguageSelector";
import { getHighlightedHtml } from "@/components/shared/SyntaxHighlighter";
import { useToast } from "@/components/shared/Toast";
import CodeTemplates from "./CodeTemplates";

const MAX_CODE_LENGTH = 5000;

const SUPPORTED_EXTENSIONS: Record<string, Language> = {
  ".js": "javascript",
  ".jsx": "javascript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".py": "python",
  ".java": "java",
  ".go": "go",
  ".rs": "rust",
  ".cpp": "cpp",
  ".cc": "cpp",
  ".c": "cpp",
  ".h": "cpp",
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(SUPPORTED_EXTENSIONS));

function detectLanguageFromFilename(filename: string): Language | null {
  const lowerName = filename.toLowerCase();
  for (const ext of Object.keys(SUPPORTED_EXTENSIONS)) {
    if (lowerName.endsWith(ext)) {
      return SUPPORTED_EXTENSIONS[ext];
    }
  }
  return null;
}

interface CodeInputPanelProps {
  code: string;
  language: Language;
  onCodeChange: (code: string) => void;
  onLanguageChange: (lang: Language) => void;
  onAnalyze: () => void;
  onCancel?: () => void;
  onShareUrl?: () => void;
  onClear?: () => void;
  isAnalyzing: boolean;
  extraToolbar?: ReactNode;
}

export default function CodeInputPanel({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
  onCancel,
  onShareUrl,
  onClear,
  isAnalyzing,
  extraToolbar,
}: CodeInputPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const { showToast } = useToast();

  // Auto-detect language on first meaningful code paste only
  const hasAutoDetected = useRef(false);
  useEffect(() => {
    setLineCount(code.split("\n").length || 1);
    if (code.trim().length > 10 && !hasAutoDetected.current) {
      const detected = detectLanguage(code);
      if (detected !== language) {
        onLanguageChange(detected);
      }
      hasAutoDetected.current = true;
    }
  }, [code, language, onLanguageChange]);

  // Sync scroll between textarea and highlight layer + line numbers
  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  // Handle Tab key to insert spaces + Ctrl/Cmd+Enter to analyze
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (canAnalyze) onAnalyze();
      return;
    }
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
    onClear?.();
    hasAutoDetected.current = false;
    setIsDragging(false);
    dragCounter.current = 0;
    textareaRef.current?.focus();
  };

  // Drag-and-drop file upload handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const file = e.dataTransfer.files[0];
      if (!file) return;

      const lowerName = file.name.toLowerCase();
      const hasValidExtension = [...ALLOWED_EXTENSIONS].some((ext) =>
        lowerName.endsWith(ext)
      );
      if (!hasValidExtension) {
        showToast("不支持的文件类型，请上传 .js/.ts/.py/.java 等代码文件");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text !== "string") return;

        if (text.length > MAX_CODE_LENGTH) {
          showToast(`文件已截断至 ${MAX_CODE_LENGTH} 字符（原文 ${text.length} 字符）`);
        }

        const trimmed = text.length > MAX_CODE_LENGTH ? text.substring(0, MAX_CODE_LENGTH) : text;
        onCodeChange(trimmed);

        const detectedLang = detectLanguageFromFilename(file.name);
        if (detectedLang) {
          onLanguageChange(detectedLang);
          hasAutoDetected.current = true;
        }
      };
      reader.readAsText(file);
    },
    [onCodeChange, onLanguageChange, showToast]
  );

  const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);
  const isEmpty = code.trim().length === 0;
  const isOverLimit = code.length > MAX_CODE_LENGTH;
  const isNearLimit = code.length > MAX_CODE_LENGTH * 0.9 && !isOverLimit;
  const canAnalyze = !isEmpty && !isAnalyzing && !isOverLimit;

  // Syntax highlighted HTML for overlay (memoized for performance)
  const highlightedHtml = useMemo(() => getHighlightedHtml(code, language), [code, language]);

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-code-bg">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-code-surface flex-shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <LanguageSelector value={language} onChange={onLanguageChange} />
          {extraToolbar}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleClear}
            className="px-2 sm:px-3 py-1.5 rounded-lg text-sm text-gallery-gray hover:text-code-text hover:bg-gallery-border/20 transition-colors duration-200"
          >
            清空
          </button>
          <button
            onClick={isAnalyzing ? onCancel : onAnalyze}
            disabled={!isAnalyzing && !canAnalyze}
            title={isOverLimit ? `代码超过 ${MAX_CODE_LENGTH} 字符限制` : isAnalyzing ? "取消分析" : "Ctrl+Enter"}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isAnalyzing
                ? "bg-red-400 hover:bg-red-500 text-white"
                : !canAnalyze
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
                取消
              </span>
            ) : (
              "分析代码"
            )}
          </button>
        </div>
      </div>

      {/* Code editor with syntax highlighting overlay */}
      <div
        className="flex-1 min-h-0 flex overflow-hidden relative"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          aria-hidden="true"
          className="w-12 flex-shrink-0 py-4 text-right pr-3 text-sm font-mono text-gallery-gray select-none overflow-hidden bg-code-bg z-10"
        >
          {lines.map((n) => (
            <div key={n} className="leading-6 min-h-6">{n}</div>
          ))}
        </div>

        {/* Editor container */}
        <div className="flex-1 min-h-0 relative">
          {/* Syntax highlighted background layer */}
          <div
            ref={highlightRef}
            className="absolute inset-0 py-4 pl-2 pr-4 text-sm font-mono leading-6 overflow-hidden pointer-events-none whitespace-pre bg-code-bg"
            aria-hidden="true"
          >
            <div
              dangerouslySetInnerHTML={{
                __html: highlightedHtml + "\n ",
              }}
              className="hljs"
              style={{ color: "#abb2bf" }}
            />
          </div>

          {/* Textarea on top - fills entire area */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            placeholder="粘贴你的代码到这里...（或点击右上角示例库）"
            spellCheck={false}
            className="absolute inset-0 py-4 pl-2 pr-4 w-full h-full bg-transparent text-code-text text-sm font-mono leading-6 resize-none outline-none border-none placeholder:text-gallery-gray/50"
            style={{
              color: "transparent",
              caretColor: "#f8f8f2",
              zIndex: 1,
            }}
          />
        </div>

        {/* Drag-and-drop overlay */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              key="drop-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-code-bg/80 backdrop-blur-sm border-2 border-dashed border-code-purple rounded-lg"
            >
              <svg
                className="w-12 h-12 text-code-purple mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-sm text-code-text/80 font-medium">
                拖放文件到此处
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick code templates - shown when editor is empty */}
      <CodeTemplates
        visible={isEmpty}
        onSelect={(templateCode, templateLang) => {
          onCodeChange(templateCode);
          onLanguageChange(templateLang);
          hasAutoDetected.current = true;
        }}
      />

      {/* Bottom info bar */}
      <div className="px-3 sm:px-4 py-2 bg-code-surface text-xs text-gallery-gray flex items-center justify-between flex-shrink-0">
        <span className="truncate">
          共 {lineCount} 行 · 语言:{" "}
          {SUPPORTED_LANGUAGES.find((l) => l.value === language)?.label}
        </span>
        <span
          className={`flex-shrink-0 ml-2 font-mono ${
            isOverLimit
              ? "text-red-400 font-medium"
              : isNearLimit
              ? "text-amber-400"
              : ""
          }`}
        >
          {code.length} / {MAX_CODE_LENGTH} 字符
          {isOverLimit && " (超限)"}
        </span>
      </div>
    </div>
  );
}
