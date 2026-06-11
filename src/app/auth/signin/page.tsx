"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await signIn("email", {
        email: email.trim(),
        callbackUrl,
        redirect: false,
      });
      if (res?.error) {
        setError("Error al enviar el enlace. Verifica tu correo e inténtalo de nuevo.");
      } else {
        setSent(true);
      }
    } catch {
      setError("Error inesperado. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display font-bold text-3xl text-cream">Eyooly</span>
          </Link>
          <p className="text-cream/40 text-sm mt-2">Guinea Ecuatorial</p>
        </div>

        <div className="bg-ink border border-white/8 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-5">
                <Mail className="h-7 w-7 text-terracotta" />
              </div>
              <h2 className="text-xl font-bold text-cream mb-3">¡Revisa tu correo!</h2>
              <p className="text-cream/60 text-sm leading-relaxed mb-6">
                Hemos enviado un enlace de acceso a{" "}
                <strong className="text-cream">{email}</strong>. Haz clic en el enlace para iniciar sesión.
              </p>
              <p className="text-cream/30 text-xs">
                ¿No lo ves? Revisa tu carpeta de spam.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="mt-4 text-terracotta text-sm hover:text-terracotta/80 transition-colors"
              >
                Usar otro correo
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-cream mb-2">Iniciar sesión</h1>
              <p className="text-cream/50 text-sm mb-6">
                Introduce tu correo y te enviaremos un enlace mágico para acceder sin contraseña.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-cream/70 mb-1.5">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cream/30" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-cream placeholder-cream/30 focus:outline-none focus:border-terracotta/50 focus:ring-1 focus:ring-terracotta/30 transition-colors text-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-terracotta hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors btn-press"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    <>Enviar enlace mágico <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="text-cream/30 text-xs text-center mt-5">
                Al continuar, aceptas nuestros{" "}
                <Link href="/terms" className="text-cream/50 hover:text-cream underline">Términos</Link>
                {" "}y{" "}
                <Link href="/privacy" className="text-cream/50 hover:text-cream underline">Política de privacidad</Link>.
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-cream/40 text-sm hover:text-cream/70 transition-colors">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
