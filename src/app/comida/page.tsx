"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, UtensilsCrossed, Clock, MapPin, Star } from "lucide-react";

export default function ComidaPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.pickup.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/food-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "FOOD" }),
      });
      if (!res.ok) throw new Error("Error al enviar la solicitud.");
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message ?? "Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-carbon mb-2">¡Pedido recibido!</h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Tu pedido fue enviado. Te contactaremos al número <strong>{form.phone}</strong> para confirmar y coordinar la entrega.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors text-center">
              Volver al inicio
            </Link>
            <button
              onClick={() => { setSuccess(false); setForm({ name: "", phone: "", email: "", pickup: "", notes: "" }); }}
              className="flex-1 py-2.5 bg-terracotta text-white text-sm font-semibold rounded-full hover:bg-terracotta/90 transition-colors"
            >
              Nuevo pedido
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="bg-carbon py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-terracotta/15 mb-5">
            <UtensilsCrossed className="h-8 w-8 text-terracotta" />
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-cream mb-3">Comida Eyooly</h1>
          <p className="text-cream/50 text-sm sm:text-base max-w-xl mx-auto">
            Pide comida de tus restaurantes favoritos en Guinea Ecuatorial. Entrega a domicilio rápida y segura.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Clock, title: "Entrega en 30-60 min", desc: "Recibe tu comida caliente en casa o en la oficina." },
            { icon: Star, title: "Restaurantes locales", desc: "Los mejores restaurantes de Malabo y Bata." },
            { icon: MapPin, title: "Entrega a domicilio", desc: "Llevamos tu pedido donde estés en la ciudad." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
              <Icon className="h-7 w-7 text-terracotta mx-auto mb-3" />
              <h3 className="font-semibold text-carbon text-sm mb-1">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Coming soon notice + form */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 text-center max-w-xl mx-auto">
          <p className="text-amber-700 text-sm font-medium">
            🍽️ El servicio de comida está en fase beta. Rellena el formulario y te avisamos cuando esté disponible en tu zona.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 max-w-xl mx-auto">
          <h2 className="font-semibold text-carbon text-lg mb-6">Solicitar pedido</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Tu nombre <span className="text-red-400">*</span></label>
                <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nombre completo" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-carbon mb-1.5">Teléfono / WhatsApp <span className="text-red-400">*</span></label>
                <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+240 222 123 456" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">Correo electrónico <span className="text-gray-400 font-normal">(opcional)</span></label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@correo.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">Dirección de entrega <span className="text-red-400">*</span></label>
              <input type="text" value={form.pickup} onChange={(e) => set("pickup", e.target.value)} placeholder="Ej: Calle 12 de Octubre, Malabo" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-carbon mb-1.5">¿Qué quieres pedir? <span className="text-gray-400 font-normal">(opcional)</span></label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Ej: Pollo asado con arroz del Restaurante Central, 2 porciones..." rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-carbon placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">{error}</div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 bg-terracotta hover:bg-terracotta/90 text-white text-sm font-bold rounded-full transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Enviando pedido..." : "Solicitar pedido"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
