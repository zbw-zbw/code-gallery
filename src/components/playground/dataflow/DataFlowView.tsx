"use client";

import { FlowNode } from "@/types";
import MermaidCanvas from "../MermaidCanvas";

interface DataFlowViewProps {
  nodes: FlowNode[];
  edges: { from: string; to: string; label?: string }[];
  mermaidCode: string;
}

const LEGEND = [
  { color: "#38bdf8", label: "输入" },
  { color: "#6366f1", label: "处理" },
  { color: "#34d399", label: "输出" },
  { color: "#f59e0b", label: "判断" },
  { color: "#9ca3af", label: "存储" },
];

export default function DataFlowView({
  nodes,
  edges,
  mermaidCode,
}: DataFlowViewProps) {
  return (
    <MermaidCanvas
      title="数据流图"
      mermaidCode={mermaidCode}
      id="dataflow"
      nodes={nodes}
      edges={edges}
      legend={LEGEND}
      inputLabel="输入来源"
      outputLabel="输出目标"
      flowAnimation
    />
  );
}
