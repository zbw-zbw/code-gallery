"use client";

import { useState, useCallback, useRef, useEffect, useMemo, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MermaidRenderer from "./architecture/MermaidRenderer";

interface Edge {
  from: string;
  to: string;
  label?: string;
}

interface CanvasNode {
  id: string;
  label: string;
  type: string;
  description?: string;
}

interface LegendItem {
  color: string;
  label: string;
}

interface MermaidCanvasProps {
  title: string;
  mermaidCode: string;
  id: string;
  nodes: CanvasNode[];
  edges: Edge[];
  legend: LegendItem[];
  inputLabel?: string;
  outputLabel?: string;
  flowAnimation?: boolean;
  renderExtraDetails?: (node: CanvasNode & { incoming: Edge[]; outgoing: Edge[] }) => ReactNode;
}

export default function MermaidCanvas({
  title,
  mermaidCode,
  id,
  nodes,
  edges,
  legend,
  inputLabel = "输入来源",
  outputLabel = "输出目标",
  flowAnimation = false,
  renderExtraDetails,
}: MermaidCanvasProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedNode, setSelectedNode] = useState<CanvasNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CanvasNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for non-passive event handlers (wheel, touch)
  const scaleRef = useRef(scale);
  const positionRef = useRef(position);
  const isDraggingRef = useRef(isDragging);
  const dragStartRef = useRef(dragStart);

  // Keep refs in sync with state
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { positionRef.current = position; }, [position]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { dragStartRef.current = dragStart; }, [dragStart]);

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

  // Non-passive wheel handler (fixes passive listener issue)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only intercept wheel when Ctrl/Cmd is held — otherwise let the page scroll
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setScale((prev) => Math.min(3, Math.max(0.5, +(prev + delta).toFixed(2))));
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Non-passive touch handler with pinch-to-zoom support
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let pinchStartDist = 0;
    let pinchStartScale = 1;

    const getTouchDist = (touches: TouchList) => {
      if (touches.length !== 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Start pinch-to-zoom
        pinchStartDist = getTouchDist(e.touches);
        pinchStartScale = scaleRef.current;
        setIsDragging(false);
      } else if (e.touches.length === 1) {
        // Start single-finger pan
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - positionRef.current.x,
          y: e.touches[0].clientY - positionRef.current.y,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDist > 0) {
        // Pinch-to-zoom
        e.preventDefault();
        const dist = getTouchDist(e.touches);
        const ratio = dist / pinchStartDist;
        const newScale = Math.min(3, Math.max(0.5, +(pinchStartScale * ratio).toFixed(1)));
        setScale(newScale);
      } else if (e.touches.length === 1 && isDraggingRef.current) {
        // Single-finger pan
        e.preventDefault();
        setPosition({
          x: e.touches[0].clientX - dragStartRef.current.x,
          y: e.touches[0].clientY - dragStartRef.current.y,
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        pinchStartDist = 0;
      }
      // If one finger remains after pinch, resume panning with that finger
      if (e.touches.length === 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - positionRef.current.x,
          y: e.touches[0].clientY - positionRef.current.y,
        });
      }
      if (e.touches.length === 0) {
        setIsDragging(false);
      }
    };

    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: false });
    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
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

  // Optional flow animation for data flow edges
  useEffect(() => {
    if (!flowAnimation || !containerRef.current) return;

    const container = containerRef.current;
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
  }, [flowAnimation, mermaidCode]);

  // Node interactions
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !nodes.length) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nodeEl = target.closest(".node") as HTMLElement | null;
      if (nodeEl) {
        const labelEl = nodeEl.querySelector(".label") as HTMLElement | null;
        const label = labelEl?.textContent?.trim() || "";
        const found = nodes.find((n) => n.label === label);
        if (found) setSelectedNode(found);
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

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const nodeEl = target.closest(".node") as HTMLElement | null;
      if (!nodeEl) setHoveredNode(null);
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [nodes]);

  const nodeConnections = useMemo(
    () => nodes.map((node) => {
      const outgoing = edges.filter((e) => e.from === node.id);
      const incoming = edges.filter((e) => e.to === node.id);
      return { ...node, outgoing, incoming };
    }),
    [nodes, edges]
  );

  const activeNode = selectedNode || hoveredNode;
  const activeNodeData = activeNode
    ? nodeConnections.find((n) => n.id === activeNode.id)
    : null;

  return (
    <div className="h-full flex flex-col bg-gallery-white overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gallery-bg/50 flex-shrink-0">
        <h3 className="text-sm font-medium text-gallery-black">{title}</h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
            title="缩小"
            aria-label="缩小"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <span className="text-xs font-mono text-gallery-gray w-8 text-center" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200"
            title="放大"
            aria-label="放大"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button
            onClick={resetView}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-gallery-gray hover:text-gallery-black hover:bg-gallery-border/50 transition-colors duration-200 ml-1"
            title="重置 (0)"
            aria-label="重置视图"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
          <span className="text-[10px] text-gallery-gray/60 ml-1 hidden sm:inline" aria-hidden="true">
            Ctrl+滚轮缩放
          </span>
        </div>
      </div>

      {/* Chart area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative bg-[#fcfcff]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(229, 231, 235, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(229, 231, 235, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "24px 24px",
          cursor: isDragging ? "grabbing" : "grab",
          // touch-action: none prevents browser default touch behaviors
          touchAction: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        tabIndex={0}
        role="img"
        aria-label={`${title} — 可交互图表，方向键平移，+/− 缩放，0 重置`}
        onKeyDown={(e) => {
          const step = 30;
          switch (e.key) {
            case "ArrowUp":
              e.preventDefault();
              setPosition((p) => ({ ...p, y: p.y + step }));
              break;
            case "ArrowDown":
              e.preventDefault();
              setPosition((p) => ({ ...p, y: p.y - step }));
              break;
            case "ArrowLeft":
              e.preventDefault();
              setPosition((p) => ({ ...p, x: p.x + step }));
              break;
            case "ArrowRight":
              e.preventDefault();
              setPosition((p) => ({ ...p, x: p.x - step }));
              break;
            case "+":
            case "=":
              e.preventDefault();
              zoomIn();
              break;
            case "-":
              e.preventDefault();
              zoomOut();
              break;
            case "0":
              e.preventDefault();
              resetView();
              break;
          }
        }}
      >
        {/* Node info panel */}
        <AnimatePresence>
          {activeNodeData && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute top-4 right-4 z-10 bg-gallery-white rounded-xl shadow-lg p-4 max-w-[260px] pointer-events-none"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gallery-black">
                  {activeNodeData.label}
                </span>
                {selectedNode && (
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gallery-gray hover:text-gallery-black pointer-events-auto"
                    aria-label="关闭节点详情"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              {activeNodeData.description && (
                <p className="text-xs text-gallery-gray leading-relaxed mb-2">
                  {activeNodeData.description}
                </p>
              )}
              {renderExtraDetails?.(activeNodeData)}
              <div className="flex flex-wrap gap-1 mb-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gallery-bg text-gallery-gray">
                  {activeNodeData.type}
                </span>
              </div>
              {activeNodeData.incoming.length > 0 && (
                <div className="mb-1">
                  <span className="text-[10px] text-gallery-gray">{inputLabel}:</span>
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
                  <span className="text-[10px] text-gallery-gray">{outputLabel}:</span>
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

        {/* Zoomable/pannable chart container */}
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
            id={id}
            className="pointer-events-auto"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 md:gap-6 px-5 py-3 bg-gallery-bg/50 flex-shrink-0 flex-wrap">
        {legend.map((item, i) => (
          <LegendItem key={i} color={item.color} label={item.label} />
        ))}
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
      <span className="text-xs text-gallery-gray">{label}</span>
    </div>
  );
}
