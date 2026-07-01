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

// Simple LCS-based diff for line-level comparison
function computeLineDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  const oldSet = new Map(oldLines.map((line, i) => [line, i] as [string, number]));
  const result: DiffLine[] = [];
  let newIdx = 0;

  for (const oldLine of oldLines) {
    // Find next occurrence in new lines starting from newIdx
    let found = -1;
    for (let i = newIdx; i < newLines.length; i++) {
      if (newLines[i] === oldLine && !result.some((r) => r.newLineIdx === i && r.type !== "unchanged")) {
        found = i;
        break;
      }
    }

    if (found === newIdx) {
      // Line is unchanged at current position
      result.push({ type: "unchanged", oldLineIdx: result.length, newLineIdx: newIdx, content: oldLine });
      newIdx++;
    } else if (found > newIdx) {
      // Old line was removed (lines between newIdx and found are additions)
      result.push({ type: "removed", oldLineIdx: result.length, newLineIdx: -1, content: oldLine });
    } else {
      // Old line not found in remaining new lines
      result.push({ type: "removed", oldLineIdx: result.length, newLineIdx: -1, content: oldLine });
    }
  }

  // Remaining new lines are additions
  while (newIdx < newLines.length) {
    result.push({ type: "added", oldLineIdx: -1, newLineIdx: newIdx, content: newLines[newIdx] });
    newIdx++;
  }

  return result;
}

interface DiffLine {
  type: "unchanged" | "added" | "removed";
  oldLineIdx: number;
  newLineIdx: number;
  content: string;
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

  const LINE_HEIGHT = 22; // approximate line height in px

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
      <div ref={scrollRef} className="flex-1 overflow-auto code-scroll-dark">
        <div className="flex min-w-full" style={{ lineHeight: `${LINE_HEIGHT}px` }}>
          {/* Old code column */}
          <div className="flex-1 min-w-0 border-r border-code-bg/50">
            <div className="sticky top-0 bg-code-surface px-3 py-1 text-xs text-gallery-gray font-mono border-b border-code-bg/30 z-10">
              {oldLabel}
            </div>
            <div>
              {diffLines.map((line, i) => {
                if (line.type === "added") {
                  return (
                    <div key={i} className="flex text-sm font-mono" style={{ height: LINE_HEIGHT }}>
                      <span className="w-10 flex-shrink-0 text-right pr-2 text-gallery-gray/30 select-none text-xs">
                        {line.newLineIdx + 1}
                      </span>
                      <span className="flex-1 text-gallery-gray/30" />
                    </div>
                  );
                }
                const isRemoved = line.type === "removed";
                const lineNum = line.type === "unchanged" ? line.oldLineIdx + 1 : line.oldLineIdx + 1;
                return (
                  <div
                    key={i}
                    className={`flex text-sm font-mono ${isRemoved ? "bg-red-500/10" : ""}`}
                    style={{ height: LINE_HEIGHT }}
                  >
                    <span
                      className={`w-10 flex-shrink-0 text-right pr-2 select-none text-xs ${
                        isRemoved ? "text-red-400" : "text-gallery-gray"
                      }`}
                    >
                      {lineNum}
                    </span>
                    <span
                      className={`flex-1 pr-2 whitespace-pre ${
                        isRemoved ? "text-red-300" : "text-gallery-gray/70"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: isRemoved ? oldHighlighted[line.oldLineIdx] || " " : oldHighlighted[line.oldLineIdx] || " ",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* New code column */}
          <div className="flex-1 min-w-0">
            <div className="sticky top-0 bg-code-surface px-3 py-1 text-xs text-gallery-gray font-mono border-b border-code-bg/30 z-10">
              {newLabel}
            </div>
            <div>
              {diffLines.map((line, i) => {
                if (line.type === "removed") {
                  return (
                    <div key={i} className="flex text-sm font-mono" style={{ height: LINE_HEIGHT }}>
                      <span className="w-10 flex-shrink-0 text-right pr-2 text-gallery-gray/30 select-none text-xs">
                        {line.oldLineIdx + 1}
                      </span>
                      <span className="flex-1 text-gallery-gray/30" />
                    </div>
                  );
                }
                const isAdded = line.type === "added";
                const lineNum = line.newLineIdx + 1;
                return (
                  <div
                    key={i}
                    className={`flex text-sm font-mono ${isAdded ? "bg-data-green/10" : ""}`}
                    style={{ height: LINE_HEIGHT }}
                  >
                    <span
                      className={`w-10 flex-shrink-0 text-right pr-2 select-none text-xs ${
                        isAdded ? "text-data-green" : "text-gallery-gray"
                      }`}
                    >
                      {lineNum}
                    </span>
                    <span
                      className={`flex-1 pr-2 whitespace-pre ${
                        isAdded ? "text-data-green/90" : "text-gallery-gray/70"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: newHighlighted[line.newLineIdx] || " ",
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
