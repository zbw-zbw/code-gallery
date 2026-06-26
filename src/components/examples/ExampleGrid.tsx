"use client";

import { useState } from "react";
import { EXAMPLES, CATEGORY_LABELS, DIFFICULTY_LABELS } from "@/lib/examples";
import ExampleCard from "./ExampleCard";

export default function ExampleGrid() {
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const categories = Object.keys(CATEGORY_LABELS);
  const difficulties = Object.keys(DIFFICULTY_LABELS);

  const filtered = EXAMPLES.filter((e) => {
    const matchCategory = category === "all" || e.category === category;
    const matchDifficulty = difficulty === "all" || e.difficulty === difficulty;
    return matchCategory && matchDifficulty;
  });

  return (
    <div>
      {/* Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-2 justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                category === cat
                  ? "bg-code-purple text-white"
                  : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                difficulty === d
                  ? "bg-gallery-black text-white"
                  : "bg-gallery-bg text-gallery-gray hover:text-gallery-black"
              }`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gallery-gray text-sm">
          没有符合条件的示例
        </div>
      )}
    </div>
  );
}
