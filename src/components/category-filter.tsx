"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["ALL", "WORLD", "TECH", "BUSINESS"];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
            selectedCategory === category
              ? "bg-primary text-white"
              : "bg-background border border-border text-slate-300 hover:border-slate-500"
          )}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
