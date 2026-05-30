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
    accountType: locale === "es" ? "Comprador" : "Buyer",
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
      buyer: "Comprador / Usuario",
      marketplaceVendor: "Vendedor de marketplace",
      ecommerceVendor: "Vendedor ecommerce",
      restaurant: "Restaurante / negocio de comida",
      dispatch: "Repartidor / dispatch",
      driver: "Conductor",
      createBtn: "Crear cuenta",
      hasAccount: "¿Ya tienes cuenta?",
      signIn: "Inicia sesión",
      checkEmail: "Revisa tu email",
      emailSent: "Te hemos enviado un enlace de acceso a",
      spamFolder: "Si no ves el email, revisa tu carpeta de spam.",
      emailExists: "Este correo ya está registrado. Inicia sesión para continuar.",
      accountCreated: "Cuenta creada. Te hemos enviado un enlace de acceso por correo.",
      emailFailed: "Tu cuenta fue creada, pero no pudimos enviar el correo de acceso. Inténtalo desde Iniciar sesión.",
      error: "Error al crear la cuenta. Inténtalo de nuevo.",
      invalidEmail: "Por favor ingresa un correo válido.",
      invalidPhone: "Por favor ingresa un WhatsApp válido.",
      required: "Este campo es obligatorio.",
    },
    en: {
      title: "Create your Eyooly account",
      subtitle: "Join to buy, sell, request deliveries, and book rides in Equatorial Guinea.",
      fullName: "Full name",
      email: "Email",
      whatsapp: "WhatsApp",
      accountType: "Account type",
      buyer: "Buyer / User",
      marketplaceVendor: "Marketplace vendor",
      ecommerceVendor: "Ecommerce vendor",
      restaurant: "Restaurant / food business",
      dispatch: "Dispatch / delivery partner",
      driver: "Driver",
      createBtn: "Create account",
      hasAccount: "Already have an account?",
      signIn: "Sign in",
      checkEmail: "Check your email",
      emailSent: "We sent you a sign-in link to",
      spamFolder: "If you don't see the email, check your spam folder.",
      emailExists: "This email is already registered. Sign in to continue.",
      accountCreated: "Account created. We sent you a sign-in link by email.",
      emailFailed: "Your account was created, but we could not send the access email. Try again from Sign in.",
      error: "Error creating account. Please try again.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid WhatsApp number.",
      required: "This field is required.",
    },
  };

  const texts = t[locale as keyof typeof t] || t.es;

  const accountTypeOptions = locale === "es" 
    ? [
        { value: "Comprador", label: texts.buyer },
        { value: "Vendedor de marketplace", label: texts.marketplaceVendor },
        { value: "Vendedor ecommerce", label: texts.ecommerceVendor },
        { value: "Restaurante / negocio de comida", label: texts.restaurant },
        { value: "Repartidor / dispatch", label: texts.dispatch },
        { value: "Conductor", label: texts.driver },
      ]
    : [
        { value: "Buyer", label: texts.buyer },
        { value: "Marketplace vendor", label: texts.marketplaceVendor },
        { value: "Ecommerce vendor", label: texts.ecommerceVendor },
        { value: "Restaurant / food business", label: texts.restaurant },
        { value: "Dispatch / delivery partner", label: texts.dispatch },
        { value: "Driver", label: texts.driver },
      ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.fullName.trim()) {
      setError("required");
      setLoading(false);
      return;
    }
    if (!formData.email.includes("@")) {
      setError("invalidEmail");
      setLoading(false);
      return;
    }
    if (formData.whatsapp.length < 10) {
      setError("invalidPhone");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 409) {
        setError("emailExists");
      } else if (res.ok) {
        setSubmitted(true);
      } else if (res.status === 500 && data.error?.includes("email")) {
        setError("emailFailed");
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
      <div className="min-h-screen bg-carbon flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-carbon/8 p-8 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-terracotta/10 border border-terracotta/20 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-terracotta" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-carbon mb-2">{texts.checkEmail}</h2>
              <p className="text-carbon/60">
                {texts.emailSent} <span className="font-medium text-carbon">{formData.email}</span>
              </p>
            </div>
            {error === "emailFailed" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{texts.emailFailed}</p>
              </div>
            )}
            <p className="text-sm text-carbon/50">{texts.spamFolder}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              {locale === "es" ? "Volver al inicio" : "Back to home"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-carbon via-ink to-carbon flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-carbon/8 p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-carbon mb-2">{texts.title}</h1>
            <p className="text-carbon/60 text-sm">{texts.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                {texts.fullName}
              </label>
              <input
                type="text"
                placeholder="Juan Pérez"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-carbon/10 bg-cream/50 text-carbon placeholder-carbon/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-transparent transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                {texts.email}
              </label>
              <input
                type="email"
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-carbon/10 bg-cream/50 text-carbon placeholder-carbon/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-transparent transition-all"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                {texts.whatsapp}
              </label>
              <input
                type="tel"
                placeholder="+240 555 123 456"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-carbon/10 bg-cream/50 text-carbon placeholder-carbon/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-transparent transition-all"
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-carbon mb-2">
                {texts.accountType}
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-carbon/10 bg-cream/50 text-carbon focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-transparent transition-all"
              >
                {accountTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  {texts[error as keyof typeof texts] || texts.error}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta/90 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {locale === "es" ? "Creando..." : "Creating..."}
                </>
              ) : (
                <>
                  {texts.createBtn}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-carbon/60 text-sm">
              {texts.hasAccount}{" "}
              <Link href="/auth/signin" className="text-terracotta hover:text-terracotta/80 font-semibold transition-colors">
                {texts.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
