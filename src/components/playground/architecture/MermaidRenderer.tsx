"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidRendererProps {
  code: string;
  id: string;
  className?: string;
}

export default function MermaidRenderer({
  code,
  id,
  className = "",
}: MermaidRendererProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    setError(null);
    setSvg(null);

    let cancelled = false;

    const render = async () => {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
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
            htmlLabels: true,
          },
        });

        const result = await mermaid.render(`mermaid-${id}`, code);
        if (!cancelled && mountedRef.current) {
          setSvg(result.svg);
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
  }, [code, id]);

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
        className={`flex flex-col items-center justify-center h-48 bg-gallery-bg rounded-xl p-6 ${className}`}
      >
        <p className="text-sm text-red-500 mb-3">图表渲染失败</p>
        <p className="text-xs text-gallery-gray text-center mb-3 max-w-md">
          {error}
        </p>
        <details className="w-full">
          <summary className="text-xs text-code-purple cursor-pointer text-center">
            查看 Mermaid 原始代码
          </summary>
          <pre className="mt-2 text-xs font-mono text-gallery-black bg-white rounded-lg p-3 overflow-auto max-h-32 border border-gallery-border">
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
    />
  );
}