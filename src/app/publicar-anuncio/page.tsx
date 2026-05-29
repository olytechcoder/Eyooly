"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Upload, ChevronDown } from "lucide-react";

interface Category {
  id: number;
  nameEs: string;
  slug: string;
  icon: string | null;
}

const LISTING_TYPES = [
  { value: "PRODUCT",    label: "Producto" },
  { value: "SERVICE",    label: "Servicio" },
  { value: "CLASSIFIED", label: "Clasificado" },
  { value: "FOOD",       label: "Alimentación" },
  { value: "DELIVERY",   label: "Entrega" },
  { value: "RIDE",       label: "Viaje" },
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
    imageUrl: "",
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

    if (!form.title.trim()) { setError("El título es obligatorio."); return; }
    if (!form.sellerName.trim()) { setError("El nombre del vendedor es obligatorio."); return; }
    if (!form.sellerWhatsapp.trim()) { setError("El número de WhatsApp es obligatorio."); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Error al publicar el anuncio.");
      }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message ?? "Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-carbon mb-2">
            ¡Anuncio enviado!
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Tu anuncio fue enviado y está <strong>pendiente de revisión</strong>. Nuestro equipo lo revisará en las próximas 24 horas. Una vez aprobado, aparecerá en el mercado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/mercado"
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors text-center"
            >
              Ver el mercado
            </Link>
            <button
              onClick={() => {
                setSuccess(false);
                setForm({
                  title: "", description: "", categorySlug: "", listingType: "PRODUCT",
                  price: "", currency: "XAF", city: "", sellerName: "",
                  sellerWhatsapp: "", sellerEmail: "", imageUrl: "",
                });
              }}
              className="flex-1 py-2.5 bg-terracotta text-white text-sm font-semibold rounded-full hover:bg-terracotta/90 transition-colors"
            >
              Publicar otro anuncio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Hero */}
      <div className="bg-carbon py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display font-bold text-3xl text-cream mb-1">
            Publicar anuncio
          </h1>
          <p className="text-cream/50 text-sm">
            Llega a miles de compradores en Guinea Ecuatorial. Gratis y sin registro.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Listing info ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="font-semibold text-carbon text-base border-b border-gray-100 pb-3">
              Información del anuncio
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">
                Título <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ej: iPhone 14 Pro — Como nuevo"
                maxLength={120}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                required
              />
              <p className="text-xs text-gray-400 mt-1">{form.title.length}/120 caracteres</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe tu producto o servicio con detalle: estado, características, condiciones..."
                rows={5}
                maxLength={2000}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none"
              />
            </div>

            {/* Category + Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Categoría</label>
                <div className="relative">
                  <select
                    value={form.categorySlug}
                    onChange={(e) => set("categorySlug", e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.icon} {c.nameEs}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Tipo</label>
                <div className="relative">
                  <select
                    value={form.listingType}
                    onChange={(e) => set("listingType", e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    {LISTING_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Price & location ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="font-semibold text-carbon text-base border-b border-gray-100 pb-3">
              Precio y ubicación
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Precio</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0"
                  min={0}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Moneda</label>
                <div className="relative">
                  <select
                    value={form.currency}
                    onChange={(e) => set("currency", e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                  >
                    {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">Ciudad</label>
              <div className="relative">
                <select
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  <option value="">Seleccionar ciudad...</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </section>

          {/* ── Image ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="font-semibold text-carbon text-base border-b border-gray-100 pb-3">
              Imagen
            </h2>
            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">
                URL de imagen
              </label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl", e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
              <p className="text-xs text-gray-400 mt-1">
                Pega el enlace directo a tu imagen. La subida de archivos estará disponible próximamente.
              </p>
            </div>
            {form.imageUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
          </section>

          {/* ── Seller info ── */}
          <section className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h2 className="font-semibold text-carbon text-base border-b border-gray-100 pb-3">
              Datos del vendedor
            </h2>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.sellerName}
                onChange={(e) => set("sellerName", e.target.value)}
                placeholder="Tu nombre o nombre del negocio"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">
                WhatsApp <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.sellerWhatsapp}
                onChange={(e) => set("sellerWhatsapp", e.target.value)}
                placeholder="+240 222 123 456"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Los compradores te contactarán directamente por WhatsApp.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">
                Correo electrónico <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={form.sellerEmail}
                onChange={(e) => set("sellerEmail", e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pb-8">
            <Link
              href="/mercado"
              className="flex-1 py-3 border border-gray-200 text-gray-500 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors text-center"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-bold rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Publicar anuncio"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
