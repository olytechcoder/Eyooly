"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Upload, X, Loader2, CheckCircle2, ImagePlus, ArrowLeft, Lock
} from "lucide-react";

interface Category { id: number; name: string; icon: string; }

const CITIES = ["Malabo", "Bata", "Ebebiyín", "Aconibe", "Mongomo", "Evinayong", "Otra"];
const LISTING_TYPES = [
  { value: "PRODUCT",    label: "Producto" },
  { value: "SERVICE",    label: "Servicio" },
  { value: "CLASSIFIED", label: "Clasificado" },
  { value: "FOOD",       label: "Comida" },
];

export default function CreateListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", price: "", currency: "XAF",
    city: "", address: "", categoryId: "", listingType: "PRODUCT",
  });
  const [images, setImages] = useState<{ file: File; preview: string; uploading: boolean; url: string | null }[]>([]);
  const [submitState, setSubmitState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  // Auth gate
  if (status === "loading") {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
        </div>
      </PublicLayout>
    );
  }

  if (!session) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-cream flex items-center justify-center pt-16 px-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl p-8 border border-carbon/8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-5">
              <Lock className="h-7 w-7 text-terracotta" />
            </div>
            <h2 className="text-xl font-bold text-carbon mb-3">{t("create.login_required")}</h2>
            <p className="text-carbon/60 text-sm mb-6">
              Debes iniciar sesión para publicar un anuncio en Eyooly.
            </p>
            <Link href="/auth/signin?callbackUrl=/listings/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press text-sm">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  const handleImageSelect = async (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - images.length);

    const newImages = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      url: null as string | null,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Upload each image
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        setImages((prev) =>
          prev.map((img) =>
            img.file === file ? { ...img, uploading: false, url: data.url } : img
          )
        );
      } catch {
        setImages((prev) => prev.filter((img) => img.file !== file));
      }
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");
    setErrorMsg("");

    const imageUrls = images.filter((i) => i.url).map((i) => i.url as string);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:       form.title,
          description: form.description || undefined,
          price:       form.price ? parseFloat(form.price) : undefined,
          currency:    form.currency,
          city:        form.city || undefined,
          address:     form.address || undefined,
          categoryId:  form.categoryId ? parseInt(form.categoryId) : undefined,
          listingType: form.listingType,
          imageUrl:    imageUrls[0],
          imageUrls,
        }),
      });

      if (res.ok) {
        setSubmitState("success");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Error al publicar el anuncio");
        setSubmitState("error");
      }
    } catch {
      setErrorMsg("Error inesperado. Inténtalo de nuevo.");
      setSubmitState("error");
    }
  };

  if (submitState === "success") {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-cream flex items-center justify-center pt-16 px-4">
          <div className="max-w-md w-full text-center bg-white rounded-2xl p-8 border border-carbon/8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-carbon mb-3">¡Anuncio enviado!</h2>
            <p className="text-carbon/60 text-sm mb-2">{t("create.success")}</p>
            <p className="text-carbon/40 text-xs">Redirigiendo a tu cuenta...</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-cream min-h-screen pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <Link href="/marketplace"
            className="inline-flex items-center gap-2 text-sm text-carbon/50 hover:text-carbon mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al mercado
          </Link>

          <div className="bg-white rounded-2xl border border-carbon/8 p-6 sm:p-8 shadow-sm">
            <h1 className="text-2xl font-display font-bold text-carbon mb-1">{t("create.title")}</h1>
            <p className="text-carbon/50 text-sm mb-6">
              Tu anuncio será revisado antes de publicarse.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">
                  Título <span className="text-terracotta">*</span>
                </label>
                <input type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ej: iPhone 14 Pro — Como nuevo"
                  maxLength={200}
                  className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50 transition-colors" />
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-carbon mb-1.5">Tipo</label>
                  <select value={form.listingType}
                    onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                    className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50">
                    {LISTING_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-carbon mb-1.5">Categoría</label>
                  <select value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50">
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-carbon mb-1.5">Precio</label>
                  <input type="number" min="0" step="100" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-carbon mb-1.5">Moneda</label>
                  <select value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50">
                    <option value="XAF">XAF (Franc CFA)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dólar)</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-carbon mb-1.5">Ciudad</label>
                  <select value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50">
                    <option value="">Seleccionar...</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-carbon mb-1.5">Dirección</label>
                  <input type="text" value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Barrio, calle..."
                    className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Descripción</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe tu producto o servicio con detalle..."
                  rows={5} maxLength={5000}
                  className="w-full px-4 py-3 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50 resize-none" />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">
                  Imágenes <span className="text-carbon/40 font-normal">(máx. 10)</span>
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-carbon/5 border border-carbon/10">
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                      {img.uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-white" />
                        </div>
                      )}
                      {i === 0 && !img.uploading && (
                        <span className="absolute bottom-1 left-1 text-[10px] bg-terracotta text-white px-1.5 py-0.5 rounded-full">
                          Principal
                        </span>
                      )}
                      <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors">
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}

                  {images.length < 10 && (
                    <button type="button" onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-carbon/20 hover:border-terracotta/40 flex flex-col items-center justify-center gap-1 transition-colors group">
                      <ImagePlus className="h-6 w-6 text-carbon/30 group-hover:text-terracotta/60 transition-colors" />
                      <span className="text-[10px] text-carbon/30">Añadir</span>
                    </button>
                  )}
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" multiple
                  className="hidden"
                  onChange={(e) => handleImageSelect(e.target.files)} />
                <p className="text-xs text-carbon/40 mt-2">
                  Formatos: JPEG, PNG, WebP. Máximo 5 MB por imagen.
                </p>
              </div>

              {errorMsg && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {errorMsg}
                </p>
              )}

              <button type="submit" disabled={submitState === "loading" || images.some((i) => i.uploading)}
                className="w-full py-3.5 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors btn-press flex items-center justify-center gap-2">
                {submitState === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Publicando...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Publicar anuncio</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
