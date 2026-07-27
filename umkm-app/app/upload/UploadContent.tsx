"use client";

import UploadForm from "../components/UploadForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UploadContent() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-ig-border">
        <div className="page-container flex items-center justify-between px-4 md:px-6 py-3">
          <Link
            href="/"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-base font-bold">Foto Baru</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Upload Form */}
      <div className="page-container">
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          <UploadForm />
        </div>
      </div>
    </div>
  );
}
