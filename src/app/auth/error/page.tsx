"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "Error de configuración del servidor.",
  AccessDenied: "Acceso denegado.",
  Verification: "El enlace de verificación ha expirado o ya fue usado.",
  Default: "Ocurrió un error inesperado.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default;

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <span className="font-display font-bold text-3xl text-cream">Eyooly</span>
        </Link>
        <div className="bg-ink border border-white/8 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="h-7 w-7 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-cream mb-3">Error de autenticación</h1>
          <p className="text-cream/60 text-sm mb-6">{message}</p>
          <Link href="/auth/signin"
            className="inline-block px-6 py-2.5 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-full text-sm transition-colors">
            Intentar de nuevo
          </Link>
        </div>
        <Link href="/" className="block mt-6 text-cream/40 text-sm hover:text-cream/70 transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
