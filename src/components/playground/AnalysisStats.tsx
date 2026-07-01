"use client";

import { useMemo } from "react";
import { AnalysisResult } from "@/types";

interface AnalysisStatsProps {
  result: AnalysisResult;
}

interface StatItem {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function AnalysisStats({ result }: AnalysisStatsProps) {
  const stats = useMemo(() => {
    const steps = result.executionSteps || [];

    // Count unique variables across all steps
    const uniqueVars = new Set<string>();
    steps.forEach((step) => {
      step.variables?.forEach((v) => uniqueVars.add(v.name));
    });

    // Count different step types
    const branchCount = steps.filter(
      (s) => s.highlight === "branch-true" || s.highlight === "branch-false"
    ).length;
    const loopCount = steps.filter((s) => s.highlight === "loop-start").length;
    const functionCallCount = steps.filter((s) => s.highlight === "function-call").length;
    const returnCount = steps.filter((s) => s.highlight === "return").length;

    // Count architecture nodes and edges
    const archNodes = result.architecture?.nodes?.length || 0;
    const archEdges = result.architecture?.edges?.length || 0;

    // Count dataflow nodes and edges
    const flowNodes = result.dataFlow?.nodes?.length || 0;
    const flowEdges = result.dataFlow?.edges?.length || 0;

    return {
      steps: steps.length,
      variables: uniqueVars.size,
      branches: branchCount,
      loops: loopCount,
      functionCalls: functionCallCount,
      returns: returnCount,
      archNodes,
      archEdges,
      flowNodes,
      flowEdges,
    };
  }, [result]);

  const executionStats: StatItem[] = [
    {
      label: "执行步骤",
      value: stats.steps,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      color: "code-purple",
    },
    {
      label: "变量",
      value: stats.variables,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 7h-9" />
          <path d="M14 17H5" />
          <circle cx="17" cy="17" r="3" />
          <circle cx="7" cy="7" r="3" />
        </svg>
      ),
      color: "flow-blue",
    },
    {
      label: "分支",
      value: stats.branches,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="6" y1="3" x2="6" y2="15" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
      ),
      color: "data-green",
    },
    {
      label: "循环",
      value: stats.loops,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="17 1 21 5 17 9" />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
          <polyline points="7 23 3 19 7 15" />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
        </svg>
      ),
      color: "flow-blue",
    },
    {
      label: "函数调用",
      value: stats.functionCalls,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      ),
      color: "code-purple-light",
    },
    {
      label: "返回",
      value: stats.returns,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 10 4 15 9 20" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
      ),
      color: "data-green",
    },
  ];

  const architectureStats: StatItem[] = [
    {
      label: "架构节点",
      value: stats.archNodes,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      color: "flow-blue",
    },
    {
      label: "架构连线",
      value: stats.archEdges,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      ),
      color: "code-purple",
    },
  ];

  const dataflowStats: StatItem[] = [
    {
      label: "数据流节点",
      value: stats.flowNodes,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      color: "data-green",
    },
    {
      label: "数据流连线",
      value: stats.flowEdges,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      ),
      color: "flow-blue",
    },
  ];

  return (
    <div className="px-5 py-4 bg-gallery-bg/30 border-b border-gallery-border/30">
      <h3 className="text-xs font-semibold text-gallery-gray uppercase tracking-wider mb-3">
        分析统计
      </h3>

      {/* Execution Stats */}
      <div className="mb-4">
        <p className="text-xs text-gallery-gray/70 mb-2">执行流程</p>
        <div className="grid grid-cols-3 gap-2">
          {executionStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      {/* Architecture & Dataflow Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gallery-gray/70 mb-2">架构图</p>
          <div className="grid grid-cols-2 gap-2">
            {architectureStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} compact />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-gallery-gray/70 mb-2">数据流</p>
          <div className="grid grid-cols-2 gap-2">
            {dataflowStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ stat, compact = false }: { stat: StatItem; compact?: boolean }) {
  const colorClasses: Record<string, string> = {
    "code-purple": "bg-code-purple/10 text-code-purple",
    "code-purple-light": "bg-code-purple-light/10 text-code-purple-light",
    "flow-blue": "bg-flow-blue/10 text-flow-blue",
    "data-green": "bg-data-green/10 text-data-green",
  };

  const iconBg = colorClasses[stat.color] || "bg-gallery-gray/10 text-gallery-gray";

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-gallery-white/50">
        <div className={`w-6 h-6 rounded flex items-center justify-center ${iconBg}`}>
          {stat.icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gallery-black">{stat.value}</p>
          <p className="text-[10px] text-gallery-gray truncate">{stat.label}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-gallery-white/50">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
        {stat.icon}
      </div>
      <p className="text-lg font-bold text-gallery-black">{stat.value}</p>
      <p className="text-[10px] text-gallery-gray text-center">{stat.label}</p>
    </div>
  );
}
