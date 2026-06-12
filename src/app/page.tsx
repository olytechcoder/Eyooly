"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ShoppingBag, Package, Car, UtensilsCrossed, ArrowRight,
  CheckCircle2, Star, MapPin, Shield, Zap, Users, TrendingUp,
  ChevronRight, Loader2, Smartphone, Wrench, Home, Briefcase,
  Bike, Building2, Scissors, Truck, Search, BadgeCheck,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { key: "stats.listings",   value: "2,400+",  icon: ShoppingBag },
  { key: "stats.cities",     value: "5",        icon: MapPin },
  { key: "stats.sellers",    value: "800+",     icon: Users },
  { key: "stats.deliveries", value: "1,200+",   icon: Package },
];

const SERVICES = [
  {
    key:    "marketplace",
    href:   "/mercado",
    icon:   ShoppingBag,
    accent: "#c9735a",
    bg:     "bg-terracotta/8",
    border: "border-terracotta/15",
    glow:   "group-hover:shadow-terracotta/20",
    img:    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  },
  {
    key:    "deliveries",
    href:   "/entregas",
    icon:   Package,
    accent: "#b7baad",
    bg:     "bg-sage/8",
    border: "border-sage/15",
    glow:   "group-hover:shadow-sage/20",
    img:    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  },
  {
    key:    "rides",
    href:   "/viajes",
    icon:   Car,
    accent: "#c9735a",
    bg:     "bg-terracotta/6",
    border: "border-terracotta/12",
    glow:   "group-hover:shadow-terracotta/15",
    img:    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
  },
  {
    key:    "food",
    href:   "/comida",
    icon:   UtensilsCrossed,
    accent: "#b7baad",
    bg:     "bg-sage/6",
    border: "border-sage/12",
    glow:   "group-hover:shadow-sage/15",
    img:    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  },
];

const CATEGORIES = [
  { icon: ShoppingBag,   label: "Supermercado",    href: "/mercado?cat=groceries" },
  { icon: Smartphone,    label: "Electrónica",      href: "/mercado?cat=electronics" },
  { icon: Scissors,      label: "Moda",             href: "/mercado?cat=fashion" },
  { icon: Home,          label: "Hogar",            href: "/mercado?cat=home" },
  { icon: Car,           label: "Vehículos",        href: "/mercado?cat=vehicles" },
  { icon: Building2,     label: "Inmuebles",        href: "/mercado?cat=realestate" },
  { icon: Wrench,        label: "Servicios",        href: "/mercado?cat=services" },
  { icon: Briefcase,     label: "Empleos",          href: "/mercado?cat=jobs" },
  { icon: Bike,          label: "Delivery",         href: "/entregas" },
  { icon: Truck,         label: "Envíos",           href: "/entregas" },
  { icon: UtensilsCrossed, label: "Comida",         href: "/comida" },
  { icon: Users,         label: "Vendedores",       href: "/sellers" },
];

const TESTIMONIALS = [
  {
    name: "María Obiang",
    city: "Malabo",
    role: "Vendedora",
    text: "Vendí mi teléfono en menos de 24 horas. La plataforma es muy fácil de usar.",
    stars: 5,
    initials: "MO",
  },
  {
    name: "Jean-Pierre Nguema",
    city: "Bata",
    role: "Cliente",
    text: "El servicio de entregas es rápido y confiable. Recomiendo Eyooly a todos.",
    stars: 5,
    initials: "JN",
  },
  {
    name: "Ana Mba Esono",
    city: "Malabo",
    role: "Compradora",
    text: "Encontré el apartamento que buscaba en pocos minutos. Excelente servicio.",
    stars: 5,
    initials: "AE",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Crea tu cuenta",
    desc: "Regístrate con tu correo electrónico en segundos. Sin contraseñas complicadas.",
    icon: Users,
  },
  {
    step: "02",
    title: "Publica o busca",
    desc: "Publica tu anuncio o explora miles de productos y servicios locales.",
    icon: Search,
  },
  {
    step: "03",
    title: "Conecta y cierra",
    desc: "Contacta directamente con vendedores o solicita entregas y viajes.",
    icon: CheckCircle2,
  },
];

const PLATFORM_FEATURES = [
  {
    icon: Shield,
    title: "Vendedores verificados",
    desc: "Todos los vendedores pasan por un proceso de verificación para garantizar tu seguridad.",
    color: "text-terracotta",
    bg: "bg-terracotta/8",
  },
  {
    icon: Zap,
    title: "Entregas rápidas",
    desc: "Recibe tus pedidos en minutos con nuestra red de repartidores locales en Malabo y Bata.",
    color: "text-sage",
    bg: "bg-sage/8",
  },
  {
    icon: MapPin,
    title: "100% local",
    desc: "Diseñado específicamente para Guinea Ecuatorial. Conocemos tu ciudad, tu idioma, tu mercado.",
    color: "text-terracotta",
    bg: "bg-terracotta/8",
  },
  {
    icon: BadgeCheck,
    title: "Pagos seguros",
    desc: "Transacciones protegidas y sistema de valoraciones para compradores y vendedores.",
    color: "text-sage",
    bg: "bg-sage/8",
  },
];

// ─── Floating badge component ─────────────────────────────────────────────────

function FloatingBadge({
  icon: Icon,
  text,
  className,
}: {
  icon: React.ElementType;
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2 px-3 py-2 bg-ink/90 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl text-xs font-medium text-cream/90 ${className}`}
    >
      <Icon className="h-3.5 w-3.5 text-terracotta shrink-0" />
      {text}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [searchQuery, setSearchQuery] = useState("");

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setWaitlistState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setWaitlistState("success");
        setEmail("");
      } else {
        setWaitlistState("error");
      }
    } catch {
      setWaitlistState("error");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/mercado?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <PublicLayout>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Split layout: text left, app mockup right
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center bg-carbon overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-br from-carbon via-ink to-carbon" />
        {/* Right glow behind mockup */}
        <div className="absolute top-1/4 right-[-5%] w-[700px] h-[700px] bg-terracotta/10 rounded-full blur-[140px] pointer-events-none" />
        {/* Left bottom glow */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage/6 rounded-full blur-[120px] pointer-events-none" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,242,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,242,237,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* ── Left: Text & CTAs ── */}
            <div className="order-2 lg:order-1">
              {/* Location badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-semibold mb-6 animate-fade-in">
                <MapPin className="h-3 w-3" />
                {t("hero.badge")} · Malabo · Bata
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-[64px] font-display font-bold text-cream leading-[1.04] mb-6 animate-fade-in-up">
                {t("hero.title").split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 1 ? (
                      <span className="gradient-text">{line}</span>
                    ) : (
                      line
                    )}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>

              <p className="text-cream/55 text-lg sm:text-xl leading-relaxed max-w-lg mb-8 animate-fade-in-up delay-100">
                {t("hero.subtitle")}
              </p>

              {/* Hero search bar */}
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-2 bg-white/6 border border-white/10 rounded-full px-4 py-2.5 mb-8 max-w-md animate-fade-in-up delay-150 focus-within:border-terracotta/40 transition-colors"
              >
                <Search className="h-4 w-4 text-cream/30 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos, servicios, lugares..."
                  className="flex-1 bg-transparent text-sm text-cream placeholder-cream/30 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-terracotta hover:bg-terracotta/90 text-white text-xs font-semibold rounded-full transition-colors btn-press shrink-0"
                >
                  Buscar
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up delay-200">
                <Link
                  href="/#waitlist"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press shadow-lg shadow-terracotta/25 text-sm"
                >
                  Unirme a Eyooly <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/publicar-anuncio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/8 hover:bg-white/12 text-cream font-semibold rounded-full border border-white/10 hover:border-white/20 transition-all btn-press text-sm"
                >
                  Publicar anuncio
                </Link>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 animate-fade-in-up delay-300">
                {[
                  { icon: Shield,       text: "Pagos seguros" },
                  { icon: Zap,          text: "Respuesta rápida" },
                  { icon: BadgeCheck,   text: "Vendedores verificados" },
                  { icon: MapPin,       text: "100% local" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-cream/40 text-xs">
                    <Icon className="h-3.5 w-3.5 text-terracotta/70" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: App mockup ── */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative animate-fade-in-up delay-100">
              {/* Glow behind image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[380px] h-[380px] bg-terracotta/15 rounded-full blur-[80px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[260px] h-[260px] bg-sage/10 rounded-full blur-[60px] translate-x-16 translate-y-8" />
              </div>

              {/* Mockup image */}
              <div className="relative z-10 w-full max-w-[520px] lg:max-w-none">
                <Image
                  src="/assets/eyooly_app.png"
                  alt="Eyooly App — Mercado, Entregas, Viajes"
                  width={620}
                  height={680}
                  priority
                  className="w-full h-auto object-contain drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 32px 64px rgba(201,115,90,0.18)) drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
                />

                {/* Floating badges */}
                <FloatingBadge
                  icon={MapPin}
                  text="Malabo, GQ"
                  className="top-[12%] left-[-2%] lg:left-[-8%] animate-fade-in delay-400"
                />
                <FloatingBadge
                  icon={Zap}
                  text="Entrega rápida"
                  className="top-[38%] right-[-2%] lg:right-[-10%] animate-fade-in delay-400"
                />
                <FloatingBadge
                  icon={BadgeCheck}
                  text="Vendedor verificado"
                  className="bottom-[28%] left-[-2%] lg:left-[-10%] animate-fade-in delay-400"
                />
                <FloatingBadge
                  icon={Shield}
                  text="Pago seguro"
                  className="bottom-[10%] right-[5%] lg:right-[-4%] animate-fade-in delay-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-carbon to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-ink border-y border-white/6 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ key, value, icon: Icon }) => (
              <div key={key} className="text-center group">
                <div className="flex justify-center mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/15 transition-colors">
                    <Icon className="h-5 w-5 text-terracotta" />
                  </div>
                </div>
                <div className="text-3xl font-display font-bold text-cream mb-1 tabular-nums">{value}</div>
                <div className="text-cream/40 text-sm">{t(key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORIES — Quick access grid
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-py bg-carbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-cream mb-3">
              ¿Qué estás buscando?
            </h2>
            <p className="text-cream/45 text-base max-w-xl mx-auto">
              Explora categorías locales en Guinea Ecuatorial
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 lg:gap-4">
            {CATEGORIES.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/4 border border-white/6 hover:bg-terracotta/8 hover:border-terracotta/20 transition-all duration-200 btn-press text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/6 group-hover:bg-terracotta/15 flex items-center justify-center transition-colors">
                  <Icon className="h-5 w-5 text-cream/50 group-hover:text-terracotta transition-colors" />
                </div>
                <span className="text-cream/55 group-hover:text-cream text-xs font-medium leading-tight transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SERVICES — 4-card grid on cream background
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-carbon mb-4">
              {t("services.title")}
            </h2>
            <p className="text-carbon/55 text-lg max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map(({ key, href, icon: Icon, bg, border, glow, img }) => (
              <Link
                key={key}
                href={href}
                className={`group relative overflow-hidden rounded-2xl border ${border} ${bg} p-5 card-hover block hover:shadow-xl ${glow} transition-all duration-300`}
              >
                {/* Image */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-carbon/8">
                  <img
                    src={img}
                    alt={t(`services.${key}.title`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Content */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-carbon/8 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-carbon/60" />
                  </div>
                  <h3 className="font-display font-bold text-carbon text-base">
                    {t(`services.${key}.title`)}
                  </h3>
                </div>
                <p className="text-carbon/55 text-sm leading-relaxed mb-4">
                  {t(`services.${key}.desc`)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-carbon/50 group-hover:text-carbon transition-colors">
                  Explorar <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PLATFORM FEATURES — Why Eyooly
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-py bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-cream mb-4">
              Por qué elegir Eyooly
            </h2>
            <p className="text-cream/45 text-lg max-w-2xl mx-auto">
              La plataforma construida para Guinea Ecuatorial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLATFORM_FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-white/3 border border-white/6 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-cream text-base mb-2.5">{title}</h3>
                <p className="text-cream/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS — 3 steps with connecting line
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-py bg-carbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-cream mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-cream/45 text-lg">Empieza en menos de 2 minutos</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-terracotta/30 via-sage/30 to-terracotta/30" />

            {HOW_IT_WORKS.map(({ step, title, desc, icon: Icon }, idx) => (
              <div key={step} className="relative text-center">
                {/* Step circle */}
                <div className="relative w-16 h-16 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto mb-6 z-10">
                  <span className="font-display font-bold text-xl text-terracotta">{step}</span>
                </div>
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <Icon className="h-6 w-6 text-cream/30" />
                </div>
                <h3 className="font-display font-bold text-xl text-cream mb-3">{title}</h3>
                <p className="text-cream/45 text-sm leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press shadow-lg shadow-terracotta/25"
            >
              Crear cuenta gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-carbon mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-carbon/50 text-lg">Personas reales de Guinea Ecuatorial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, role, text, stars, initials }) => (
              <div
                key={name}
                className="bg-white rounded-2xl p-7 shadow-sm border border-carbon/6 card-hover flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-terracotta text-terracotta" />
                  ))}
                </div>
                {/* Quote */}
                <p className="text-carbon/65 text-sm leading-relaxed mb-6 flex-1">
                  &ldquo;{text}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-carbon/6">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta text-sm font-bold flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div>
                    <div className="font-semibold text-carbon text-sm">{name}</div>
                    <div className="text-carbon/40 text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {city} · {role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WAITLIST — Email capture
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="waitlist" className="section-py bg-ink relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-terracotta/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-semibold mb-6">
            <TrendingUp className="h-3 w-3" />
            Próximamente
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-cream mb-4">
            {t("waitlist.title")}
          </h2>
          <p className="text-cream/50 text-lg mb-10 max-w-lg mx-auto">
            {t("waitlist.subtitle")}
          </p>

          {waitlistState === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="w-14 h-14 rounded-full bg-terracotta/15 flex items-center justify-center">
                <CheckCircle2 className="h-7 w-7 text-terracotta" />
              </div>
              <p className="text-cream font-semibold text-lg">{t("waitlist.success")}</p>
              <p className="text-cream/40 text-sm">Te avisaremos cuando Eyooly esté disponible en tu ciudad.</p>
            </div>
          ) : (
            <form
              onSubmit={handleWaitlist}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("waitlist.placeholder")}
                required
                className="flex-1 px-5 py-3.5 bg-white/6 border border-white/10 rounded-full text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50 text-sm transition-colors"
              />
              <button
                type="submit"
                disabled={waitlistState === "loading"}
                className="px-6 py-3.5 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-semibold rounded-full transition-colors btn-press text-sm flex items-center gap-2 justify-center shrink-0 shadow-lg shadow-terracotta/25"
              >
                {waitlistState === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  t("waitlist.cta")
                )}
              </button>
            </form>
          )}

          {waitlistState === "error" && (
            <p className="text-red-400 text-sm mt-4">{t("waitlist.error")}</p>
          )}

          {/* Social proof */}
          <p className="text-cream/25 text-xs mt-6">
            Más de 500 personas ya están en la lista · Sin spam · Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CTA BANNER — Final conversion
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-terracotta py-20 overflow-hidden">
        {/* Texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(245,242,237,1) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-5 leading-tight">
            ¿Listo para empezar?
          </h2>
          <p className="text-white/75 text-lg mb-10 max-w-xl mx-auto">
            Únete a miles de personas que ya usan Eyooly en Guinea Ecuatorial.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/mercado"
              className="px-8 py-3.5 bg-white text-terracotta font-bold rounded-full hover:bg-cream transition-colors btn-press text-sm shadow-xl"
            >
              Explorar el mercado
            </Link>
            <Link
              href="/publicar-anuncio"
              className="px-8 py-3.5 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-full border border-white/25 transition-colors btn-press text-sm"
            >
              Publicar anuncio
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}
