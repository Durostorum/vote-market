"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["ALL", "WORLD", "TECH", "BUSINESS"];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors min-w-[60px] sm:min-w-[80px]",
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
