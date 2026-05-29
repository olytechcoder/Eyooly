"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft, MapPin, BadgeCheck, Eye, Calendar, Package,
  Phone, MessageSquare, ChevronLeft, ChevronRight, Loader2,
  CheckCircle2, User
} from "lucide-react";
import { formatPrice, formatDate, formatRelativeDate } from "@/lib/utils";

interface ListingDetail {
  id: number; title: string; description: string | null;
  price: number | null; currency: string; city: string | null;
  address: string | null; imageUrl: string | null; views: number;
  listingType: string; createdAt: string;
  category: { id: number; name: string; icon: string; slug: string } | null;
  images: { id: number; url: string; sortOrder: number }[];
  user: {
    id: string; name: string | null; email: string | null;
    phone: string | null; city: string | null; verified: boolean; createdAt: string;
  } | null;
  _count: { inquiries: number };
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [related, setRelated] = useState<any[]>([]);

  // Inquiry form
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [inquiryState, setInquiryState] = useState<"idle"|"loading"|"success"|"error">("idle");

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
        setListing(data);
        // Fetch related
        if (data.category?.id) {
          fetch(`/api/listings?categoryId=${data.category.id}&limit=4`)
            .then((r) => r.json())
            .then((d) => setRelated((d.items ?? []).filter((l: any) => l.id !== data.id).slice(0, 3)));
        }
      })
      .catch(() => router.push("/marketplace"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    setInquiryState("loading");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, listingId: listing.id }),
      });
      if (res.ok) {
        setInquiryState("success");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setInquiryState("error");
      }
    } catch {
      setInquiryState("error");
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
        </div>
      </PublicLayout>
    );
  }

  if (!listing) return null;

  const allImages = listing.images.length > 0
    ? listing.images.map((i) => i.url)
    : listing.imageUrl ? [listing.imageUrl] : [];

  const currentImg = allImages[imgIndex];

  return (
    <PublicLayout>
      <div className="bg-cream min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-carbon/40 mb-6">
            <Link href="/marketplace" className="hover:text-carbon transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> {t("marketplace.title")}
            </Link>
            {listing.category && (
              <>
                <span>/</span>
                <Link href={`/marketplace?categoryId=${listing.category.id}`}
                  className="hover:text-carbon transition-colors">
                  {listing.category.icon} {listing.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-carbon/70 truncate max-w-[200px]">{listing.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Images + Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery */}
              <div className="bg-white rounded-2xl overflow-hidden border border-carbon/8">
                <div className="relative aspect-[4/3] bg-carbon/5">
                  {currentImg ? (
                    <img src={currentImg} alt={listing.title}
                      className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-carbon/20" />
                    </div>
                  )}
                  {allImages.length > 1 && (
                    <>
                      <button onClick={() => setImgIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors">
                        <ChevronLeft className="h-4 w-4 text-carbon" />
                      </button>
                      <button onClick={() => setImgIndex((i) => (i + 1) % allImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center hover:bg-white transition-colors">
                        <ChevronRight className="h-4 w-4 text-carbon" />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {allImages.map((_, i) => (
                          <button key={i} onClick={() => setImgIndex(i)}
                            className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? "bg-terracotta" : "bg-white/60"}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {allImages.map((url, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          i === imgIndex ? "border-terracotta" : "border-transparent"
                        }`}>
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Listing info */}
              <div className="bg-white rounded-2xl p-6 border border-carbon/8">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-2xl font-display font-bold text-carbon leading-tight">
                    {listing.title}
                  </h1>
                  <div className="text-2xl font-bold text-terracotta shrink-0">
                    {formatPrice(listing.price, listing.currency)}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-4 text-sm text-carbon/50 mb-5 pb-5 border-b border-carbon/8">
                  {listing.city && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-terracotta" /> {listing.city}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(listing.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" /> {listing.views} vistas
                  </span>
                </div>

                {/* Description */}
                {listing.description && (
                  <div>
                    <h2 className="font-semibold text-carbon mb-3">Descripción</h2>
                    <p className="text-carbon/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {listing.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Related listings */}
              {related.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-xl text-carbon mb-4">
                    {t("listing.related")}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {related.map((r) => (
                      <Link key={r.id} href={`/listings/${r.id}`}
                        className="bg-white rounded-xl border border-carbon/8 overflow-hidden card-hover block">
                        <div className="aspect-[4/3] bg-carbon/5 overflow-hidden">
                          {r.imageUrl ? (
                            <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-carbon/20" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-sm font-medium text-carbon line-clamp-2 mb-1">{r.title}</p>
                          <p className="text-terracotta text-sm font-bold">{formatPrice(r.price, r.currency)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Seller + Inquiry */}
            <div className="space-y-5">
              {/* Seller card */}
              {listing.user && (
                <div className="bg-white rounded-2xl p-5 border border-carbon/8">
                  <h3 className="font-semibold text-carbon text-sm mb-4">{t("listing.seller")}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-terracotta/10 text-terracotta font-bold text-lg flex items-center justify-center">
                      {listing.user.name?.[0]?.toUpperCase() ?? <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-carbon text-sm">{listing.user.name ?? "Vendedor"}</span>
                        {listing.user.verified && (
                          <BadgeCheck className="h-4 w-4 text-terracotta" aria-label={t("listing.verified")} />
                        )}
                      </div>
                      {listing.user.verified && (
                        <span className="text-xs text-terracotta">{t("listing.verified")}</span>
                      )}
                      {listing.user.city && (
                        <div className="flex items-center gap-1 text-xs text-carbon/40 mt-0.5">
                          <MapPin className="h-3 w-3" /> {listing.user.city}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-carbon/40 mb-4">
                    Miembro desde {formatDate(listing.user.createdAt)}
                  </p>
                  {listing.user.phone && (
                    <a href={`https://wa.me/${listing.user.phone.replace(/\D/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-sm font-semibold transition-colors btn-press mb-2">
                      <Phone className="h-4 w-4" /> {t("listing.whatsapp")}
                    </a>
                  )}
                </div>
              )}

              {/* Inquiry form */}
              <div className="bg-white rounded-2xl p-5 border border-carbon/8">
                <h3 className="font-semibold text-carbon text-sm mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-terracotta" /> {t("listing.inquiry")}
                </h3>

                {inquiryState === "success" ? (
                  <div className="flex items-center gap-2 text-emerald-600 text-sm py-4">
                    <CheckCircle2 className="h-5 w-5" />
                    ¡Consulta enviada! El vendedor te contactará pronto.
                  </div>
                ) : (
                  <form onSubmit={handleInquiry} className="space-y-3">
                    <input type="text" placeholder="Tu nombre" required value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50" />
                    <input type="email" placeholder="Tu correo" required value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50" />
                    <input type="tel" placeholder="Teléfono (opcional)" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50" />
                    <textarea placeholder="Tu mensaje..." required value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className="w-full px-3.5 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon placeholder-carbon/40 focus:outline-none focus:border-terracotta/50 resize-none" />
                    {inquiryState === "error" && (
                      <p className="text-red-500 text-xs">Error al enviar. Inténtalo de nuevo.</p>
                    )}
                    <button type="submit" disabled={inquiryState === "loading"}
                      className="w-full py-2.5 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-semibold rounded-full text-sm transition-colors btn-press flex items-center justify-center gap-2">
                      {inquiryState === "loading" ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                      ) : (
                        <>{t("listing.inquiry")} <MessageSquare className="h-4 w-4" /></>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
