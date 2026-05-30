"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SignInClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // NextAuth signin logic
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Sign in error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Mail className="h-12 w-12 text-terracotta mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-cream mb-2">Revisa tu email</h2>
          <p className="text-cream/60 mb-6">
            Te hemos enviado un enlace de inicio de sesión a <strong>{email}</strong>
          </p>
          <p className="text-cream/40 text-sm">
            Si no ves el email, revisa tu carpeta de spam.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-cream mb-2">Eyooly</h1>
          <p className="text-cream/60">Inicia sesión en tu cuenta</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error === "CredentialsSignin"
              ? "Email o contraseña incorrectos"
              : "Error al iniciar sesión"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cream/70 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-2 bg-white/8 border border-white/10 rounded-lg text-cream placeholder:text-cream/40 focus:outline-none focus:ring-2 focus:ring-terracotta/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-terracotta hover:bg-terracotta/90 disabled:bg-terracotta/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? "Enviando..." : "Enviar enlace de acceso"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="text-center text-cream/60 text-sm mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="text-terracotta hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
