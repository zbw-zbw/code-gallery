"use client";

import { useState } from "react";
import { EXAMPLES, CATEGORY_LABELS } from "@/lib/examples";
import ExampleCard from "./ExampleCard";

export default function ExampleGrid() {
  const [category, setCategory] = useState("all");
  const categories = Object.keys(CATEGORY_LABELS);
  const filtered =
    category === "all"
      ? EXAMPLES
      : EXAMPLES.filter((e) => e.category === category);

  return (
    <div>
      {/* Filter */}
      <div className="flex gap-2 mb-8 justify-center flex-wrap">
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((example) => (
          <ExampleCard key={example.id} example={example} />
        ))}
      </div>
    </div>
  );
}
