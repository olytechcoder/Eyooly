"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedImage {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

interface ImageUploaderProps {
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export function ImageUploader({
  onImagesChange,
  maxImages = 6,
}: ImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (files: FileList) => {
      if (images.length >= maxImages) {
        setError(`Máximo ${maxImages} imágenes permitidas`);
        return;
      }

      setUploading(true);
      setError(null);

      try {
        for (let i = 0; i < files.length; i++) {
          if (images.length + i >= maxImages) break;

          const file = files[i];
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch("/api/upload/listing-image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const data = await res.json();
            setError(data.error || "Error al subir imagen");
            continue;
          }

          const uploadedImage: UploadedImage = await res.json();
          setImages((prev) => {
            const updated = [...prev, uploadedImage];
            onImagesChange(updated);
            return updated;
          });
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError("Error al subir imagen. Intenta de nuevo.");
      } finally {
        setUploading(false);
      }
    },
    [images.length, maxImages, onImagesChange]
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  const canUploadMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {canUploadMore && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
            dragActive
              ? "border-terracotta bg-terracotta/5"
              : "border-white/20 bg-white/5 hover:border-white/40"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center gap-3 w-full"
          >
            {uploading ? (
              <Loader className="h-8 w-8 text-terracotta animate-spin" />
            ) : (
              <Upload className="h-8 w-8 text-cream/60" />
            )}
            <div>
              <p className="text-cream font-medium">
                {uploading ? "Subiendo imagen…" : "Arrastra imágenes aquí"}
              </p>
              <p className="text-cream/60 text-sm">
                o haz clic para seleccionar
              </p>
            </div>
            <p className="text-cream/40 text-xs">
              JPG, PNG o WebP • Máximo 5 MB
            </p>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-cream/70 text-sm font-medium">
            {images.length} de {maxImages} imágenes
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group bg-white/5 border border-white/10 rounded-lg overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square">
                  <Image
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Index Badge */}
                <div className="absolute bottom-2 left-2 bg-black/60 text-cream text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Message */}
      {images.length > 0 && (
        <p className="text-cream/60 text-xs">
          Las imágenes se guardarán cuando publiques el anuncio
        </p>
      )}
    </div>
  );
}
