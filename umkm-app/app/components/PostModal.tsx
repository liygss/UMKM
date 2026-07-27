"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { X, MapPin, Phone, Tag, DollarSign, Calendar, Store, ChevronLeft, ChevronRight } from "lucide-react";

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

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const allPhotos = post.photos?.length ? post.photos : [post.foto_url];
  const hasMultiple = allPhotos.length > 1;

  const formatHarga = (harga: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const goTo = useCallback(
    (dir: number) => {
      setCurrentSlide((prev) => {
        const next = prev + dir;
        if (next < 0) return allPhotos.length - 1;
        if (next >= allPhotos.length) return 0;
        return next;
      });
    },
    [allPhotos.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? 1 : -1);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(-1);
      if (e.key === "ArrowRight") goTo(1);
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo, onClose]);

  return (
    <div className="fixed inset-0 z-[100] modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 flex items-end md:items-center justify-center">
        <div
          className="bg-white w-full max-w-5xl max-h-[95dvh] md:max-h-[85dvh] rounded-t-2xl md:rounded-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left: Carousel */}
          <div className="md:w-3/5 flex-shrink-0">
            {/* Header - mobile */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-ig-border md:hidden">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full ig-gradient flex items-center justify-center">
                  <Store size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{post.nama_umkm}</p>
                  <p className="text-[11px] text-ig-text-secondary">{post.kategori}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Carousel */}
            <div
              className="relative bg-gray-100 touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="aspect-video md:aspect-[4/3] overflow-hidden">
                <div
                  className="flex h-full transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {allPhotos.map((url, idx) => (
                    <div key={idx} className="min-w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`${post.nama_produk} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Nav arrows */}
              {hasMultiple && (
                <>
                  <button
                    onClick={() => goTo(-1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => goTo(1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Dots */}
              {hasMultiple && (
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5">
                  {allPhotos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-200 ${
                        idx === currentSlide ? "bg-white w-5" : "bg-white/50 w-2"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Counter */}
              {hasMultiple && (
                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full">
                  {currentSlide + 1}/{allPhotos.length}
                </div>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="md:w-2/5 flex flex-col min-h-0">
            {/* Header - desktop */}
            <div className="hidden md:flex items-center justify-between px-5 py-3 border-b border-ig-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full ig-gradient flex items-center justify-center">
                  <Store size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{post.nama_umkm}</p>
                  <p className="text-[11px] text-ig-text-secondary">{post.kategori}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable info */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {/* Nama Produk */}
              <div>
                <h2 className="text-xl font-bold">{post.nama_produk}</h2>
                {post.harga > 0 && (
                  <p className="text-ig-primary font-bold text-2xl mt-1">
                    {formatHarga(post.harga)}
                  </p>
                )}
              </div>

              {/* Deskripsi */}
              {post.deskripsi && (
                <p className="text-sm text-ig-text-secondary leading-relaxed">
                  {post.deskripsi}
                </p>
              )}

              {/* Detail items */}
              <div className="space-y-3 pt-3 border-t border-ig-border">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Store size={16} className="text-ig-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-ig-text-secondary">Nama UMKM</p>
                    <p className="font-medium">{post.nama_umkm}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Tag size={16} className="text-ig-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-ig-text-secondary">Kategori</p>
                    <p className="font-medium">{post.kategori}</p>
                  </div>
                </div>

                {post.harga > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <DollarSign size={16} className="text-ig-text-secondary" />
                    </div>
                    <div>
                      <p className="text-[11px] text-ig-text-secondary">Harga</p>
                      <p className="font-medium">{formatHarga(post.harga)}</p>
                    </div>
                  </div>
                )}

                {post.lokasi && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-ig-text-secondary" />
                    </div>
                    <div>
                      <p className="text-[11px] text-ig-text-secondary">Lokasi</p>
                      <p className="font-medium">{post.lokasi}</p>
                    </div>
                  </div>
                )}

                {post.kontak && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-ig-text-secondary" />
                    </div>
                    <div>
                      <p className="text-[11px] text-ig-text-secondary">Kontak</p>
                      <p className="font-medium">{post.kontak}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <Calendar size={16} className="text-ig-text-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-ig-text-secondary">Diupload</p>
                    <p className="font-medium">{formatDate(post.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
