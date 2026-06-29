"use client";

import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = ["ALL", "WORLD", "TECH", "BUSINESS"];

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div role="group" aria-label="Filter topics by category" className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          aria-pressed={selectedCategory === category}
          aria-label={`Filter by ${category === "ALL" ? "all categories" : category.toLowerCase()}`}
          className={cn(
            "px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors min-w-[60px] sm:min-w-[80px] focus:outline-none focus:ring-2 focus:ring-green-500",
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
