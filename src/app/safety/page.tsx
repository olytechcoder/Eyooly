"use client";

import PublicLayout from "@/components/layout/PublicLayout";
import { Shield, BadgeCheck, Eye, Lock, Phone, AlertTriangle } from "lucide-react";

export default function SafetyPage() {
  return (
    <PublicLayout>
      <section className="bg-carbon pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-medium mb-6">
              <Shield className="h-3 w-3" /> Seguridad
            </div>
            <h1 className="text-5xl font-display font-bold text-cream mb-4">
              Tu seguridad es<br />nuestra prioridad
            </h1>
            <p className="text-cream/60 text-lg">
              Eyooly implementa múltiples medidas para garantizar transacciones seguras y una comunidad confiable.
            </p>
          </div>
        </div>
      </section>

      <section className="section-py bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { icon: BadgeCheck, title: "Vendedores verificados",   desc: "Verificamos la identidad de los vendedores para reducir el fraude y aumentar la confianza." },
              { icon: Eye,        title: "Moderación de contenido",  desc: "Nuestro equipo revisa los anuncios antes de publicarlos para garantizar su legitimidad." },
              { icon: Lock,       title: "Datos protegidos",         desc: "Toda la información personal se almacena de forma segura y nunca se comparte sin consentimiento." },
              { icon: Phone,      title: "Soporte 24/7",             desc: "Nuestro equipo de soporte está disponible para ayudarte con cualquier problema." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-carbon/8 card-hover">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-carbon mb-2">{title}</h3>
                <p className="text-carbon/60 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Consejos de seguridad</h3>
                <ul className="space-y-1.5 text-sm text-amber-800">
                  {[
                    "Nunca pagues por adelantado sin ver el producto.",
                    "Prefiere reunirte en lugares públicos para las transacciones.",
                    "Desconfía de precios demasiado bajos o vendedores que presionan.",
                    "Reporta cualquier actividad sospechosa a nuestro equipo.",
                    "No compartas información personal sensible por el chat.",
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <span className="text-amber-600 shrink-0">•</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
