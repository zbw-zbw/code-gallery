"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { FlowNode } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
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
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<FlowNode | null>(null);
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

  // Touch support for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length !== 1) return;
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    },
    [position]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // After Mermaid renders, inject flow animation to SVG paths
  useEffect(() => {
    if (!svgContainerRef.current) return;

    const container = svgContainerRef.current;
    const observer = new MutationObserver(() => {
      const svg = container.querySelector("svg");
      if (!svg) return;

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

      if (!svg.querySelector("#flow-anim-style")) {
        styleEl.id = "flow-anim-style";
        svg.prepend(styleEl);
      }

      const edgePaths = svg.querySelectorAll(".edgePaths path");
      edgePaths.forEach((p) => p.classList.add("flow-path"));

      observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [mermaidCode]);

  // Node interaction
  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container || !nodes.length) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nodeEl = target.closest(".node") as HTMLElement | null;
      if (nodeEl) {
        const labelEl = nodeEl.querySelector(".label") as HTMLElement | null;
        const label = labelEl?.textContent?.trim() || "";
        const found = nodes.find((n) => n.label === label);
        if (found) {
          setSelectedNode(found);
        }
      } else {
        setSelectedNode(null);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nodeEl = target.closest(".node") as HTMLElement | null;
      if (nodeEl) {
        const labelEl = nodeEl.querySelector(".label") as HTMLElement | null;
        const label = labelEl?.textContent?.trim() || "";
        const found = nodes.find((n) => n.label === label);
        if (found) setHoveredNode(found);
      }
    };

    const handleMouseOut = () => setHoveredNode(null);

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [nodes]);

  const nodeConnections = nodes.map((node) => {
    const outgoing = edges.filter((e) => e.from === node.id);
    const incoming = edges.filter((e) => e.to === node.id);
    return { ...node, outgoing, incoming };
  });

  const activeNode = selectedNode || hoveredNode;
  const activeNodeData = activeNode
    ? nodeConnections.find((n) => n.id === activeNode.id)
    : null;

  return (
    <div className="h-full flex flex-col bg-gallery-white overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gallery-bg/50 flex-shrink-0">
        <h3 className="text-sm font-medium text-gallery-black">数据流图</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
            title="缩小"
            aria-label="缩小"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span className="text-xs font-mono text-gallery-gray w-8 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
            title="放大"
            aria-label="放大"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button
            onClick={resetView}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200 ml-1"
            title="重置"
            aria-label="重置视图"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Node info panel */}
        <AnimatePresence>
          {activeNodeData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-lg p-4 max-w-[260px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gallery-black">
                  {activeNodeData.label}
                </span>
                {selectedNode && (
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gallery-gray hover:text-gallery-black"
                    aria-label="关闭节点详情"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gallery-bg text-gallery-gray">
                  {activeNodeData.type}
                </span>
              </div>
              {activeNodeData.incoming.length > 0 && (
                <div className="mb-1">
                  <span className="text-[10px] text-gallery-gray">输入来源:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {activeNodeData.incoming.map((e, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-flow-blue/10 text-flow-blue">
                        {e.from}{e.label ? ` (${e.label})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {activeNodeData.outgoing.length > 0 && (
                <div>
                  <span className="text-[10px] text-gallery-gray">输出目标:</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {activeNodeData.outgoing.map((e, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-code-purple/10 text-code-purple">
                        {e.to}{e.label ? ` (${e.label})` : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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

      {/* Legend - SVG icons instead of emojis */}
      <div className="flex items-center justify-center gap-4 md:gap-6 px-5 py-3 bg-gallery-bg/50 flex-shrink-0 flex-wrap">
        <DataFlowLegendItem color="#38bdf8" label="输入" />
        <DataFlowLegendItem color="#6366f1" label="处理" />
        <DataFlowLegendItem color="#34d399" label="输出" />
        <DataFlowLegendItem color="#f59e0b" label="判断" />
        <DataFlowLegendItem color="#9ca3af" label="存储" />
      </div>
    </div>
  );
}

function DataFlowLegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-gallery-gray">{label}</span>
    </div>
  );
}
