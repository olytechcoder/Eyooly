"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, ChevronDown } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";

interface Category {
  id: number;
  nameEs: string;
  slug: string;
  icon: string | null;
}

interface UploadedImage {
  url: string;
  pathname: string;
  contentType: string;
  size: number;
}

const LISTING_TYPES = [
  { value: "PRODUCT", label: "Producto" },
  { value: "SERVICE", label: "Servicio" },
  { value: "CLASSIFIED", label: "Clasificado" },
  { value: "FOOD", label: "Alimentación" },
  { value: "DELIVERY", label: "Entrega" },
  { value: "RIDE", label: "Viaje" },
];

const CITIES = [
  "Malabo", "Bata", "Ebebiyín", "Aconibe", "Añisoc",
  "Luba", "Evinayong", "Mongomo", "Mikomeseng", "Otra",
];

const CURRENCIES = ["XAF", "USD", "EUR"];

export default function PublicarAnuncioPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    categorySlug: "",
    listingType: "PRODUCT",
    price: "",
    currency: "XAF",
    city: "",
    sellerName: "",
    sellerWhatsapp: "",
    sellerEmail: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!form.sellerName.trim()) {
      setError("El nombre del vendedor es obligatorio.");
      return;
    }
    if (!form.sellerWhatsapp.trim()) {
      setError("El número de WhatsApp es obligatorio.");
      return;
    }
    if (images.length === 0) {
      setError("Debes subir al menos una imagen.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
          images: images.map((img) => ({
            url: img.url,
            pathname: img.pathname,
            contentType: img.contentType,
            size: img.size,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Error al publicar anuncio");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/mercado";
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Error al publicar anuncio. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cream mb-2">¡Anuncio publicado!</h2>
          <p className="text-cream/60 mb-6">
            Tu anuncio está pendiente de aprobación. Te redirigiremos al mercado...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-carbon pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-cream mb-2">Publicar anuncio</h1>
        <p className="text-cream/60 mb-8">
          Completa el formulario para crear tu anuncio. Será revisado por nuestro equipo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Ej: iPhone 14 Pro en excelente estado"
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe tu producto o servicio..."
              rows={4}
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Imágenes *
            </label>
            <ImageUploader onImagesChange={setImages} maxImages={6} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Categoría
            </label>
            <div className="relative">
              <select
                value={form.categorySlug}
                onChange={(e) => set("categorySlug", e.target.value)}
                className="w-full appearance-none px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream focus:outline-none focus:ring-2 focus:ring-terracotta/60"
              >
                <option value="">Selecciona una categoría</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.icon} {c.nameEs}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40 pointer-events-none" />
            </div>
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Tipo de anuncio
            </label>
            <div className="relative">
              <select
                value={form.listingType}
                onChange={(e) => set("listingType", e.target.value)}
                className="w-full appearance-none px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream focus:outline-none focus:ring-2 focus:ring-terracotta/60"
              >
                {LISTING_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40 pointer-events-none" />
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-2">
                Precio
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cream/70 mb-2">
                Moneda
              </label>
              <div className="relative">
                <select
                  value={form.currency}
                  onChange={(e) => set("currency", e.target.value)}
                  className="w-full appearance-none px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream focus:outline-none focus:ring-2 focus:ring-terracotta/60"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Ciudad
            </label>
            <div className="relative">
              <select
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="w-full appearance-none px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream focus:outline-none focus:ring-2 focus:ring-terracotta/60"
              >
                <option value="">Selecciona una ciudad</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/40 pointer-events-none" />
            </div>
          </div>

          {/* Seller Info */}
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Tu nombre *
            </label>
            <input
              type="text"
              value={form.sellerName}
              onChange={(e) => set("sellerName", e.target.value)}
              placeholder="Ej: Juan García"
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              WhatsApp *
            </label>
            <input
              type="tel"
              value={form.sellerWhatsapp}
              onChange={(e) => set("sellerWhatsapp", e.target.value)}
              placeholder="+240222123456"
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Email (opcional)
            </label>
            <input
              type="email"
              value={form.sellerEmail}
              onChange={(e) => set("sellerEmail", e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-terracotta hover:bg-terracotta/90 disabled:bg-terracotta/50 text-white font-semibold rounded-lg transition-colors"
          >
            {loading ? "Publicando..." : "Publicar anuncio"}
          </button>

          <p className="text-cream/60 text-xs text-center">
            Al publicar, aceptas nuestros{" "}
            <Link href="/terms" className="text-terracotta hover:underline">
              términos de servicio
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
