"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PublicLayout from "@/components/layout/PublicLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ShoppingBag, Package, Car, UtensilsCrossed, ArrowRight,
  CheckCircle2, Star, MapPin, Shield, Zap, Users, TrendingUp,
  ChevronRight, Loader2
} from "lucide-react";

const STATS = [
  { key: "stats.listings",   value: "2,400+",  icon: ShoppingBag },
  { key: "stats.cities",     value: "5",        icon: MapPin },
  { key: "stats.sellers",    value: "800+",     icon: Users },
  { key: "stats.deliveries", value: "1,200+",   icon: Package },
];

const SERVICES = [
  {
    key:   "marketplace",
    href:  "/mercado",
    icon:  ShoppingBag,
    color: "from-terracotta/20 to-terracotta/5",
    border:"border-terracotta/20",
    img:   "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
  },
  {
    key:   "deliveries",
    href:  "/entregas",
    icon:  Package,
    color: "from-blue-500/20 to-blue-500/5",
    border:"border-blue-500/20",
    img:   "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  },
  {
    key:   "rides",
    href:  "/viajes",
    icon:  Car,
    color: "from-emerald-500/20 to-emerald-500/5",
    border:"border-emerald-500/20",
    img:   "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80",
  },
  {
    key:   "food",
    href:  "/comida",
    icon:  UtensilsCrossed,
    color: "from-amber-500/20 to-amber-500/5",
    border:"border-amber-500/20",
    img:   "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
  },
];

const TESTIMONIALS = [
  { name: "María Obiang", city: "Malabo", text: "Vendí mi teléfono en menos de 24 horas. La plataforma es muy fácil de usar.", stars: 5 },
  { name: "Jean-Pierre Nguema", city: "Bata", text: "El servicio de entregas es rápido y confiable. Recomiendo Eyooly a todos.", stars: 5 },
  { name: "Ana Mba Esono", city: "Malabo", text: "Encontré el apartamento que buscaba en pocos minutos. Excelente servicio.", stars: 5 },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Crea tu cuenta", desc: "Regístrate con tu correo electrónico en segundos. Sin contraseñas." },
  { step: "02", title: "Publica o busca", desc: "Publica tu anuncio o explora miles de productos y servicios locales." },
  { step: "03", title: "Conecta y cierra", desc: "Contacta directamente con vendedores o solicita entregas y viajes." },
];

export default function HomePage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [waitlistState, setWaitlistState] = useState<"idle"|"loading"|"success"|"error">("idle");

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

  return (
    <PublicLayout>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-carbon overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-carbon via-ink to-carbon" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-terracotta/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-medium mb-6 animate-fade-in">
                <MapPin className="h-3 w-3" />
                {t("hero.badge")}
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-cream leading-[1.05] mb-6 animate-fade-in-up">
                {t("hero.title").split("\n").map((line, i) => (
                  <span key={i}>
                    {i === 1 ? <span className="gradient-text">{line}</span> : line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>

              <p className="text-cream/60 text-lg sm:text-xl leading-relaxed max-w-xl mb-8 animate-fade-in-up delay-100">
                {t("hero.subtitle")}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up delay-200">
                <Link href="/mercado"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press shadow-lg shadow-terracotta/25 text-sm">
                  {t("hero.cta.primary")} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/publicar-anuncio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/8 hover:bg-white/12 text-cream font-semibold rounded-full border border-white/10 transition-colors btn-press text-sm">
                  {t("hero.cta.secondary")}
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up delay-300">
                {[
                  { icon: Shield, text: "Pagos seguros" },
                  { icon: Zap,    text: "Respuesta rápida" },
                  { icon: CheckCircle2, text: "Vendedores verificados" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-cream/40 text-xs">
                    <Icon className="h-3.5 w-3.5 text-terracotta" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right visual: App image with floating cards */}
            <div className="relative hidden lg:flex items-center justify-center h-full min-h-[600px]">
              {/* Glow background */}
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta/10 via-transparent to-sage/5 rounded-3xl blur-3xl" />
              
              {/* Main app image */}
              <div className="relative z-10 animate-fade-in delay-300">
                <div className="relative w-full max-w-sm">
                  {/* Soft shadow container */}
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta/20 to-transparent rounded-3xl blur-2xl opacity-60" />
                  
                  {/* Image wrapper */}
                  <div className="relative bg-gradient-to-br from-cream/5 to-transparent border border-white/10 rounded-3xl p-2 shadow-glow-terracotta overflow-hidden">
                    <Image
                      src="/eyooly_app.png"
                      alt="Eyooly App"
                      width={400}
                      height={800}
                      priority
                      className="w-full h-auto object-contain"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>
                </div>
              </div>

              {/* Floating trust cards */}
              <div className="absolute top-12 -left-8 z-20 animate-fade-in delay-400">
                <div className="bg-carbon/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-soft max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-terracotta/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-terracotta" />
                    </div>
                    <div>
                      <p className="text-cream/60 text-xs">Disponible en</p>
                      <p className="text-cream font-semibold text-sm">Malabo, Guinea Ecuatorial</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 -right-6 z-20 animate-fade-in delay-500">
                <div className="bg-carbon/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-soft max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-cream/60 text-xs">Verificado</p>
                      <p className="text-cream font-semibold text-sm">Vendedores confiables</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-12 z-20 animate-fade-in delay-500">
                <div className="bg-carbon/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-soft max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-cream/60 text-xs">Entregas</p>
                      <p className="text-cream font-semibold text-sm">Rápidas y seguras</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-ink border-y border-white/6 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map(({ key, value, icon: Icon }) => (
              <div key={key} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-terracotta" />
                  </div>
                </div>
                <div className="text-3xl font-display font-bold text-cream mb-1">{value}</div>
                <div className="text-cream/40 text-sm">{t(key)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-carbon mb-4">
              {t("services.title")}
            </h2>
            <p className="text-carbon/60 text-lg max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(({ key, href, icon: Icon, color, border, img }) => (
              <Link key={key} href={href}
                className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${color} p-6 card-hover block transition-all duration-300`}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-carbon/10">
                  <img src={img} alt={t(`services.${key}.title`)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-carbon/70" />
                  <h3 className="font-display font-bold text-carbon text-lg">
                    {t(`services.${key}.title`)}
                  </h3>
                </div>
                <p className="text-carbon/60 text-sm leading-relaxed mb-3">
                  {t(`services.${key}.desc`)}
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-carbon/70 group-hover:text-carbon transition-colors">
                  Explorar <ChevronRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="section-py bg-carbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-cream mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-cream/50 text-lg">Empieza en menos de 2 minutos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {HOW_IT_WORKS.map(({ step, title, desc }, index) => (
              <div key={step} className="relative text-center">
                {/* Connector line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-1/2 h-0.5 bg-gradient-to-r from-terracotta/30 to-transparent" />
                )}
                
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta/20 to-terracotta/5 border border-terracotta/20 flex items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="font-display font-bold text-2xl text-terracotta">{step}</span>
                </div>
                <h3 className="font-display font-bold text-xl text-cream mb-3">{title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/auth/signin"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press shadow-lg shadow-terracotta/25">
              Crear cuenta gratis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-carbon mb-4">
              Lo que dicen nuestros usuarios
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, city, text, stars }) => (
              <div key={name} className="bg-white rounded-2xl p-6 shadow-soft border border-carbon/6 card-subtle-hover">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-terracotta text-terracotta" />
                  ))}
                </div>
                <p className="text-carbon/70 text-sm leading-relaxed mb-5">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta text-sm font-bold flex items-center justify-center">
                    {name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-carbon text-sm">{name}</div>
                    <div className="text-carbon/40 text-xs flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{city}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────────────────── */}
      <section id="waitlist" className="section-py bg-ink">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-medium mb-6">
            <TrendingUp className="h-3 w-3" />
            Próximamente
          </div>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-cream mb-4">
            {t("waitlist.title")}
          </h2>
          <p className="text-cream/50 text-lg mb-8">{t("waitlist.subtitle")}</p>

          {waitlistState === "success" ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="h-5 w-5" />
              {t("waitlist.success")}
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("waitlist.placeholder")}
                required
                className="flex-1 px-4 py-3 bg-white/6 border border-white/10 rounded-full text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50 text-sm transition-colors"
              />
              <button type="submit" disabled={waitlistState === "loading"}
                className="px-6 py-3 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-semibold rounded-full transition-colors btn-press text-sm flex items-center gap-2 justify-center">
                {waitlistState === "loading" ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                ) : t("waitlist.cta")}
              </button>
            </form>
          )}

          {waitlistState === "error" && (
            <p className="text-red-400 text-sm mt-3">{t("waitlist.error")}</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
