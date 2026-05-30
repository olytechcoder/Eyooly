"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function ErrorClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    CredentialsSignin: "Email o contraseña incorrectos",
    Callback: "Error en la devolución de llamada de autenticación",
    OAuthSignin: "Error al iniciar sesión con OAuth",
    OAuthCallback: "Error en la devolución de llamada de OAuth",
    EmailSignInError: "Error al enviar el enlace de inicio de sesión",
    SessionCallback: "Error en la devolución de llamada de sesión",
    default: "Ocurrió un error durante la autenticación",
  };

  const message = errorMessages[error || ""] || errorMessages.default;

  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-cream mb-2">Error de autenticación</h1>
        <p className="text-cream/60 mb-6">{message}</p>
        
        <div className="space-y-3">
          <Link
            href="/auth/signin"
            className="block w-full py-2 bg-terracotta hover:bg-terracotta/90 text-white font-semibold rounded-lg transition-colors"
          >
            Intentar de nuevo
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2 bg-white/8 hover:bg-white/12 text-cream font-semibold rounded-lg transition-colors border border-white/10"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
