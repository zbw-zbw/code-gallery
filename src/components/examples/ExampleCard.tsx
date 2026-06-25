"use client";

import Link from "next/link";
import { Example } from "@/lib/examples";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { CATEGORY_LABELS } from "@/lib/examples";

interface ExampleCardProps {
  example: Example;
}

export default function ExampleCard({ example }: ExampleCardProps) {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.value === example.language);
  const codeLines = example.code.split("\n").slice(0, 3);

  return (
    <Link
      href={`/playground?example=${example.id}`}
      className="group block rounded-2xl border border-gallery-border overflow-hidden bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Code preview */}
      <div className="h-28 bg-code-bg relative overflow-hidden px-4 py-3">
        <div className="space-y-1.5">
          {codeLines.map((line, i) => (
            <div
              key={i}
              className="h-3 rounded bg-gallery-gray/30"
              style={{ width: `${[85, 60, 72][i % 3]}%` }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-code-bg" />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-sm font-medium text-gallery-black group-hover:text-code-purple transition-colors duration-200">
            {example.title}
          </h3>
          {lang && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gallery-bg text-gallery-gray flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rounded-sm inline-block"
                style={{ backgroundColor: lang.color }}
              />
              {lang.label}
            </span>
          )}
        </div>
        <p className="text-xs text-gallery-gray leading-relaxed mb-3">
          {example.description}
        </p>
        <span className="text-xs text-code-purple font-medium group-hover:underline">
          在 Playground 中打开 →
        </span>
      </div>
    </Link>
  );
}
