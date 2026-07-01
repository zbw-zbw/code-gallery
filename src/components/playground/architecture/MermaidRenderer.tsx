"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type Mermaid from "mermaid";
import { useToast } from "@/components/shared/Toast";

interface MermaidRendererProps {
  code: string;
  id: string;
  className?: string;
}

// Module-level singleton: load and initialize mermaid only once
let mermaidPromise: Promise<typeof Mermaid> | null = null;
let mermaidInstance: typeof Mermaid | null = null;

async function getMermaid(): Promise<typeof Mermaid> {
  if (mermaidInstance) return mermaidInstance;
  if (mermaidPromise) return mermaidPromise;

  mermaidPromise = import("mermaid").then((mod) => {
    const mermaid = mod.default;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        primaryColor: "#6366f1",
        primaryTextColor: "#1a1a1a",
        primaryBorderColor: "#818cf8",
        lineColor: "#6b7280",
        secondaryColor: "#38bdf8",
        tertiaryColor: "#34d399",
        background: "#ffffff",
        mainBkg: "#f0f0ff",
        nodeBorder: "#6366f1",
        clusterBkg: "#f8f8ff",
        fontSize: "14px",
        fontFamily:
          '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
      },
      flowchart: {
        curve: "basis",
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 60,
        htmlLabels: false,
      },
    });
    mermaidInstance = mermaid;
    return mermaid;
  });

  return mermaidPromise;
}

// Lazy-load DOMPurify only in browser (requires window)
let dompurifyPromise: Promise<(dirty: string) => string> | null = null;

async function getSanitizer(): Promise<(dirty: string) => string> {
  if (dompurifyPromise) return dompurifyPromise;

  dompurifyPromise = import("dompurify").then((mod) => {
    const DOMPurify = mod.default;
    const purify = typeof DOMPurify === "function" ? DOMPurify(window) : DOMPurify;
    purify.setConfig({
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ["foreignObject"],
      FORBID_TAGS: ["script", "iframe", "object", "embed"],
      FORBID_ATTR: ["onload", "onclick", "onerror", "onmouseover"],
    });
    return (dirty: string) => purify.sanitize(dirty);
  });

  return dompurifyPromise;
}

export default function MermaidRenderer({
  code,
  id,
  className = "",
}: MermaidRendererProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const mountedRef = useRef(true);
  const { showToast } = useToast();

  useEffect(() => {
    mountedRef.current = true;
    // Don't clear SVG on re-render — keep the previous one visible until the new one is ready
    // This prevents flicker when code changes incrementally
    setLoading(true);
    setError(null);

    let cancelled = false;

    const render = async () => {
      try {
        const [mermaid, sanitize] = await Promise.all([
          getMermaid(),
          getSanitizer(),
        ]);
        // Use unique id with retryKey to avoid collisions
        const renderId = `mermaid-${id}-${retryKey}`;
        const result = await mermaid.render(renderId, code);
        if (!cancelled && mountedRef.current) {
          const cleanSvg = sanitize(result.svg);
          setSvg(cleanSvg);
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled && mountedRef.current) {
          const msg = e instanceof Error ? e.message : "Mermaid 渲染失败";
          setError(msg);
          setLoading(false);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
      mountedRef.current = false;
    };
  }, [code, id, retryKey]);

  const handleRetry = useCallback(() => {
    setRetryKey((prev) => prev + 1);
  }, []);

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      showToast("Mermaid 代码已复制");
    } catch {
      showToast("复制失败");
    }
  }, [code, showToast]);

  // If we have a previous SVG and are re-rendering, show it instead of the loading state
  if (loading && svg) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: svg }}
        role="img"
        aria-label="架构图（正在更新...）"
      />
    );
  }

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-48 bg-gallery-bg rounded-xl animate-pulse ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className="animate-spin w-6 h-6 text-code-purple"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm text-gallery-gray">正在渲染图表...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[200px] bg-gallery-bg rounded-xl p-6 ${className}`}
      >
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-sm font-medium text-gallery-black mb-1">图表渲染失败</p>
        <p className="text-xs text-gallery-gray text-center mb-4 max-w-md">
          {error}
        </p>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={handleRetry}
            className="px-3 py-1.5 rounded-lg bg-code-purple hover:bg-code-purple-light text-white text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            重试
          </button>
          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 rounded-lg bg-gallery-white border border-gallery-border/50 text-gallery-gray hover:text-gallery-black text-xs font-medium transition-colors duration-200 flex items-center gap-1.5"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            复制代码
          </button>
        </div>
        <details className="w-full">
          <summary className="text-xs text-code-purple cursor-pointer text-center">
            查看 Mermaid 原始代码
          </summary>
          <pre className="mt-2 text-xs font-mono text-gallery-black bg-gallery-white rounded-lg p-3 overflow-auto max-h-32 shadow-sm">
            {code}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svg || "" }}
      role="img"
      aria-label={`图表: ${code.split("\n")[0].replace(/^(graph|flowchart)\s+/, "").slice(0, 60)}`}
    />
  );
}
