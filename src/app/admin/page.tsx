"use client";

import { useState, useEffect, useCallback } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import {
  LayoutDashboard, Package, Users, Truck, Car, UtensilsCrossed,
  CheckCircle2, XCircle, Clock, Loader2, BadgeCheck, Eye,
  BarChart3, AlertTriangle, RefreshCw, ShieldCheck, Mail,
  ChevronRight, List
} from "lucide-react";

type AdminTab = "overview" | "listings" | "users" | "requests" | "waitlist";
type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";
type RequestType = "DELIVERY" | "RIDE" | "FOOD";
type RequestStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

function formatPrice(price: number | null, currency = "XAF") {
  if (price == null) return "Precio a consultar";
  return new Intl.NumberFormat("es-GQ", { style: "currency", currency, minimumFractionDigits: 0 }).format(price);
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("es-GQ", { day: "2-digit", month: "short", year: "numeric" });
}

const STATUS_LABELS: Record<string, string> = {
  PENDING:     "Pendiente",
  APPROVED:    "Aprobado",
  REJECTED:    "Rechazado",
  ACCEPTED:    "Aceptado",
  IN_PROGRESS: "En curso",
  COMPLETED:   "Completado",
  CANCELLED:   "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "bg-amber-100 text-amber-700",
  APPROVED:    "bg-green-100 text-green-700",
  REJECTED:    "bg-red-100 text-red-700",
  ACCEPTED:    "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  COMPLETED:   "bg-emerald-100 text-emerald-700",
  CANCELLED:   "bg-gray-100 text-gray-500",
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  DELIVERY: "Entrega",
  RIDE:     "Viaje",
  FOOD:     "Comida",
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [listingFilter, setListingFilter] = useState<ListingStatus | "">("");
  const [requestTypeFilter, setRequestTypeFilter] = useState<RequestType | "">("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const headers = { "Content-Type": "application/json", "x-admin-key": adminKey };

  const fetchAll = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const h = { "x-admin-key": key };
      const [s, l, u, r, w] = await Promise.all([
        fetch("/api/admin/stats",    { headers: h }).then((r) => r.json()),
        fetch("/api/admin/listings?status=PENDING", { headers: h }).then((r) => r.json()),
        fetch("/api/admin/users",    { headers: h }).then((r) => r.json()),
        fetch("/api/admin/requests", { headers: h }).then((r) => r.json()),
        fetch("/api/admin/waitlist", { headers: h }).then((r) => r.json()),
      ]);
      if (s.error) { setAuthError("Clave incorrecta. Inténtalo de nuevo."); setAdminKey(""); return; }
      setStats(s);
      setListings(l.listings ?? []);
      setUsers(u.users ?? []);
      setRequests(r.requests ?? []);
      setWaitlist(w.leads ?? []);
    } catch {
      setAuthError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setAuthError("");
    setAdminKey(keyInput.trim());
    fetchAll(keyInput.trim());
  }

  async function fetchListings(status: ListingStatus | "") {
    const h = { "x-admin-key": adminKey };
    const url = status ? `/api/admin/listings?status=${status}` : "/api/admin/listings";
    const res = await fetch(url, { headers: h });
    const data = await res.json();
    setListings(data.listings ?? []);
  }

  async function fetchRequests(type: RequestType | "") {
    const h = { "x-admin-key": adminKey };
    const url = type ? `/api/admin/requests?type=${type}` : "/api/admin/requests";
    const res = await fetch(url, { headers: h });
    const data = await res.json();
    setRequests(data.requests ?? []);
  }

  async function handleListingAction(id: number, action: string) {
    setActionLoading(`listing-${id}-${action}`);
    try {
      await fetch(`/api/admin/listings/${id}`, {
        method:  "PATCH",
        headers: { ...headers },
        body:    JSON.stringify({ action }),
      });
      fetchListings(listingFilter);
      fetchAll(adminKey);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRequestStatus(id: number, status: RequestStatus) {
    setActionLoading(`request-${id}`);
    try {
      await fetch("/api/admin/requests", {
        method:  "PATCH",
        headers: { ...headers },
        body:    JSON.stringify({ id, status }),
      });
      fetchRequests(requestTypeFilter);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleVerified(userId: number, current: boolean) {
    setActionLoading(`user-${userId}`);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method:  "PATCH",
        headers: { ...headers },
        body:    JSON.stringify({ verified: !current }),
      });
      const updated = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, verified: updated.verified } : u)));
    } finally {
      setActionLoading(null);
    }
  }

  // ─── Login gate ───────────────────────────────────────────────────────────

  if (!adminKey) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
        <div className="bg-ink border border-white/8 rounded-2xl p-8 w-full max-w-sm">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-7 w-7 text-terracotta" />
            <h1 className="font-display font-bold text-xl text-cream">Panel de Administración</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-cream/60 mb-1.5">Clave de administrador</label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-cream text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
                autoFocus
              />
            </div>
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-2.5 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-bold rounded-full transition-colors"
            >
              Acceder
            </button>
          </form>
          <p className="text-cream/30 text-xs mt-4 text-center">
            La clave se configura en la variable de entorno <code className="text-cream/50">ADMIN_SECRET</code>
          </p>
        </div>
      </div>
    );
  }

  // ─── Main dashboard ───────────────────────────────────────────────────────

  const tabs: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: "overview",  label: "Resumen",    icon: LayoutDashboard },
    { id: "listings",  label: "Anuncios",   icon: Package },
    { id: "users",     label: "Usuarios",   icon: Users },
    { id: "requests",  label: "Solicitudes", icon: Truck },
    { id: "waitlist",  label: "Lista espera", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Top bar */}
      <div className="bg-carbon border-b border-white/8 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-terracotta" />
          <span className="font-semibold text-cream text-sm">Eyooly Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchAll(adminKey)}
            className="flex items-center gap-1.5 text-cream/50 hover:text-cream text-xs transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Actualizar
          </button>
          <button
            onClick={() => { setAdminKey(""); setKeyInput(""); }}
            className="text-cream/40 hover:text-red-400 text-xs transition-colors"
          >
            Salir
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tab nav */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                if (id === "listings") fetchListings(listingFilter);
                if (id === "requests") fetchRequests(requestTypeFilter);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                tab === id
                  ? "bg-carbon text-cream"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        )}

        {!loading && (
          <>
            {/* ── OVERVIEW ── */}
            {tab === "overview" && stats && (
              <div className="space-y-6">
                <h2 className="font-display font-bold text-xl text-carbon">Resumen de la plataforma</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: "Anuncios",    value: stats.listings?.total,    icon: Package,          color: "text-terracotta" },
                    { label: "Pendientes",  value: stats.listings?.pending,  icon: Clock,            color: "text-amber-500" },
                    { label: "Aprobados",   value: stats.listings?.approved, icon: CheckCircle2,     color: "text-green-500" },
                    { label: "Usuarios",    value: stats.users?.total,       icon: Users,            color: "text-blue-500" },
                    { label: "Solicitudes", value: stats.requests?.total,    icon: Truck,            color: "text-purple-500" },
                    { label: "Lista espera",value: stats.waitlist?.total,    icon: Mail,             color: "text-sage" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
                      <Icon className={`h-6 w-6 mx-auto mb-2 ${color}`} />
                      <div className="font-bold text-2xl text-carbon">{value ?? 0}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick pending listings */}
                {listings.filter((l) => l.status === "PENDING").length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <h3 className="font-semibold text-amber-800 text-sm">
                        {listings.filter((l) => l.status === "PENDING").length} anuncio(s) pendiente(s) de revisión
                      </h3>
                    </div>
                    <button
                      onClick={() => setTab("listings")}
                      className="flex items-center gap-1 text-amber-700 text-sm font-medium hover:underline"
                    >
                      Revisar ahora <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── LISTINGS ── */}
            {tab === "listings" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display font-bold text-xl text-carbon flex-1">Anuncios</h2>
                  <div className="flex gap-2">
                    {(["", "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
                      <button
                        key={s || "all"}
                        onClick={() => { setListingFilter(s as ListingStatus | ""); fetchListings(s as ListingStatus | ""); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          listingFilter === s
                            ? "bg-carbon text-cream"
                            : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {s === "" ? "Todos" : STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>

                {listings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                    No hay anuncios en este estado.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {listings.map((listing) => (
                      <div key={listing.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="w-full sm:w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {listing.imageUrl || listing.images?.[0]?.url ? (
                            <img
                              src={listing.imageUrl ?? listing.images[0].url}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start gap-2 flex-wrap">
                            <h3 className="font-semibold text-carbon text-sm truncate flex-1">{listing.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                              {STATUS_LABELS[listing.status]}
                            </span>
                          </div>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {listing.sellerName ?? "Vendedor"} · {listing.city ?? "—"} · {formatDate(listing.createdAt)}
                          </p>
                          <p className="text-terracotta text-sm font-semibold mt-1">
                            {formatPrice(listing.price, listing.currency)}
                          </p>
                          {listing.sellerWhatsapp && (
                            <p className="text-gray-400 text-xs">WhatsApp: {listing.sellerWhatsapp}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                          {listing.status !== "APPROVED" && (
                            <button
                              onClick={() => handleListingAction(listing.id, "approve")}
                              disabled={actionLoading === `listing-${listing.id}-approve`}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `listing-${listing.id}-approve`
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <CheckCircle2 className="h-3 w-3" />
                              }
                              Aprobar
                            </button>
                          )}
                          {listing.status !== "REJECTED" && (
                            <button
                              onClick={() => handleListingAction(listing.id, "reject")}
                              disabled={actionLoading === `listing-${listing.id}-reject`}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `listing-${listing.id}-reject`
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <XCircle className="h-3 w-3" />
                              }
                              Rechazar
                            </button>
                          )}
                          <button
                            onClick={() => handleListingAction(listing.id, listing.featured ? "unfeature" : "feature")}
                            disabled={actionLoading === `listing-${listing.id}-feature`}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-medium rounded-full transition-colors disabled:opacity-50"
                          >
                            <BarChart3 className="h-3 w-3" />
                            {listing.featured ? "Quitar destacado" : "Destacar"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── USERS ── */}
            {tab === "users" && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-xl text-carbon">Usuarios</h2>
                {users.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                    No hay usuarios registrados.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs">Nombre</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs hidden sm:table-cell">Email</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs hidden md:table-cell">Ciudad</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs">Rol</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs hidden sm:table-cell">Anuncios</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs">Verificado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <div className="font-medium text-carbon">{user.name ?? "—"}</div>
                              <div className="text-gray-400 text-xs">{formatDate(user.createdAt)}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{user.email ?? "—"}</td>
                            <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{user.city ?? "—"}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === "ADMIN" ? "bg-terracotta/10 text-terracotta" : "bg-gray-100 text-gray-500"}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{user._count?.listings ?? 0}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleVerified(user.id, user.verified)}
                                disabled={actionLoading === `user-${user.id}`}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                                  user.verified
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {actionLoading === `user-${user.id}`
                                  ? <Loader2 className="h-3 w-3 animate-spin" />
                                  : <BadgeCheck className="h-3 w-3" />
                                }
                                {user.verified ? "Verificado" : "Verificar"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── REQUESTS ── */}
            {tab === "requests" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-display font-bold text-xl text-carbon flex-1">Solicitudes</h2>
                  <div className="flex gap-2">
                    {(["", "DELIVERY", "RIDE", "FOOD"] as const).map((t) => (
                      <button
                        key={t || "all"}
                        onClick={() => { setRequestTypeFilter(t as RequestType | ""); fetchRequests(t as RequestType | ""); }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          requestTypeFilter === t
                            ? "bg-carbon text-cream"
                            : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {t === "" ? "Todas" : REQUEST_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                {requests.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                    No hay solicitudes.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div key={req.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              req.type === "DELIVERY" ? "bg-blue-100 text-blue-700" :
                              req.type === "RIDE"     ? "bg-purple-100 text-purple-700" :
                              "bg-orange-100 text-orange-700"
                            }`}>
                              {REQUEST_TYPE_LABELS[req.type as RequestType]}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[req.status]}`}>
                              {STATUS_LABELS[req.status]}
                            </span>
                            <span className="text-gray-400 text-xs">#{req.id} · {formatDate(req.createdAt)}</span>
                          </div>
                          <p className="font-semibold text-carbon text-sm">{req.name}</p>
                          <p className="text-gray-400 text-xs">{req.phone}{req.email ? ` · ${req.email}` : ""}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            <span className="font-medium">Recogida:</span> {req.pickup}
                            {req.dropoff && <><span className="mx-1">→</span><span className="font-medium">Destino:</span> {req.dropoff}</>}
                          </p>
                          {req.notes && <p className="text-gray-400 text-xs mt-0.5 italic">"{req.notes}"</p>}
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                          {(["ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as RequestStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => handleRequestStatus(req.id, s)}
                              disabled={req.status === s || !!actionLoading}
                              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-40 ${STATUS_COLORS[s]} hover:opacity-80`}
                            >
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── WAITLIST ── */}
            {tab === "waitlist" && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-xl text-carbon">Lista de espera ({waitlist.length})</h2>
                {waitlist.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
                    No hay registros en la lista de espera.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs">Email</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs hidden sm:table-cell">Nombre</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs hidden sm:table-cell">Fuente</th>
                          <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {waitlist.map((lead) => (
                          <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-carbon font-medium">{lead.email}</td>
                            <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{lead.name ?? "—"}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{lead.source ?? "—"}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(lead.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
