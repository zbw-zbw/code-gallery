"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/shared/Toast";
import {
  exportAsPng,
  exportAsSvg,
  generateEmbedCode,
  buildStandaloneHtml,
  downloadStandaloneHtml,
} from "@/lib/export";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { AnalysisResult } from "@/types";

type ExportFormat = "png" | "svg" | "embed" | "html";

interface ExportPanelProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  svgContent?: string;
  /** Full analysis result — required for HTML/embed export */
  analysis?: AnalysisResult | null;
}

export default function ExportPanel({
  targetRef,
  svgContent,
  analysis,
}: ExportPanelProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("png");
  const [scale, setScale] = useState<1 | 2>(2);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Filter the format list to only those that apply to the current result
  const availableFormats = useMemo<{ key: ExportFormat; label: string; hint: string }[]>(() => {
    const list: { key: ExportFormat; label: string; hint: string }[] = [
      { key: "png", label: "PNG 图片", hint: "导出当前视图" },
    ];
    if (svgContent) {
      list.push({ key: "svg", label: "SVG", hint: "矢量图，可缩放" });
    }
    if (analysis) {
      list.push({ key: "html", label: "HTML", hint: "离线可打开" });
    }
    list.push({ key: "embed", label: "嵌入代码", hint: "复制 iframe" });
    return list;
  }, [svgContent, analysis]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useFocusTrap({ open, onClose: () => setOpen(false), containerRef: panelRef });

  const handleExport = async () => {
    setExporting(true);
    try {
      if (format === "png") {
        if (!targetRef.current) {
          showToast("未找到导出区域", "error");
          return;
        }
        await exportAsPng(targetRef.current, { scale, title: analysis?.summary });
        showToast("图片已下载", "success");
      } else if (format === "svg") {
        if (!svgContent) {
          showToast("当前视图不支持 SVG 导出", "error");
          return;
        }
        exportAsSvg(svgContent, analysis?.summary);
        showToast("SVG 已下载", "success");
      } else if (format === "embed") {
        const code = generateEmbedCode();
        await navigator.clipboard.writeText(code);
        showToast("嵌入代码已复制到剪贴板", "success");
      } else if (format === "html") {
        if (!analysis) {
          showToast("当前没有可导出的分析结果", "error");
          return;
        }
        // Pick the mermaid that matches the active view if available, else architecture
        const mermaid =
          (svgContent && svgContent.length > 50 && svgContent) ||
          analysis.architecture?.mermaidCode ||
          "";
        // Convert VariableState[] into a simple { name: value } map for the standalone viewer
        const stepVarsMap = (analysis.executionSteps || []).map((s) => {
          const map: Record<string, string> = {};
          for (const v of s.variables || []) {
            map[v.name] = v.value;
          }
          return {
            lineNumber: s.lineNumber,
            description: s.description,
            variables: map,
            highlight: s.highlight,
          };
        });
        const html = buildStandaloneHtml({
          title: analysis.summary || "代码分析",
          language: analysis.codeInput?.language || "javascript",
          code: analysis.codeInput?.code || "",
          summary: analysis.summary || "",
          steps: stepVarsMap,
          mermaidCode: mermaid,
        });
        downloadStandaloneHtml(html, analysis.summary);
        showToast("HTML 已下载，可离线打开", "success");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "导出失败，请重试";
      showToast(message, "error");
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
        aria-label="导出可视化"
        aria-expanded={open}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="hidden sm:inline">导出</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="导出可视化"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 bg-gallery-white rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4">
                <h4 className="text-sm font-medium text-gallery-black mb-3">导出可视化</h4>

                {/* Format selection */}
                <div className="mb-3">
                  <p className="text-xs text-gallery-gray mb-2">格式</p>
                  <div className="grid grid-cols-2 gap-2">
                    {availableFormats.map((f) => (
                      <button
                        key={f.key}
                        onClick={() => setFormat(f.key)}
                        className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-colors duration-200 text-left ${
                          format === f.key
                            ? "bg-code-purple text-white"
                            : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
                        }`}
                        aria-label={`导出格式: ${f.label}`}
                        aria-pressed={format === f.key}
                      >
                        <div>{f.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 font-normal ${
                            format === f.key ? "text-white/80" : "text-gallery-gray/70"
                          }`}
                        >
                          {f.hint}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scale (PNG only) */}
                {format === "png" && (
                  <div className="mb-3">
                    <p className="text-xs text-gallery-gray mb-2">分辨率</p>
                    <div className="flex gap-2">
                      {([1, 2] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setScale(s)}
                          className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                            scale === s
                              ? "bg-code-purple text-white"
                              : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
                          }`}
                          aria-label={`分辨率 ${s}x`}
                          aria-pressed={scale === s}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Format description */}
                <FormatDescription format={format} />

                {/* Export button */}
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    exporting
                      ? "bg-gallery-border text-gallery-gray cursor-wait"
                      : "bg-code-purple hover:bg-code-purple-light text-white"
                  }`}
                >
                  {exporting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      导出中...
                    </span>
                  ) : (
                    "导出"
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function FormatDescription({ format }: { format: ExportFormat }) {
  const map: Record<ExportFormat, string> = {
    png: "将当前视图导出为 PNG 图片。",
    svg: "导出为 SVG 矢量图，可无损缩放。",
    embed: "复制 iframe 代码，可嵌入到博客或文档。",
    html: "生成独立的 HTML 文件，保留代码+步骤+架构图，无需联网即可在浏览器中打开。",
  };
  return (
    <p className="text-[11px] text-gallery-gray/80 leading-relaxed mb-3">
      {map[format]}
    </p>
  );
}
