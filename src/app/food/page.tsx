"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { UtensilsCrossed, Clock, Star, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function FoodPage() {
  return (
    <PublicLayout>
      <section className="bg-carbon pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/6 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-medium mb-6">
              <UtensilsCrossed className="h-3 w-3" /> Comida a domicilio
            </div>
            <h1 className="text-5xl font-display font-bold text-cream mb-4">
              Tu comida favorita,<br />
              <span className="text-amber-400">en tu puerta</span>
            </h1>
            <p className="text-cream/60 text-lg mb-8">
              Pide comida de los mejores restaurantes locales de Guinea Ecuatorial. Próximamente disponible.
            </p>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-medium">
              <TrendingUp className="h-3 w-3" /> Próximamente — Únete a la lista de espera
            </div>
          </div>
        </div>
      </section>

      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: UtensilsCrossed, title: "Restaurantes locales", desc: "Los mejores restaurantes de Malabo y Bata en un solo lugar." },
              { icon: Clock,           title: "Entrega en 30 min",    desc: "Recibe tu pedido caliente y fresco en menos de 30 minutos." },
              { icon: Star,            title: "Calificaciones",       desc: "Lee reseñas reales de otros usuarios antes de pedir." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-carbon/8 card-hover">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-carbon mb-2">{title}</h3>
                <p className="text-carbon/60 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-carbon/60 mb-4">¿Tienes un restaurante? Únete a Eyooly Food</p>
            <Link href="/#waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press text-sm">
              Registrar restaurante <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
