"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import SearchBar from "./components/SearchBar";
import PostCard from "./components/PostCard";
import PostModal from "./components/PostModal";
import { PackageOpen } from "lucide-react";

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

const ALL_CATEGORIES = [
  "Semua",
  "Makanan",
  "Minuman",
  "Fashion",
  "Kecantikan",
  "Kerajinan",
  "Pertanian",
  "Jasa",
  "Elektronik",
  "Otomotif",
  "Umum",
];

export default function FeedContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = useCallback(async () => {
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
    setFilteredPosts(postsWithPhotos);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    let result = posts;

    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.kategori === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nama_umkm.toLowerCase().includes(q) ||
          p.nama_produk.toLowerCase().includes(q) ||
          p.lokasi?.toLowerCase().includes(q) ||
          p.deskripsi?.toLowerCase().includes(q)
      );
    }

    setFilteredPosts(result);
  }, [search, selectedCategory, posts]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header & Search */}
      <SearchBar
        value={search}
        onChange={setSearch}
        categories={ALL_CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="page-container">
        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-video skeleton rounded-lg" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <PackageOpen size={40} className="text-ig-text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-ig-text">
              {search || selectedCategory !== "Semua"
                ? "Tidak Ditemukan"
                : "Belum Ada Postingan"}
            </h3>
            <p className="text-sm text-ig-text-secondary mt-1">
              {search || selectedCategory !== "Semua"
                ? "Coba kata kunci atau kategori lain"
                : "Mulai unggah foto produk UMKM pertama kamu!"}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && filteredPosts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5 p-1.5">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
}
