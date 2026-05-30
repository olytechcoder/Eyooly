"use client";

import { useState } from "react";
import PublicLayout from "@/components/layout/PublicLayout";
import { Mail, Phone, MapPin, CheckCircle2, Loader2, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "success" : "error");
    } catch { setState("error"); }
  };

  return (
    <PublicLayout>
      <section className="bg-carbon pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-display font-bold text-cream mb-4">Contacto</h1>
          <p className="text-cream/60 text-lg">Estamos aquí para ayudarte. Escríbenos.</p>
        </div>
      </section>

      <section className="section-py bg-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="space-y-5">
              {[
                { icon: Mail,    title: "Email",     value: "hola@eyooly.com", href: "mailto:hola@eyooly.com" },
                { icon: Phone,   title: "WhatsApp",  value: "+240 555 271 524", href: "https://wa.me/240555271524" },
                { icon: Mail,    title: "Soporte",   value: "ayud@eyooly.com", href: "mailto:ayud@eyooly.com" },
              ].map(({ icon: Icon, title, value, href }) => (
                <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-terracotta" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-carbon/50 mb-0.5">{title}</p>
                    <p className="text-carbon font-medium text-sm">{value}</p>
                  </div>
                </a>
              ))}

              <div className="pt-4 border-t border-carbon/8">
                <p className="text-xs font-medium text-carbon/50 mb-3">Síguenos</p>
                <div className="flex gap-3">
                  {["Instagram", "Facebook", "TikTok"].map((s) => (
                    <a key={s} href="#" className="px-3 py-1.5 bg-carbon/5 hover:bg-carbon/10 rounded-lg text-xs font-medium text-carbon/70 transition-colors">
                      {s}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {state === "success" ? (
                <div className="bg-white rounded-2xl border border-carbon/8 p-10 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-carbon mb-2">¡Mensaje enviado!</h3>
                  <p className="text-carbon/60">Te responderemos en menos de 24 horas.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-carbon/8 p-6 sm:p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-carbon mb-1.5">Nombre *</label>
                      <input required type="text" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-carbon mb-1.5">Email *</label>
                      <input required type="email" value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-carbon mb-1.5">Asunto</label>
                    <input type="text" value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-carbon mb-1.5">Mensaje *</label>
                    <textarea required rows={5} value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-carbon/4 border border-carbon/10 rounded-xl text-sm text-carbon focus:outline-none focus:border-terracotta/50 resize-none" />
                  </div>
                  {state === "error" && (
                    <p className="text-red-500 text-sm">Error al enviar. Inténtalo de nuevo.</p>
                  )}
                  <button type="submit" disabled={state === "loading"}
                    className="w-full py-3 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 text-white font-semibold rounded-full transition-colors btn-press flex items-center justify-center gap-2">
                    {state === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</> : <><MessageSquare className="h-4 w-4" /> Enviar mensaje</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
