"use client";

import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function SearchBar({
  value,
  onChange,
  categories,
  selectedCategory,
  onCategoryChange,
}: SearchBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-ig-border">
      <div className="page-container">
        {/* Header */}
        <div className="px-4 md:px-6 pt-3 pb-2">
          <h1 className="text-lg md:text-xl font-bold text-center">Galeri UMKM</h1>
        </div>

        {/* Search input */}
        <div className="px-4 md:px-6 pb-3 max-w-2xl mx-auto">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ig-text-secondary"
            />
            <input
              type="text"
              placeholder="Cari UMKM, produk, lokasi..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-gray-100 rounded-xl pl-9 pr-9 py-2.5 md:py-3 text-sm border border-transparent"
            />
            {value && (
              <button
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ig-text-secondary hover:text-ig-text"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="px-4 md:px-6 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                selectedCategory === cat
                  ? "bg-ig-text text-white border-ig-text"
                  : "bg-white text-ig-text border-ig-border hover:border-ig-text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
