"use client";

import { useCallback, useRef } from "react";
import { Camera, X, Image as ImageIcon, Images } from "lucide-react";

interface PhotoPickerProps {
  onPhotosSelect: (files: File[]) => void;
  previews: string[];
  onRemove: (index: number) => void;
  onClearAll: () => void;
  disabled?: boolean;
}

export default function PhotoPicker({
  onPhotosSelect,
  previews,
  onRemove,
  onClearAll,
  disabled = false,
}: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const validFiles: File[] = [];
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        if (!file.type.startsWith("image/")) continue;
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} ukuran melebihi 5MB, dilewati`);
          continue;
        }
        if (previews.length + validFiles.length >= 5) {
          alert("Maksimal 5 foto");
          break;
        }
        validFiles.push(file);
      }
      if (validFiles.length > 0) {
        onPhotosSelect(validFiles);
      }
    },
    [onPhotosSelect, previews.length]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (previews.length > 0) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {previews.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 animate-scale-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Foto ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <button
                  onClick={() => onRemove(idx)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <ImageIcon size={10} />
                {idx + 1}/{previews.length}
              </div>
            </div>
          ))}
        </div>

        {!disabled && previews.length < 5 && (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-ig-border rounded-xl py-3 text-sm text-ig-text-secondary hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Images size={16} />
            Tambah Foto ({previews.length}/5)
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        {previews.length > 1 && !disabled && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Hapus semua foto
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`photo-picker-area aspect-video rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
        <Camera size={28} className="text-ig-text-secondary" />
      </div>

      <p className="text-sm font-medium text-ig-text">Tambah Foto Produk</p>
      <p className="text-xs text-ig-text-secondary mt-1">
        Klik atau seret foto ke sini (max 5)
      </p>
      <p className="text-[10px] text-ig-text-secondary mt-2">
        JPEG, PNG, WebP, GIF (Maks. 5MB per foto)
      </p>
    </div>
  );
}
