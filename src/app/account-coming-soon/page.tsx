import React from 'react';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';

export default function AccountComingSoon() {
  return (
    <div className="min-h-screen bg-carbon flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <User className="w-10 h-10 text-terracotta" />
        </div>
        <h1 className="text-3xl font-bold text-cream mb-4">Muy pronto</h1>
        <p className="text-cream/60 mb-8 leading-relaxed">
          Estamos trabajando en el portal de usuarios. Pronto podrás gestionar tus anuncios, 
          guardar favoritos y ver tus pedidos desde aquí.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-terracotta hover:text-terracotta/80 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
      </div>
    </div>
  );
}
