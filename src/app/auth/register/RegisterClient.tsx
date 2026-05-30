"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function RegisterClient() {
  const { locale } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    accountType: "Comprador",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const t = {
    es: {
      title: "Crea tu cuenta Eyooly",
      subtitle: "Únete para comprar, vender, pedir entregas y solicitar viajes en Guinea Ecuatorial.",
      fullName: "Nombre completo",
      email: "Correo electrónico",
      whatsapp: "WhatsApp",
      accountType: "Tipo de cuenta",
      buyer: "Comprador",
      seller: "Vendedor",
      delivery: "Repartidor",
      driver: "Conductor",
      restaurant: "Restaurante / negocio",
      other: "Otro",
      createBtn: "Crear cuenta",
      hasAccount: "¿Ya tienes cuenta?",
      signIn: "Inicia sesión",
      checkEmail: "Revisa tu email",
      emailSent: "Te hemos enviado un enlace de acceso a",
      spamFolder: "Si no ves el email, revisa tu carpeta de spam.",
      emailExists: "Este correo ya está registrado. Inicia sesión para continuar.",
      error: "Error al crear la cuenta. Inténtalo de nuevo.",
    },
    en: {
      title: "Create your Eyooly account",
      subtitle: "Join to buy, sell, request deliveries, and book rides in Equatorial Guinea.",
      fullName: "Full name",
      email: "Email",
      whatsapp: "WhatsApp",
      accountType: "Account type",
      buyer: "Buyer",
      seller: "Seller",
      delivery: "Delivery rider",
      driver: "Driver",
      restaurant: "Restaurant / business",
      other: "Other",
      createBtn: "Create account",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      checkEmail: "Check your email",
      emailSent: "We sent you a sign-in link to",
      spamFolder: "If you don't see the email, check your spam folder.",
      emailExists: "This email is already registered. Sign in to continue.",
      error: "Error creating account. Please try again.",
    },
  };

  const texts = t[locale as keyof typeof t] || t.es;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409) {
        // Email already exists
        setError("emailExists");
      } else if (res.ok) {
        setSubmitted(true);
      } else {
        setError("error");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("error");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Mail className="h-12 w-12 text-terracotta mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cream mb-2">{texts.checkEmail}</h2>
          <p className="text-cream/60 mb-2">
            {texts.emailSent} <strong>{formData.email}</strong>
          </p>
          <p className="text-cream/40 text-sm mb-6">{texts.spamFolder}</p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-2 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-lg transition-colors"
          >
            {texts.signIn}
          </Link>
        </div>
      </div>
    );
  }

  if (error === "emailExists") {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-terracotta mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cream mb-2">{texts.emailExists}</h2>
          <Link
            href="/auth/signin"
            className="inline-block mt-6 px-6 py-2 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-lg transition-colors"
          >
            {texts.signIn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cream mb-2">{texts.title}</h1>
          <p className="text-cream/60 text-sm">{texts.subtitle}</p>
        </div>

        {error && error !== "emailExists" && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {texts.error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              {texts.fullName}
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder={texts.fullName}
              required
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              {texts.email}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={texts.email}
              required
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              {texts.whatsapp}
            </label>
            <input
              type="tel"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="+240..."
              required
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              {texts.accountType}
            </label>
            <select
              value={formData.accountType}
              onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            >
              <option value="Comprador" className="bg-carbon">{texts.buyer}</option>
              <option value="Vendedor" className="bg-carbon">{texts.seller}</option>
              <option value="Repartidor" className="bg-carbon">{texts.delivery}</option>
              <option value="Conductor" className="bg-carbon">{texts.driver}</option>
              <option value="Restaurante" className="bg-carbon">{texts.restaurant}</option>
              <option value="Otro" className="bg-carbon">{texts.other}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-terracotta hover:bg-terracotta/90 disabled:bg-terracotta/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "..." : texts.createBtn}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="text-center text-cream/60 text-sm mt-6">
          {texts.hasAccount}{" "}
          <Link href="/auth/signin" className="text-terracotta hover:underline">
            {texts.signIn}
          </Link>
        </p>
      </div>
    </div>
  );
}
