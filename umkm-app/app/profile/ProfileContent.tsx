"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";
import { Settings, PackageOpen } from "lucide-react";
import Link from "next/link";

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

export default function ProfileContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data: postsData, error: postsError } = await supabase
        .from("umkm_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (postsError || !postsData) {
        setLoading(false);
        return;
      }

      const postIds = postsData.map((p) => p.id);
      const { data: photosData } = await supabase
        .from("umkm_photos")
        .select("post_id, foto_url, order_index")
        .in("post_id", postIds)
        .order("order_index", { ascending: true });

      const photosMap = new Map<string, string[]>();
      if (photosData) {
        for (const photo of photosData) {
          const existing = photosMap.get(photo.post_id) || [];
          existing.push(photo.foto_url);
          photosMap.set(photo.post_id, existing);
        }
      }

      const postsWithPhotos = postsData.map((post) => ({
        ...post,
        photos: photosMap.get(post.id) || [post.foto_url],
      }));

      setPosts(postsWithPhotos);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const totalProduk = posts.length;
  const totalKategori = new Set(posts.map((p) => p.kategori)).size;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-ig-border">
        <div className="page-container flex items-center justify-between px-4 md:px-6 py-3">
          <h1 className="text-base font-bold">Profil</h1>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Settings size={22} />
          </button>
        </div>
      </div>

      <div className="page-container">
        {/* Profile info */}
        <div className="px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full ig-gradient flex items-center justify-center shrink-0">
            <span className="text-3xl font-bold text-white">U</span>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4 text-center sm:text-left">
            <div>
              <p className="text-2xl font-bold">{totalProduk}</p>
              <p className="text-sm text-ig-text-secondary">Produk</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalKategori}</p>
              <p className="text-sm text-ig-text-secondary">Kategori</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {posts.reduce((sum, p) => sum + (p.harga || 0), 0) > 0 ? "Rp" : "-"}
              </p>
              <p className="text-sm text-ig-text-secondary">Total</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="px-4 md:px-6 pb-6">
          <p className="text-sm font-semibold">Galeri UMKM Indonesia</p>
          <p className="text-sm text-ig-text-secondary">
            Menampilkan produk-produk unggulan UMKM lokal
          </p>
          <Link
            href="/upload"
            className="mt-3 inline-block text-sm font-semibold text-ig-primary border border-ig-border rounded-lg px-6 py-2 hover:bg-gray-50 transition-colors"
          >
            Unggah Produk Baru
          </Link>
        </div>

        {/* Grid */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-video skeleton rounded-lg" />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PackageOpen size={40} className="text-ig-text-secondary" />
            </div>
            <h3 className="text-xl font-bold">Belum Ada Produk</h3>
            <p className="text-sm text-ig-text-secondary mt-1 mb-4">
              Mulai unggah foto produk UMKM kamu
            </p>
            <Link
              href="/upload"
              className="px-8 py-2.5 ig-gradient text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Unggah Sekarang
            </Link>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1.5">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
