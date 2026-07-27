"use client";

import dynamic from "next/dynamic";

const UploadPageContent = dynamic(() => import("./UploadContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-ig-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-8 h-8 skeleton rounded-full" />
          <div className="h-4 w-24 skeleton rounded" />
          <div className="w-8" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="aspect-square skeleton rounded-xl" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 w-full skeleton rounded-xl" />
        ))}
      </div>
    </div>
  ),
});

export default function UploadPage() {
  return <UploadPageContent />;
}
