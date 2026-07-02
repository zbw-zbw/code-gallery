"use client";

import { useMemo, useRef } from "react";
import { getHighlightedHtml } from "@/components/shared/SyntaxHighlighter";

interface DiffViewProps {
  oldCode: string;
  newCode: string;
  oldLanguage?: string;
  newLanguage?: string;
  oldLabel?: string;
  newLabel?: string;
}

const LANGUAGE_MAP: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  go: "go",
  rust: "rust",
  cpp: "cpp",
};

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  oldLineNum: number; // 0-based index into oldLines, -1 if N/A
  newLineNum: number; // 0-based index into newLines, -1 if N/A
  content: string;
}

// Proper LCS (Longest Common Subsequence) based diff
// Time: O(m*n), Space: O(m*n)
function computeLineDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const m = oldLines.length;
  const n = newLines.length;

  // Build LCS table
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffLine[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      result.unshift({
        type: "unchanged",
        oldLineNum: i - 1,
        newLineNum: j - 1,
        content: oldLines[i - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: "added",
        oldLineNum: -1,
        newLineNum: j - 1,
        content: newLines[j - 1],
      });
      j--;
    } else {
      result.unshift({
        type: "removed",
        oldLineNum: i - 1,
        newLineNum: -1,
        content: oldLines[i - 1],
      });
      i--;
    }
  }

  return result;
}

export default function DiffView({
  oldCode,
  newCode,
  oldLanguage = "javascript",
  newLanguage = "javascript",
  oldLabel = "旧版本",
  newLabel = "新版本",
}: DiffViewProps) {
  const diffLines = useMemo(
    () => computeLineDiff(oldCode.split("\n"), newCode.split("\n")),
    [oldCode, newCode]
  );

  const oldHighlighted = useMemo(
    () => getHighlightedHtml(oldCode, LANGUAGE_MAP[oldLanguage] || "javascript").split("\n"),
    [oldCode, oldLanguage]
  );

  const newHighlighted = useMemo(
    () => getHighlightedHtml(newCode, LANGUAGE_MAP[newLanguage] || "javascript").split("\n"),
    [newCode, newLanguage]
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const added = diffLines.filter((d) => d.type === "added").length;
    const removed = diffLines.filter((d) => d.type === "removed").length;
    const unchanged = diffLines.filter((d) => d.type === "unchanged").length;
    return { added, removed, unchanged, total: diffLines.length };
  }, [diffLines]);

  return (
    <div className="h-full flex flex-col bg-code-bg rounded-xl overflow-hidden">
      {/* Stats bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-code-surface flex-shrink-0 text-[11px] text-gallery-gray border-b border-code-bg/30">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-data-green" aria-hidden="true" />
          +{stats.added} 行新增
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-red-400" aria-hidden="true" />
          -{stats.removed} 行删除
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-sm bg-gallery-border" aria-hidden="true" />
          {stats.unchanged} 行未变
        </span>
        <span className="ml-auto font-mono">{stats.total} 行总计</span>
      </div>

      {/* Diff area with synchronized scrolling */}
      <div ref={scrollRef} className="flex-1 overflow-auto code-scroll-dark" role="region" aria-label="代码差异对比">
        {/* Unified single-column diff view for better mobile support */}
        <div className="font-mono text-sm" style={{ lineHeight: "1.6" }}>
          {diffLines.map((line, i) => {
            const isAdded = line.type === "added";
            const isRemoved = line.type === "removed";

            return (
              <div
                key={i}
                className={`flex ${isAdded ? "bg-data-green/10" : isRemoved ? "bg-red-500/10" : ""}`}
              >
                {/* Line number column */}
                <span
                  className={`w-12 flex-shrink-0 text-right pr-2 select-none text-xs ${
                    isAdded ? "text-data-green" : isRemoved ? "text-red-400" : "text-gallery-gray"
                  }`}
                  style={{ minWidth: "3rem" }}
                >
                  {line.oldLineNum >= 0 ? line.oldLineNum + 1 : ""}
                </span>
                <span
                  className={`w-12 flex-shrink-0 text-right pr-2 select-none text-xs border-r border-code-bg/30 ${
                    isAdded ? "text-data-green" : isRemoved ? "text-red-400/50" : "text-gallery-gray"
                  }`}
                  style={{ minWidth: "3rem" }}
                >
                  {line.newLineNum >= 0 ? line.newLineNum + 1 : ""}
                </span>
                {/* Prefix */}
                <span
                  className={`w-5 flex-shrink-0 text-center select-none ${
                    isAdded ? "text-data-green" : isRemoved ? "text-red-400" : "text-gallery-gray/30"
                  }`}
                >
                  {isAdded ? "+" : isRemoved ? "-" : " "}
                </span>
                {/* Content with syntax highlighting */}
                <span
                  className={`flex-1 pr-4 whitespace-pre overflow-x-auto ${
                    isAdded
                      ? "text-data-green/90"
                      : isRemoved
                      ? "text-red-300"
                      : "text-code-text/80"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: isRemoved
                      ? oldHighlighted[line.oldLineNum] || " "
                      : isAdded
                      ? newHighlighted[line.newLineNum] || " "
                      : oldHighlighted[line.oldLineNum] || " ",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Column headers (sticky at top) */}
      <div className="flex items-center px-4 py-1.5 bg-code-surface border-t border-code-bg/30 text-[11px] text-gallery-gray font-mono flex-shrink-0">
        <span className="w-12 text-right pr-2" style={{ minWidth: "3rem" }}>旧</span>
        <span className="w-12 text-right pr-2 border-r border-code-bg/30" style={{ minWidth: "3rem" }}>新</span>
        <span className="w-5 text-center"> </span>
        <span className="flex-1">{oldLabel} → {newLabel}</span>
      </div>
    </div>
  );
}
