"use client";

import Link from "next/link";
import { Example } from "@/lib/examples";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, DIFFICULTY_STYLES } from "@/lib/examples";
import Image from "next/image";

interface ExampleCardProps {
  example: Example;
}

export default function ExampleCard({ example }: ExampleCardProps) {
  const lang = SUPPORTED_LANGUAGES.find((l) => l.value === example.language);

  return (
    <Link
      href={`/playground?example=${example.id}`}
      className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Code preview image */}
      <div className="h-32 bg-code-bg relative overflow-hidden">
        <Image
          src={`/examples/${example.id}.svg`}
          alt={example.title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
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
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${DIFFICULTY_STYLES[example.difficulty]}`}>
            {DIFFICULTY_LABELS[example.difficulty]}
          </span>
        </div>
        <p className="text-xs text-gallery-gray leading-relaxed mb-3">
          {example.description}
        </p>
        <span className="text-xs text-code-purple font-medium group-hover:underline">
          在 Playground 中打开
        </span>
      </div>
    </Link>
  );
}
