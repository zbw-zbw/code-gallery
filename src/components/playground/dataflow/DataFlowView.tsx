"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { FlowNode } from "@/types";
import MermaidRenderer from "../architecture/MermaidRenderer";

interface DataFlowViewProps {
  nodes: FlowNode[];
  edges: { from: string; to: string; label?: string }[];
  mermaidCode: string;
}

export default function DataFlowView({
  nodes,
  edges,
  mermaidCode,
}: DataFlowViewProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => {
    setScale((prev) => Math.min(3, +(prev + 0.2).toFixed(1)));
  }, []);

  const zoomOut = useCallback(() => {
    setScale((prev) => Math.max(0.5, +(prev - 0.2).toFixed(1)));
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((prev) => Math.min(3, Math.max(0.5, +(prev + delta).toFixed(1))));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // After Mermaid renders, inject flow animation to SVG paths
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const container = svgContainerRef.current;
    const observer = new MutationObserver(() => {
      const svg = container.querySelector("svg");
      if (!svg) return;

      // Add flow animation styles to the SVG
      const styleEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "style"
      );
      styleEl.textContent = `
        @keyframes flowDash {
          to { stroke-dashoffset: -20; }
        }
        .flow-path {
          stroke-dasharray: 8 4;
          animation: flowDash 2s linear infinite;
        }
        .flow-edge path {
          stroke-dasharray: 6 3;
          animation: flowDash 3s linear infinite;
        }
      `;

      // Only inject once
      if (!svg.querySelector("#flow-anim-style")) {
        styleEl.id = "flow-anim-style";
        svg.prepend(styleEl);
      }

      // Apply flow class to edge paths
      const edgePaths = svg.querySelectorAll(".edgePaths path");
      edgePaths.forEach((p) => p.classList.add("flow-path"));

      observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [mermaidCode]);

  return (
    <div className="h-full flex flex-col bg-gallery-white overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gallery-border bg-gallery-bg/50 flex-shrink-0">
        <h3 className="text-sm font-medium text-gallery-black">数据流图</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
            title="缩小"
          >
            −
          </button>
          <span className="text-xs font-mono text-gallery-gray w-8 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
            title="放大"
          >
            +
          </button>
          <button
            onClick={resetView}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200 ml-1"
            title="重置"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Chart area */}
      <div
        ref={svgContainerRef}
        className="flex-1 overflow-hidden relative bg-[#fcfcff]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(229, 231, 235, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229, 231, 235, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
            userSelect: "none",
          }}
        >
          <MermaidRenderer
            code={mermaidCode}
            id="dataflow"
            className="pointer-events-auto"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 md:gap-6 px-5 py-3 border-t border-gallery-border bg-gallery-bg/50 flex-shrink-0 flex-wrap">
        <DataFlowLegendItem color="#38bdf8" icon="📥" label="输入" />
        <DataFlowLegendItem color="#6366f1" icon="⚙️" label="处理" />
        <DataFlowLegendItem color="#34d399" icon="📤" label="输出" />
        <DataFlowLegendItem color="#f59e0b" icon="❓" label="判断" />
        <DataFlowLegendItem color="#9ca3af" icon="💾" label="存储" />
      </div>
    </div>
  );
}

function DataFlowLegendItem({
  color,
  icon,
  label,
}: {
  color: string;
  icon: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-gallery-gray">{icon}</span>
      <span className="text-xs text-gallery-gray">{label}</span>
    </div>
  );
}