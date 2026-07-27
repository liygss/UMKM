"use client";

import { MapPin, Tag, Images } from "lucide-react";

interface Post {
  id: string;
  nama_umkm: string;
  nama_produk: string;
  deskripsi: string;
  harga: number;
  foto_url: string;
  kategori: string;
  kontak: string;
  lokasi: string;
  created_at: string;
  photos?: string[];
}

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const formatHarga = (harga: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const photoCount = post.photos?.length || 1;

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer bg-white border border-ig-border rounded-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
    >
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.foto_url}
          alt={post.nama_produk}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-3">
          <p className="font-bold text-sm md:text-base text-center">{post.nama_produk}</p>
          <p className="text-xs md:text-sm mt-1 text-center text-white/80">
            {post.nama_umkm}
          </p>
          {post.harga > 0 && (
            <p className="text-sm md:text-base font-semibold mt-2">{formatHarga(post.harga)}</p>
          )}
        </div>

        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-white/90 backdrop-blur-sm text-ig-text text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Tag size={10} />
            {post.kategori}
          </span>
        </div>

        {/* Photo count badge */}
        {photoCount > 1 && (
          <div className="absolute top-2 right-2">
            <span className="bg-black/60 text-white text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Images size={10} />
              {photoCount}
            </span>
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="p-2 md:p-2.5">
        <p className="text-xs md:text-sm font-semibold truncate">{post.nama_produk}</p>
        <p className="text-[11px] md:text-xs text-ig-text-secondary truncate flex items-center gap-1 mt-0.5">
          <MapPin size={10} />
          {post.lokasi || post.nama_umkm}
        </p>
      </div>
    </div>
  );
}
