"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Tag,
  ChevronLeft,
  MessageCircle,
  Flag,
  BadgeCheck,
  Share2,
  Clock,
  Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ListingDetail {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  price: string | null;
  currency: string;
  city: string | null;
  address: string | null;
  listingType: string;
  status: string;
  featured: boolean;
  views: number;
  imageUrl: string | null;
  sellerName: string | null;
  sellerWhatsapp: string | null;
  sellerEmail: string | null;
  createdAt: string;
  category: { nameEs: string; icon: string | null; color: string | null } | null;
  images: { id: number; url: string; sortOrder: number }[];
  user: { verified: boolean; name: string | null } | null;
}

// ─── WhatsApp helper ──────────────────────────────────────────────────────────

function buildWhatsAppUrl(phone: string, listingTitle: string): string {
  const clean = phone.replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Hola, vi tu anuncio en Eyooly: "${listingTitle}". ¿Sigue disponible?`
  );
  return `https://wa.me/${clean}?text=${msg}`;
}

// ─── Report modal ─────────────────────────────────────────────────────────────

function ReportModal({
  listingId,
  onClose,
}: {
  listingId: number;
  onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Reporte de anuncio",
          email: "report@eyooly.com",
          subject: `Reporte de anuncio #${listingId}`,
          message: reason,
        }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold text-carbon text-lg mb-1">Reporte enviado</h3>
            <p className="text-gray-500 text-sm mb-4">
              Gracias. Nuestro equipo revisará este anuncio.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-terracotta text-white text-sm font-medium rounded-full hover:bg-terracotta/90 transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-carbon text-lg mb-1">Reportar anuncio</h3>
            <p className="text-gray-500 text-sm mb-4">
              Describe el problema con este anuncio.
            </p>
            <form onSubmit={submit} className="space-y-3">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Anuncio fraudulento, contenido inapropiado, precio engañoso..."
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-red-500 text-white text-sm font-medium rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar reporte"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/listings/${slug}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) setListing(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  function share() {
    if (navigator.share) {
      navigator.share({ title: listing?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-terracotta border-t-transparent" />
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center text-center px-4">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="font-display font-bold text-2xl text-carbon mb-2">Anuncio no encontrado</h1>
        <p className="text-gray-400 text-sm mb-6">Este anuncio ya no está disponible o fue eliminado.</p>
        <Link href="/mercado" className="px-5 py-2.5 bg-terracotta text-white text-sm font-semibold rounded-full hover:bg-terracotta/90 transition-colors">
          ← Volver al mercado
        </Link>
      </div>
    );
  }

  // Build image gallery: primary + extra images
  const allImages: string[] = [];
  if (listing.imageUrl) allImages.push(listing.imageUrl);
  listing.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .forEach((img) => { if (!allImages.includes(img.url)) allImages.push(img.url); });
  if (allImages.length === 0) allImages.push(""); // placeholder

  const price = listing.price
    ? new Intl.NumberFormat("es-GQ", { style: "decimal", maximumFractionDigits: 0 }).format(
        Number(listing.price)
      ) + " " + listing.currency
    : "Precio a consultar";

  const whatsappUrl = listing.sellerWhatsapp
    ? buildWhatsAppUrl(listing.sellerWhatsapp, listing.title)
    : null;

  const formattedDate = new Date(listing.createdAt).toLocaleDateString("es-GQ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {showReport && (
        <ReportModal listingId={listing.id} onClose={() => setShowReport(false)} />
      )}

      <div className="min-h-screen bg-[#faf9f7]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-terracotta transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Volver
            </button>
            <span>/</span>
            <Link href="/mercado" className="hover:text-terracotta transition-colors">Mercado</Link>
            <span>/</span>
            <span className="text-carbon truncate max-w-[200px]">{listing.title}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Left: Images ── */}
            <div className="lg:col-span-3 space-y-3">
              {/* Main image */}
              <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
                {allImages[activeImage] ? (
                  <Image
                    src={allImages[activeImage]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Tag className="h-16 w-16 text-gray-300" />
                  </div>
                )}
                {listing.featured && (
                  <span className="absolute top-3 left-3 bg-terracotta text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Destacado
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImage === i ? "border-terracotta" : "border-transparent"
                      }`}
                    >
                      {img ? (
                        <Image src={img} alt={`Imagen ${i + 1}`} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="w-full h-full bg-gray-100" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h2 className="font-semibold text-carbon text-base mb-3">Descripción</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {listing.description ?? "Sin descripción."}
                </p>
              </div>
            </div>

            {/* ── Right: Info & actions ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Title card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                {listing.category && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full mb-3">
                    {listing.category.icon} {listing.category.nameEs}
                  </span>
                )}
                <h1 className="font-display font-bold text-xl text-carbon leading-snug mb-3">
                  {listing.title}
                </h1>
                <p className="text-terracotta font-bold text-2xl mb-4">{price}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  {listing.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-terracotta shrink-0" />
                      {listing.city}{listing.address ? `, ${listing.address}` : ""}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-300 shrink-0" />
                    Publicado el {formattedDate}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-300 shrink-0" />
                    {listing.views} vista{listing.views !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Seller card */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Vendedor</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-bold text-sm">
                    {(listing.sellerName ?? listing.user?.name ?? "V")[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-carbon text-sm">
                        {listing.sellerName ?? listing.user?.name ?? "Vendedor"}
                      </span>
                      {listing.user?.verified && (
                        <BadgeCheck className="h-4 w-4 text-terracotta" aria-label="Vendedor verificado" />
                      )}
                    </div>
                    {listing.user?.verified && (
                      <span className="text-xs text-terracotta">Vendedor verificado</span>
                    )}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold text-sm rounded-xl transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contactar por WhatsApp
                  </a>
                ) : (
                  <div className="text-center text-sm text-gray-400 py-2">
                    Sin contacto disponible
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={share}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  {copied ? "¡Enlace copiado!" : "Compartir"}
                </button>
                <button
                  onClick={() => setShowReport(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-gray-500 text-sm font-medium rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <Flag className="h-4 w-4" />
                  Reportar
                </button>
              </div>

              {/* Safety note */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700 leading-relaxed">
                <strong>Consejo de seguridad:</strong> Nunca pagues antes de ver el producto en persona. Eyooly no gestiona pagos ni garantiza transacciones entre particulares.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
