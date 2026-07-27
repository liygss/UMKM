-- ============================================
-- UMKM Photo Upload - Supabase Migration
-- ============================================
-- Jalankan query ini di Supabase Dashboard > SQL Editor

-- 1. Buat tabel umkm_posts
CREATE TABLE IF NOT EXISTS umkm_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_umkm TEXT NOT NULL,
  nama_produk TEXT NOT NULL,
  deskripsi TEXT,
  harga NUMERIC,
  foto_url TEXT NOT NULL,
  kategori TEXT NOT NULL DEFAULT 'Umum',
  kontak TEXT,
  lokasi TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE umkm_posts ENABLE ROW LEVEL SECURITY;

-- 3. Policy: everyone can read
CREATE POLICY "Public read access" ON umkm_posts
  FOR SELECT USING (true);

-- 4. Policy: everyone can insert
CREATE POLICY "Public insert access" ON umkm_posts
  FOR INSERT WITH CHECK (true);

-- 5. Policy: everyone can delete (optional, for user's own posts)
CREATE POLICY "Public delete access" ON umkm_posts
  FOR DELETE USING (true);

-- 6. Buat tabel umkm_photos (multi-foto per post)
CREATE TABLE IF NOT EXISTS umkm_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES umkm_posts(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  order_index INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Enable RLS untuk umkm_photos
ALTER TABLE umkm_photos ENABLE ROW LEVEL SECURITY;

-- 8. Policies umkm_photos
CREATE POLICY "Public read photos" ON umkm_photos
  FOR SELECT USING (true);

CREATE POLICY "Public insert photos" ON umkm_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public delete photos" ON umkm_photos
  FOR DELETE USING (true);

-- 9. Buat Storage Bucket
-- NOTE: Bucket harus dibuat via Dashboard > Storage > New Bucket
-- Nama bucket: umkm-photos
-- Type: Public
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- 10. Storage Policy (jalankan jika bucket sudah dibuat)
-- Di Dashboard > Storage > umkm-photos > Policies:
-- INSERT policy: "Allow public uploads" (Allow all, for authenticated & anon)
-- SELECT policy: "Allow public downloads" (Allow all)
-- DELETE policy: "Allow public deletes" (Allow all)
