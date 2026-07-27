import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nama_umkm = formData.get("nama_umkm") as string;
    const nama_produk = formData.get("nama_produk") as string;
    const deskripsi = formData.get("deskripsi") as string;
    const harga = formData.get("harga") as string;
    const kategori = formData.get("kategori") as string;
    const kontak = formData.get("kontak") as string;
    const lokasi = formData.get("lokasi") as string;

    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === "files" && value instanceof File) {
        files.push(value);
      }
    }

    if (!files.length || !nama_umkm || !nama_produk) {
      return NextResponse.json(
        { error: "Minimal 1 foto, nama UMKM, dan nama produk wajib diisi" },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: "Maksimal 5 foto per postingan" },
        { status: 400 }
      );
    }

    const photoUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${i}.${fileExt}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const { error: uploadError } = await supabase.storage
        .from("umkm-photos")
        .upload(fileName, fileBuffer, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("umkm-photos").getPublicUrl(fileName);

      photoUrls.push(publicUrl);
    }

    const { data: postData, error: dbError } = await supabase
      .from("umkm_posts")
      .insert({
        nama_umkm,
        nama_produk,
        deskripsi: deskripsi || "",
        harga: harga ? parseFloat(harga) : 0,
        foto_url: photoUrls[0],
        kategori: kategori || "Umum",
        kontak: kontak || "",
        lokasi: lokasi || "",
      })
      .select("id")
      .single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    const photoRows = photoUrls.map((url, index) => ({
      post_id: postData.id,
      foto_url: url,
      order_index: index,
    }));

    const { error: photosError } = await supabase
      .from("umkm_photos")
      .insert(photoRows);

    if (photosError) {
      return NextResponse.json({ error: photosError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, urls: photoUrls });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
