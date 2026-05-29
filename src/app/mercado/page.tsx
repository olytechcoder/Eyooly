"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, X, MapPin, Tag, ChevronDown, BadgeCheck } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  nameEs: string;
  slug: string;
  icon: string | null;
}

interface Listing {
  id: number;
  slug: string;
  title: string;
  price: string | null;
  currency: string;
  city: string | null;
  listingType: string;
  imageUrl: string | null;
  sellerName: string | null;
  featured: boolean;
  user?: { verified: boolean } | null;
  category?: { nameEs: string; icon: string | null } | null;
  createdAt: string;
}

const CITIES = ["Malabo", "Bata", "Ebebiyín", "Aconibe", "Añisoc", "Luba", "Evinayong"];

const LISTING_TYPES: { value: string; label: string }[] = [
  { value: "", label: "Todos los tipos" },
  { value: "PRODUCT", label: "Producto" },
  { value: "SERVICE", label: "Servicio" },
  { value: "CLASSIFIED", label: "Clasificado" },
  { value: "FOOD", label: "Alimentación" },
  { value: "DELIVERY", label: "Entrega" },
  { value: "RIDE", label: "Viaje" },
];

// ─── Listing Card ─────────────────────────────────────────────────────────────

function ListingCard({ listing }: { listing: Listing }) {
  const price = listing.price
    ? new Intl.NumberFormat("es-GQ", { style: "decimal", maximumFractionDigits: 0 }).format(
        Number(listing.price)
      ) + " " + listing.currency
    : "Precio a consultar";

  return (
    <Link
      href={`/mercado/${listing.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <Tag className="h-10 w-10 text-gray-300" />
          </div>
        )}
        {listing.featured && (
          <span className="absolute top-2 left-2 bg-terracotta text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Destacado
          </span>
        )}
        {listing.category && (
          <span className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full">
            {listing.category.icon} {listing.category.nameEs}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-carbon text-sm leading-snug line-clamp-2 mb-1 group-hover:text-terracotta transition-colors">
          {listing.title}
        </h3>
        <p className="text-terracotta font-bold text-base mb-2">{price}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.city ?? "Guinea Ecuatorial"}
          </span>
          <span className="flex items-center gap-1">
            {listing.sellerName ?? "Vendedor"}
            {listing.user?.verified && (
              <BadgeCheck className="h-3.5 w-3.5 text-terracotta" aria-label="Vendedor verificado" />
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MercadoPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (city) params.set("city", city);
      if (type) params.set("type", type);
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      params.set("status", "APPROVED");

      const res = await fetch(`/api/listings?${params.toString()}`);
      const data = await res.json();
      setListings(data.listings ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, city, type, minPrice, maxPrice]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const hasFilters = !!(search || category || city || type || minPrice || maxPrice);

  function clearFilters() {
    setSearch("");
    setCategory("");
    setCity("");
    setType("");
    setMinPrice("");
    setMaxPrice("");
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* ── Hero bar ── */}
      <div className="bg-carbon py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-cream mb-2">
            Mercado Eyooly
          </h1>
          <p className="text-cream/50 text-sm sm:text-base mb-6">
            Compra, vende y descubre productos y servicios locales en Guinea Ecuatorial.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar productos, servicios, anuncios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl text-sm text-carbon placeholder:text-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-terracotta text-white"
                  : "bg-white/10 text-cream hover:bg-white/20"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
              {hasFilters && (
                <span className="w-2 h-2 rounded-full bg-terracotta inline-block sm:hidden" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Category */}
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.icon} {c.nameEs}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* City */}
              <div className="relative">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  <option value="">Todas las ciudades</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Type */}
              <div className="relative">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
                >
                  {LISTING_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Price min */}
              <input
                type="number"
                placeholder="Precio mín (XAF)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />

              {/* Price max */}
              <input
                type="number"
                placeholder="Precio máx (XAF)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="pl-3 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 hover:text-terracotta transition-colors"
              >
                <X className="h-3.5 w-3.5" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {loading ? "Buscando..." : `${total} anuncio${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>
          <Link
            href="/publicar-anuncio"
            className="flex items-center gap-2 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-semibold rounded-full transition-colors"
          >
            + Publicar anuncio
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-semibold text-carbon text-lg mb-2">No se encontraron anuncios</h3>
            <p className="text-gray-400 text-sm mb-6">
              Prueba con otros términos de búsqueda o ajusta los filtros.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="px-5 py-2.5 bg-terracotta text-white text-sm font-medium rounded-full hover:bg-terracotta/90 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
