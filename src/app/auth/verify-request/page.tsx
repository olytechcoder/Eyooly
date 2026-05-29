import Link from "next/link";
import { Mail } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-block mb-8">
          <span className="font-display font-bold text-3xl text-cream">Eyooly</span>
        </Link>
        <div className="bg-ink border border-white/8 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-5">
            <Mail className="h-7 w-7 text-terracotta" />
          </div>
          <h1 className="text-xl font-bold text-cream mb-3">Revisa tu correo</h1>
          <p className="text-cream/60 text-sm leading-relaxed">
            Hemos enviado un enlace de acceso a tu correo electrónico. Haz clic en el enlace para iniciar sesión.
          </p>
          <p className="text-cream/30 text-xs mt-4">¿No lo ves? Revisa tu carpeta de spam.</p>
        </div>
        <Link href="/" className="block mt-6 text-cream/40 text-sm hover:text-cream/70 transition-colors">
          ← Volver al inicio
        </Link>
      </div>
    </div>
  );
}
