"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import Link from "next/link";
import { Store, TrendingUp, Users, Shield, BadgeCheck, ArrowRight, CheckCircle2 } from "lucide-react";

const BENEFITS = [
  { icon: TrendingUp,  title: "Más ventas",          desc: "Llega a miles de compradores potenciales en Guinea Ecuatorial." },
  { icon: BadgeCheck,  title: "Verificación gratuita", desc: "Obtén el sello de vendedor verificado para generar más confianza." },
  { icon: Shield,      title: "Protección al vendedor", desc: "Nuestras políticas protegen tanto a compradores como a vendedores." },
  { icon: Users,       title: "Comunidad local",      desc: "Conecta con una comunidad activa de compradores locales." },
];

const STEPS = [
  { n: "01", title: "Crea tu cuenta",     desc: "Regístrate con tu correo electrónico en segundos." },
  { n: "02", title: "Publica tu anuncio", desc: "Sube fotos, describe tu producto y fija el precio." },
  { n: "03", title: "Recibe consultas",   desc: "Los compradores te contactan directamente por la plataforma." },
  { n: "04", title: "Cierra la venta",    desc: "Coordina la entrega y recibe el pago de forma segura." },
];

export default function SellersPage() {
  return (
    <PublicLayout>
      <section className="bg-carbon pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta/6 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-medium mb-6">
              <Store className="h-3 w-3" /> Para vendedores
            </div>
            <h1 className="text-5xl font-display font-bold text-cream mb-4">
              Vende más con<br />
              <span className="gradient-text">Eyooly</span>
            </h1>
            <p className="text-cream/60 text-lg mb-8">
              La plataforma líder de Guinea Ecuatorial para vender productos y servicios locales. Gratis para empezar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/listings/new"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press text-sm">
                Publicar gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/signin"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/8 hover:bg-white/12 text-cream font-semibold rounded-full border border-white/10 transition-colors btn-press text-sm">
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-carbon mb-3">¿Por qué vender en Eyooly?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-carbon/8 card-hover">
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-terracotta" />
                </div>
                <h3 className="font-semibold text-carbon mb-2">{title}</h3>
                <p className="text-carbon/60 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-py bg-carbon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-cream mb-3">Cómo empezar a vender</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-display font-bold text-xl text-terracotta">{n}</span>
                </div>
                <h3 className="font-semibold text-cream mb-2">{title}</h3>
                <p className="text-cream/50 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-py bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-carbon mb-3">Precios transparentes</h2>
          <p className="text-carbon/60 mb-10">Empieza gratis. Sin sorpresas.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-carbon/8">
              <h3 className="font-bold text-carbon text-lg mb-1">Básico</h3>
              <div className="text-4xl font-display font-bold text-carbon mb-1">Gratis</div>
              <p className="text-carbon/50 text-sm mb-5">Para siempre</p>
              <ul className="space-y-2 text-sm text-carbon/70 text-left">
                {["Hasta 5 anuncios activos", "Fotos incluidas", "Contacto directo con compradores", "Soporte básico"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-terracotta rounded-2xl p-6 border border-terracotta/20 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-carbon text-cream text-xs font-semibold rounded-full">
                Próximamente
              </div>
              <h3 className="font-bold text-white text-lg mb-1">Pro</h3>
              <div className="text-4xl font-display font-bold text-white mb-1">Pronto</div>
              <p className="text-white/60 text-sm mb-5">Planes premium</p>
              <ul className="space-y-2 text-sm text-white/80 text-left">
                {["Anuncios ilimitados", "Destacados en búsqueda", "Sello de vendedor verificado", "Estadísticas avanzadas", "Soporte prioritario"].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
