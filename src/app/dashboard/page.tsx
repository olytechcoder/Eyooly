"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PublicLayout from "@/components/layout/PublicLayout";
import {
  Package, MessageSquare, Truck, Car, Plus, Loader2,
  BadgeCheck, MapPin, Eye, Clock, CheckCircle2, XCircle, AlertCircle
} from "lucide-react";
import { formatPrice, formatRelativeDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING:     { label: "Pendiente",   className: "status-pending" },
  APPROVED:    { label: "Aprobado",    className: "status-approved" },
  REJECTED:    { label: "Rechazado",   className: "status-rejected" },
  ACCEPTED:    { label: "Aceptado",    className: "status-active" },
  IN_PROGRESS: { label: "En camino",   className: "status-active" },
  COMPLETED:   { label: "Completado",  className: "status-completed" },
  CANCELLED:   { label: "Cancelado",   className: "status-cancelled" },
  NEW:         { label: "Nuevo",       className: "status-pending" },
  READ:        { label: "Leído",       className: "status-active" },
  REPLIED:     { label: "Respondido",  className: "status-completed" },
};

type Tab = "listings" | "inquiries" | "deliveries" | "rides";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("listings");
  const [listings, setListings] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin?callbackUrl=/dashboard");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    const user = session?.user as any;

    Promise.all([
      fetch(`/api/listings?userId=${user.id}&limit=50`).then((r) => r.json()),
      fetch("/api/inquiries").then((r) => r.json()),
      fetch("/api/delivery").then((r) => r.json()),
      fetch("/api/rides").then((r) => r.json()),
    ])
      .then(([l, i, d, r]) => {
        setListings(l.items ?? []);
        setInquiries(Array.isArray(i) ? i : []);
        setDeliveries(Array.isArray(d) ? d : []);
        setRides(Array.isArray(r) ? r : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status, session]);

  if (status === "loading" || loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
        </div>
      </PublicLayout>
    );
  }

  if (!session) return null;

  const user = session.user as any;

  const TABS: { id: Tab; label: string; icon: typeof Package; count: number }[] = [
    { id: "listings",   label: "Mis anuncios",  icon: Package,       count: listings.length },
    { id: "inquiries",  label: "Consultas",     icon: MessageSquare, count: inquiries.length },
    { id: "deliveries", label: "Entregas",      icon: Truck,         count: deliveries.length },
    { id: "rides",      label: "Viajes",        icon: Car,           count: rides.length },
  ];

  return (
    <PublicLayout>
      <div className="bg-cream min-h-screen pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile header */}
          <div className="bg-white rounded-2xl border border-carbon/8 p-6 mb-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-terracotta/10 text-terracotta font-bold text-xl flex items-center justify-center shrink-0">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-xl text-carbon truncate">
                  {user.name ?? "Mi cuenta"}
                </h1>
                {user.verified && (
                  <BadgeCheck className="h-5 w-5 text-terracotta shrink-0" aria-label="Vendedor verificado" />
                )}
              </div>
              <p className="text-carbon/50 text-sm">{user.email}</p>
              {user.city && (
                <p className="text-carbon/40 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" /> {user.city}
                </p>
              )}
            </div>
            <Link href="/listings/new"
              className="flex items-center gap-2 px-4 py-2.5 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-semibold rounded-full transition-colors btn-press shrink-0">
              <Plus className="h-4 w-4" /> Nuevo anuncio
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-2xl border border-carbon/8 p-1.5 mb-6 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon, count }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === id
                    ? "bg-terracotta text-white shadow-sm"
                    : "text-carbon/60 hover:text-carbon hover:bg-carbon/5"
                }`}>
                <Icon className="h-4 w-4" />
                {label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === id ? "bg-white/20" : "bg-carbon/8"
                }`}>{count}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "listings" && (
            <div>
              {listings.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="Aún no tienes anuncios"
                  desc="Publica tu primer anuncio y llega a miles de compradores."
                  cta={{ href: "/listings/new", label: "Publicar anuncio" }}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((l) => (
                    <div key={l.id} className="bg-white rounded-2xl border border-carbon/8 overflow-hidden">
                      <div className="aspect-[4/3] bg-carbon/5 overflow-hidden">
                        {l.imageUrl ? (
                          <img src={l.imageUrl} alt={l.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-carbon/20" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-carbon text-sm line-clamp-2 mb-2">{l.title}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-terracotta font-bold text-sm">
                            {formatPrice(l.price, l.currency)}
                          </span>
                          <StatusBadge status={l.status} />
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs text-carbon/40">
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{l.views}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatRelativeDate(l.createdAt)}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link href={`/listings/${l.id}`}
                            className="flex-1 py-1.5 text-center text-xs font-medium bg-carbon/5 hover:bg-carbon/10 text-carbon rounded-lg transition-colors">
                            Ver
                          </Link>
                          <button className="flex-1 py-1.5 text-xs font-medium bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg transition-colors">
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "inquiries" && (
            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <EmptyState icon={MessageSquare} title="Sin consultas" desc="Tus consultas sobre anuncios aparecerán aquí." />
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white rounded-2xl border border-carbon/8 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {inq.listing && (
                          <Link href={`/listings/${inq.listing.id}`}
                            className="text-sm font-semibold text-carbon hover:text-terracotta transition-colors line-clamp-1">
                            {inq.listing.title}
                          </Link>
                        )}
                        <p className="text-carbon/60 text-sm mt-1 line-clamp-2">{inq.message}</p>
                        <p className="text-carbon/30 text-xs mt-1.5">{formatRelativeDate(inq.createdAt)}</p>
                      </div>
                      <StatusBadge status={inq.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "deliveries" && (
            <div className="space-y-3">
              {deliveries.length === 0 ? (
                <EmptyState
                  icon={Truck}
                  title="Sin solicitudes de entrega"
                  desc="Tus solicitudes de entrega aparecerán aquí."
                  cta={{ href: "/deliveries", label: "Solicitar entrega" }}
                />
              ) : (
                deliveries.map((d) => (
                  <div key={d.id} className="bg-white rounded-2xl border border-carbon/8 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-carbon">{d.pickupCity}</span>
                          <span className="text-carbon/30">→</span>
                          <span className="text-sm font-semibold text-carbon">{d.dropoffCity}</span>
                        </div>
                        <p className="text-xs text-carbon/50">{d.pickupAddress} → {d.dropoffAddress}</p>
                        {d.packageDesc && <p className="text-xs text-carbon/40 mt-1">{d.packageDesc}</p>}
                        <p className="text-xs text-carbon/30 mt-1.5">{formatRelativeDate(d.createdAt)}</p>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "rides" && (
            <div className="space-y-3">
              {rides.length === 0 ? (
                <EmptyState
                  icon={Car}
                  title="Sin solicitudes de viaje"
                  desc="Tus solicitudes de viaje aparecerán aquí."
                  cta={{ href: "/rides", label: "Solicitar viaje" }}
                />
              ) : (
                rides.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl border border-carbon/8 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-carbon">{r.pickupCity}</span>
                          <span className="text-carbon/30">→</span>
                          <span className="text-sm font-semibold text-carbon">{r.dropoffCity}</span>
                        </div>
                        <p className="text-xs text-carbon/50">{r.pickupAddress} → {r.dropoffAddress}</p>
                        <p className="text-xs text-carbon/40 mt-1">{r.passengers} pasajero(s)</p>
                        <p className="text-xs text-carbon/30 mt-1.5">{formatRelativeDate(r.createdAt)}</p>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, className: "status-pending" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}

function EmptyState({
  icon: Icon, title, desc, cta
}: {
  icon: typeof Package; title: string; desc: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="bg-white rounded-2xl border border-carbon/8 p-12 text-center">
      <Icon className="h-10 w-10 text-carbon/20 mx-auto mb-4" />
      <h3 className="font-semibold text-carbon mb-2">{title}</h3>
      <p className="text-carbon/50 text-sm mb-5">{desc}</p>
      {cta && (
        <Link href={cta.href}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-semibold rounded-full transition-colors btn-press">
          <Plus className="h-4 w-4" /> {cta.label}
        </Link>
      )}
    </div>
  );
}
