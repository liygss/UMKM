"use client";

import dynamic from "next/dynamic";

const ProfileContent = dynamic(() => import("./ProfileContent"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-ig-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="h-4 w-16 skeleton rounded" />
          <div className="w-6 h-6 skeleton rounded-full" />
        </div>
      </div>
      <div className="px-4 py-5 flex items-center gap-5">
        <div className="w-20 h-20 skeleton rounded-full" />
        <div className="flex-1 grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="h-5 w-8 mx-auto skeleton rounded" />
              <div className="h-3 w-12 mx-auto skeleton rounded mt-1" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-0.5 p-0.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square skeleton" />
        ))}
      </div>
    </div>
  ),
});

export default function ProfilePage() {
  return <ProfileContent />;
}
