// 支持的编程语言
export type Language =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "go"
  | "rust"
  | "cpp";

// 用户输入
export interface CodeInput {
  code: string;
  language: Language;
  fileName?: string;
}

// === 执行流程相关 ===

// 单个变量的状态
export interface VariableState {
  name: string;
  value: string; // JSON 序列化的值
  type: string; // "number" | "string" | "array" | "object" | "boolean"
  changed: boolean; // 本步骤是否发生变化
}

// 单个执行步骤
export interface ExecutionStep {
  stepNumber: number;
  lineNumber: number; // 对应源代码行号
  description: string; // 本步骤说明，如"比较 arr[0](5) 和 arr[1](3)"
  variables: VariableState[]; // 当前所有变量的状态
  highlight:
    | "normal"
    | "branch-true"
    | "branch-false"
    | "loop-start"
    | "loop-end"
    | "function-call"
    | "return";
  annotation?: string; // 可选的额外注解
}

// === 架构图相关 ===

// 架构节点
export interface ArchNode {
  id: string;
  label: string;
  type: "function" | "class" | "module" | "variable" | "external";
  description?: string;
}

// 架构边
export interface ArchEdge {
  from: string; // node id
  to: string; // node id
  label?: string; // 如 "calls" | "imports" | "extends"
}

// === 数据流相关 ===

// 数据流节点
export interface FlowNode {
  id: string;
  label: string;
  type: "input" | "process" | "output" | "decision" | "storage";
}

// 数据流边
export interface FlowEdge {
  from: string;
  to: string;
  label?: string; // 数据描述
}

// === API 响应 ===

export interface AnalysisResult {
  success: boolean;
  codeInput: CodeInput;
  summary: string; // 代码功能概述（一句话）
  executionSteps: ExecutionStep[];
  architecture: {
    nodes: ArchNode[];
    edges: ArchEdge[];
    mermaidCode: string; // Mermaid 语法的架构图代码
  };
  dataFlow: {
    nodes: FlowNode[];
    edges: FlowEdge[];
    mermaidCode: string; // Mermaid 语法的数据流图代码
  };
  error?: string;
}

// Landing page types (kept from round 1)
export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface PainPoint {
  emoji: string;
  title: string;
  description: string;
}

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
}

export interface BubbleSortBar {
  value: number;
  height: number;
  color: string;
}
