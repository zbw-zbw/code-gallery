"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/shared/Toast";
import { exportAsPng, exportAsSvg, generateEmbedCode } from "@/lib/export";

interface ExportPanelProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  svgContent?: string;
}

export default function ExportPanel({ targetRef, svgContent }: ExportPanelProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<"png" | "svg" | "embed">("png");
  const [scale, setScale] = useState<1 | 2>(2);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();
  const panelRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!targetRef.current && format !== "embed") {
      showToast("未找到导出区域");
      return;
    }

    setExporting(true);
    try {
      if (format === "png" && targetRef.current) {
        await exportAsPng(targetRef.current, { scale });
        showToast("图片已下载");
      } else if (format === "svg" && svgContent) {
        exportAsSvg(svgContent);
        showToast("SVG 已下载");
      } else if (format === "embed") {
        const code = generateEmbedCode();
        await navigator.clipboard.writeText(code);
        showToast("嵌入代码已复制到剪贴板");
      }
    } catch {
      showToast("导出失败，请重试");
    } finally {
      setExporting(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
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
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4">
                <h4 className="text-sm font-medium text-gallery-black mb-3">导出可视化</h4>

                {/* Format selection */}
                <div className="mb-3">
                  <p className="text-xs text-gallery-gray mb-2">格式</p>
                  <div className="flex gap-2">
                    {(["png", "svg", "embed"] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
                          format === f
                            ? "bg-code-purple text-white"
                            : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
                        }`}
                      >
                        {f === "png" ? "PNG 图片" : f === "svg" ? "SVG" : "嵌入代码"}
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
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Export button */}
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className={`w-full py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    exporting
                      ? "bg-gallery-border text-gallery-gray"
                      : "bg-code-purple hover:bg-code-purple-light text-white"
                  }`}
                >
                  {exporting ? "导出中..." : "导出"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
