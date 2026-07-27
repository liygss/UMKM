"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import PhotoPicker from "./PhotoPicker";

const KATEGORI_LIST = [
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

interface FormData {
  nama_umkm: string;
  nama_produk: string;
  deskripsi: string;
  harga: string;
  kategori: string;
  kontak: string;
  lokasi: string;
}

interface UploadProgress {
  stage: "idle" | "uploading" | "saving" | "done" | "error";
  percent: number;
}

export default function UploadForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [form, setForm] = useState<FormData>({
    nama_umkm: "",
    nama_produk: "",
    deskripsi: "",
    harga: "",
    kategori: "Makanan",
    kontak: "",
    lokasi: "",
  });
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    stage: "idle",
    percent: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");

  const handlePhotosSelect = (files: File[]) => {
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...files].slice(0, 5));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllPhotos = () => {
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPhotos([]);
    setPreviews([]);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (photos.length === 0) newErrors.photo = "Minimal 1 foto produk wajib diunggah";
    if (!form.nama_umkm.trim()) newErrors.nama_umkm = "Nama UMKM wajib diisi";
    if (!form.nama_produk.trim()) newErrors.nama_produk = "Nama produk wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || photos.length === 0) return;

    try {
      setUploadProgress({ stage: "uploading", percent: 20 });

      const formData = new FormData();
      photos.forEach((file) => formData.append("files", file));
      formData.append("nama_umkm", form.nama_umkm.trim());
      formData.append("nama_produk", form.nama_produk.trim());
      formData.append("deskripsi", form.deskripsi.trim());
      formData.append("harga", form.harga);
      formData.append("kategori", form.kategori);
      formData.append("kontak", form.kontak.trim());
      formData.append("lokasi", form.lokasi.trim());

      setUploadProgress({ stage: "uploading", percent: 50 });

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Upload gagal");
      }

      setUploadProgress({ stage: "done", percent: 100 });

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setServerError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setUploadProgress({ stage: "error", percent: 0 });
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  if (uploadProgress.stage === "done") {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h3 className="text-lg font-bold">Berhasil Diunggah!</h3>
        <p className="text-sm text-ig-text-secondary mt-1">
          Foto produk UMKM kamu sudah tampil di galeri
        </p>
      </div>
    );
  }

  if (uploadProgress.stage === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <h3 className="text-lg font-bold">Gagal Mengunggah</h3>
        <p className="text-sm text-ig-text-secondary mt-1 mb-4">
          {serverError || "Terjadi kesalahan, silakan coba lagi"}
        </p>
        <button
          onClick={() => setUploadProgress({ stage: "idle", percent: 0 })}
          className="px-6 py-2 bg-ig-primary text-white rounded-lg text-sm font-semibold hover:bg-ig-primary-hover transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo Picker */}
      <div>
        <PhotoPicker
          onPhotosSelect={handlePhotosSelect}
          previews={previews}
          onRemove={removePhoto}
          onClearAll={clearAllPhotos}
          disabled={uploadProgress.stage !== "idle"}
        />
        {errors.photo && (
          <p className="text-red-500 text-xs mt-1">{errors.photo}</p>
        )}
      </div>

      {/* Upload Progress */}
      {(uploadProgress.stage === "uploading" ||
        uploadProgress.stage === "saving") && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-ig-text-secondary">
            <Loader2 size={16} className="animate-spin" />
            <span>
              {uploadProgress.stage === "uploading"
                ? `Mengunggah ${photos.length} foto...`
                : "Menyimpan data..."}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full ig-gradient rounded-full progress-bar"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Nama UMKM */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Nama UMKM <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Roti Enak Bu Sari"
            value={form.nama_umkm}
            onChange={(e) => updateField("nama_umkm", e.target.value)}
            className={`w-full border ${
              errors.nama_umkm ? "border-red-500" : "border-ig-border"
            } rounded-xl px-4 py-3 text-sm`}
            disabled={uploadProgress.stage !== "idle"}
          />
          {errors.nama_umkm && (
            <p className="text-red-500 text-xs mt-1">{errors.nama_umkm}</p>
          )}
        </div>

        {/* Nama Produk */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Roti Cokelat Premium"
            value={form.nama_produk}
            onChange={(e) => updateField("nama_produk", e.target.value)}
            className={`w-full border ${
              errors.nama_produk ? "border-red-500" : "border-ig-border"
            } rounded-xl px-4 py-3 text-sm`}
            disabled={uploadProgress.stage !== "idle"}
          />
          {errors.nama_produk && (
            <p className="text-red-500 text-xs mt-1">{errors.nama_produk}</p>
          )}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Deskripsi</label>
          <textarea
            placeholder="Ceritakan tentang produkmu..."
            value={form.deskripsi}
            onChange={(e) => updateField("deskripsi", e.target.value)}
            rows={3}
            className="w-full border border-ig-border rounded-xl px-4 py-3 text-sm resize-none"
            disabled={uploadProgress.stage !== "idle"}
          />
        </div>

        {/* Harga + Kategori row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Harga (Rp)</label>
            <input
              type="number"
              placeholder="0"
              min="0"
              value={form.harga}
              onChange={(e) => updateField("harga", e.target.value)}
              className="w-full border border-ig-border rounded-xl px-4 py-3 text-sm"
              disabled={uploadProgress.stage !== "idle"}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Kategori</label>
            <select
              value={form.kategori}
              onChange={(e) => updateField("kategori", e.target.value)}
              className="w-full border border-ig-border rounded-xl px-4 py-3 text-sm bg-white"
              disabled={uploadProgress.stage !== "idle"}
            >
              {KATEGORI_LIST.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Lokasi</label>
          <input
            type="text"
            placeholder="Contoh: Jl. Merdeka No. 10, Bandung"
            value={form.lokasi}
            onChange={(e) => updateField("lokasi", e.target.value)}
            className="w-full border border-ig-border rounded-xl px-4 py-3 text-sm"
            disabled={uploadProgress.stage !== "idle"}
          />
        </div>

        {/* Kontak */}
        <div>
          <label className="block text-sm font-semibold mb-1.5">Kontak (HP/WA)</label>
          <input
            type="text"
            placeholder="Contoh: 081234567890"
            value={form.kontak}
            onChange={(e) => updateField("kontak", e.target.value)}
            className="w-full border border-ig-border rounded-xl px-4 py-3 text-sm"
            disabled={uploadProgress.stage !== "idle"}
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={uploadProgress.stage !== "idle"}
        className="w-full py-3.5 ig-gradient text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {uploadProgress.stage === "idle" ? (
          <>
            <Send size={18} />
            Unggah Produk
          </>
        ) : (
          <>
            <Loader2 size={18} className="animate-spin" />
            Memproses...
          </>
        )}
      </button>
    </form>
  );
}
