"use client";

import { ArchNode } from "@/types";
import MermaidCanvas from "../MermaidCanvas";

interface ArchitectureViewProps {
  nodes: ArchNode[];
  edges: { from: string; to: string; label?: string }[];
  mermaidCode: string;
}

const LEGEND = [
  { color: "#6366f1", label: "函数" },
  { color: "#38bdf8", label: "类/模块" },
  { color: "#34d399", label: "变量/数据" },
  { color: "#9ca3af", label: "外部依赖" },
];

export default function ArchitectureView({
  nodes,
  edges,
  mermaidCode,
}: ArchitectureViewProps) {
  return (
    <MermaidCanvas
      title="架构图"
      mermaidCode={mermaidCode}
      id="architecture"
      nodes={nodes}
      edges={edges}
      legend={LEGEND}
      inputLabel="被调用"
      outputLabel="调用"
    />
  );
}
