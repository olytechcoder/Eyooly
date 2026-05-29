"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, SlidersHorizontal, MapPin, BadgeCheck, Loader2, Package } from "lucide-react";
import { formatPrice, formatRelativeDate } from "@/lib/utils";

interface Category {
  id: number; name: string; slug: string; icon: string;
  _count: { listings: number };
}

interface Listing {
  id: number; title: string; price: number | null; currency: string;
  city: string | null; imageUrl: string | null; createdAt: string;
  category: { id: number; name: string; icon: string } | null;
  images: { url: string }[];
  user: { id: string; name: string | null; verified: boolean } | null;
}

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState("");

  const CITIES = ["Malabo", "Bata", "Ebebiyín", "Aconibe", "Mongomo", "Evinayong"];

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (search)           params.set("search", search);
      if (selectedCategory) params.set("categoryId", String(selectedCategory));
      if (selectedCity)     params.set("city", selectedCity);

      const res  = await fetch(`/api/listings?${params}`);
      const data = await res.json();
      setListings(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedCategory, selectedCity]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryClick = (id: number | null) => {
    setSelectedCategory(id);
    setPage(1);
  };

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-carbon pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-cream mb-2">{t("marketplace.title")}</h1>
          <p className="text-cream/50 mb-6">{t("marketplace.subtitle")}</p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/30" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t("marketplace.search")}
                className="w-full pl-11 pr-4 py-3 bg-white/6 border border-white/10 rounded-full text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50 text-sm"
              />
            </div>
            <button type="submit"
              className="px-5 py-3 bg-terracotta hover:bg-terracotta/90 text-white rounded-full text-sm font-semibold transition-colors btn-press">
              Buscar
            </button>
          </form>
        </div>
      </div>

      <div className="bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters */}
            <aside className="lg:w-56 shrink-0">
              <div className="bg-white rounded-2xl border border-carbon/8 p-5 sticky top-24">
                <h3 className="font-semibold text-carbon text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filtros
                </h3>

                {/* Categories */}
                <div className="mb-5">
                  <p className="text-carbon/50 text-xs font-medium mb-2">Categoría</p>
                  <button
                    onClick={() => handleCategoryClick(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                      !selectedCategory ? "bg-terracotta text-white" : "text-carbon/70 hover:bg-carbon/5"
                    }`}>
                    {t("marketplace.all")} ({total})
                  </button>
                  {categories.map((cat) => (
                    <button key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors flex items-center justify-between ${
                        selectedCategory === cat.id ? "bg-terracotta text-white" : "text-carbon/70 hover:bg-carbon/5"
                      }`}>
                      <span>{cat.icon} {cat.name}</span>
                      <span className="text-xs opacity-60">{cat._count.listings}</span>
                    </button>
                  ))}
                </div>

                {/* City filter */}
                <div>
                  <p className="text-carbon/50 text-xs font-medium mb-2">Ciudad</p>
                  <select
                    value={selectedCity}
                    onChange={(e) => { setSelectedCity(e.target.value); setPage(1); }}
                    className="w-full px-3 py-2 bg-carbon/5 border border-carbon/10 rounded-lg text-sm text-carbon focus:outline-none focus:border-terracotta/50">
                    <option value="">Todas las ciudades</option>
                    {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </aside>

            {/* Listings grid */}
            <div className="flex-1">
              {/* Results count */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-carbon/60 text-sm">
                  {loading ? "Cargando..." : `${total} anuncios encontrados`}
                </p>
                <Link href="/listings/new"
                  className="px-4 py-2 bg-terracotta text-white text-sm font-semibold rounded-full hover:bg-terracotta/90 transition-colors btn-press">
                  + Publicar
                </Link>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
                </div>
              ) : listings.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="h-12 w-12 text-carbon/20 mx-auto mb-4" />
                  <h3 className="font-semibold text-carbon mb-2">{t("marketplace.empty")}</h3>
                  <p className="text-carbon/50 text-sm">{t("marketplace.empty.desc")}</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {listings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-10">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-terracotta text-white"
                              : "bg-white border border-carbon/10 text-carbon/60 hover:border-terracotta/40"
                          }`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

function ListingCard({ listing }: { listing: Listing }) {
  const imgSrc = listing.images[0]?.url ?? listing.imageUrl ?? null;

  return (
    <Link href={`/listings/${listing.id}`}
      className="group bg-white rounded-2xl border border-carbon/8 overflow-hidden card-hover block">
      {/* Image */}
      <div className="aspect-[4/3] bg-carbon/5 overflow-hidden relative">
        {imgSrc ? (
          <img src={imgSrc} alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-10 w-10 text-carbon/20" />
          </div>
        )}
        {listing.category && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-carbon">
            {listing.category.icon} {listing.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-carbon text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-terracotta transition-colors">
          {listing.title}
        </h3>

        {/* Price */}
        <div className="text-terracotta font-bold text-base mb-2">
          {formatPrice(listing.price, listing.currency)}
        </div>

        {/* Seller & Location */}
        <div className="flex items-center justify-between text-xs text-carbon/40">
          <div className="flex items-center gap-1">
            {listing.user?.name && (
              <>
                <span className="truncate max-w-[100px]">{listing.user.name}</span>
                {listing.user.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-terracotta shrink-0" />
                )}
              </>
            )}
          </div>
          {listing.city && (
            <div className="flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              <span>{listing.city}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-carbon/30 mt-1.5">
          {formatRelativeDate(listing.createdAt)}
        </div>
      </div>
    </Link>
  );
}
