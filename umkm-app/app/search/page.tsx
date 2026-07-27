"use client";

import dynamic from "next/dynamic";

const SearchContent = dynamic(() => import("./SearchContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-ig-border">
        <div className="px-4 pt-3 pb-2">
          <div className="h-5 w-28 mx-auto skeleton rounded" />
        </div>
        <div className="px-4 pb-3">
          <div className="h-10 w-full skeleton rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-square skeleton" />
        ))}
      </div>
    </div>
  ),
});

export default function SearchPage() {
  return <SearchContent />;
}
