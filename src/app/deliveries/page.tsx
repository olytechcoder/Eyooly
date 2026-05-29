"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Package, MapPin, Clock, Shield, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

const CITIES = ["Malabo", "Bata", "Ebebiyín", "Aconibe", "Mongomo", "Evinayong"];

const FEATURES = [
  { icon: Clock,    title: "Entrega rápida",       desc: "Recoge y entrega en el mismo día dentro de la ciudad." },
  { icon: Shield,   title: "Paquetes seguros",      desc: "Tus paquetes están asegurados durante todo el trayecto." },
  { icon: MapPin,   title: "Seguimiento en tiempo real", desc: "Sigue tu paquete desde la recogida hasta la entrega." },
  { icon: Package,  title: "Cualquier tamaño",      desc: "Documentos, paquetes pequeños o envíos grandes." },
];

export default function DeliveriesPage() {
  const [form, setForm] = useState({
    senderName: "", senderPhone: "", senderEmail: "",
    pickupAddress: "", pickupCity: "",
    dropoffAddress: "", dropoffCity: "",
    packageDesc: "", packageWeight: "",
  });
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "success" : "error");
    } catch { setState("error"); }
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-carbon pt-24 pb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta/6 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full text-terracotta text-xs font-medium mb-6">
              <Package className="h-3 w-3" /> Entregas locales
            </div>
            <h1 className="text-5xl font-display font-bold text-cream mb-4">
              Envía paquetes<br />
              <span className="gradient-text">a cualquier lugar</span>
            </h1>
            <p className="text-cream/60 text-lg mb-8">
              Servicio de mensajería y paquetería local en Guinea Ecuatorial. Rápido, seguro y confiable.
            </p>
            <a href="#request"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full transition-colors btn-press">
              Solicitar entrega <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-py bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
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

      {/* Request form */}
      <section id="request" className="section-py bg-ink">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-display font-bold text-cream mb-3">Solicitar entrega</h2>
            <p className="text-cream/50">Completa el formulario y te contactaremos en minutos.</p>
          </div>

          {state === "success" ? (
            <div className="bg-white/6 border border-white/10 rounded-2xl p-10 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cream mb-2">¡Solicitud enviada!</h3>
              <p className="text-cream/60">Nuestro equipo te contactará pronto para confirmar los detalles.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/4 border border-white/8 rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-cream/60 mb-1.5">Tu nombre *</label>
                  <input required type="text" value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cream/60 mb-1.5">Teléfono *</label>
                  <input required type="tel" value={form.senderPhone}
                    onChange={(e) => setForm({ ...form, senderPhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-cream/60 mb-1.5">Correo (opcional)</label>
                <input type="email" value={form.senderEmail}
                  onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
              </div>

              <div className="border-t border-white/8 pt-4">
                <p className="text-xs font-semibold text-cream/50 uppercase tracking-wider mb-3">Recogida</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-cream/60 mb-1.5">Ciudad *</label>
                    <select required value={form.pickupCity}
                      onChange={(e) => setForm({ ...form, pickupCity: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream focus:outline-none focus:border-terracotta/50">
                      <option value="">Seleccionar</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/60 mb-1.5">Dirección *</label>
                    <input required type="text" value={form.pickupAddress}
                      onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/8 pt-4">
                <p className="text-xs font-semibold text-cream/50 uppercase tracking-wider mb-3">Entrega</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-cream/60 mb-1.5">Ciudad *</label>
                    <select required value={form.dropoffCity}
                      onChange={(e) => setForm({ ...form, dropoffCity: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream focus:outline-none focus:border-terracotta/50">
                      <option value="">Seleccionar</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/60 mb-1.5">Dirección *</label>
                    <input required type="text" value={form.dropoffAddress}
                      onChange={(e) => setForm({ ...form, dropoffAddress: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-cream/60 mb-1.5">Descripción del paquete</label>
                  <input type="text" value={form.packageDesc}
                    onChange={(e) => setForm({ ...form, packageDesc: e.target.value })}
                    placeholder="Ej: Documentos, ropa..."
                    className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-cream/60 mb-1.5">Peso aprox.</label>
                  <input type="text" value={form.packageWeight}
                    onChange={(e) => setForm({ ...form, packageWeight: e.target.value })}
                    placeholder="Ej: 2 kg"
                    className="w-full px-4 py-2.5 bg-white/6 border border-white/10 rounded-xl text-sm text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50" />
                </div>
              </div>

              {state === "error" && (
                <p className="text-red-400 text-sm">Error al enviar. Inténtalo de nuevo.</p>
              )}

              <button type="submit" disabled={state === "loading"}
                className="w-full py-3.5 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-bold rounded-full transition-colors btn-press flex items-center justify-center gap-2">
                {state === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : "Solicitar entrega"}
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
