"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Heart, MessageSquare, ShoppingBag, MapPin, Package, Car, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const { locale } = useLanguage();

  if (status === "loading") {
    return <div className="min-h-screen bg-carbon flex items-center justify-center"><div className="text-cream">Cargando...</div></div>;
  }

  if (!session) {
    redirect("/auth/signin");
  }

  const isSpanish = locale === "es";

  const menuItems = isSpanish
    ? [
        { icon: Heart, label: "Mis favoritos", href: "#", description: "Anuncios guardados" },
        { icon: MessageSquare, label: "Mis consultas", href: "#", description: "Conversaciones con vendedores" },
        { icon: ShoppingBag, label: "Mis pedidos", href: "#", description: "Tus compras y solicitudes" },
        { icon: Package, label: "Enviar paquete", href: "/entregas", description: "Solicitar entrega" },
        { icon: Car, label: "Solicitar viaje", href: "/viajes", description: "Pedir un viaje" },
        { icon: User, label: "Perfil", href: "#", description: "Mi información" },
      ]
    : [
        { icon: Heart, label: "My favorites", href: "#", description: "Saved listings" },
        { icon: MessageSquare, label: "My inquiries", href: "#", description: "Conversations with sellers" },
        { icon: ShoppingBag, label: "My orders", href: "#", description: "Your purchases and requests" },
        { icon: Package, label: "Send package", href: "/deliveries", description: "Request delivery" },
        { icon: Car, label: "Request ride", href: "/rides", description: "Book a ride" },
        { icon: User, label: "Profile", href: "#", description: "My information" },
      ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-carbon mb-2">
            {isSpanish ? "Bienvenido" : "Welcome"}, {session.user?.name || "Usuario"}
          </h1>
          <p className="text-carbon/60">
            {isSpanish ? "Gestiona tu cuenta y accede a todos los servicios de Eyooly" : "Manage your account and access all Eyooly services"}
          </p>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(({ icon: Icon, label, href, description }) => (
            <Link
              key={label}
              href={href}
              className="bg-white rounded-xl border border-carbon/8 p-6 hover:border-terracotta/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-terracotta/10 group-hover:bg-terracotta/20 transition-colors">
                  <Icon className="w-6 h-6 text-terracotta" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-carbon mb-1">{label}</h3>
                  <p className="text-sm text-carbon/60">{description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-gradient-to-r from-terracotta/10 to-sage/10 rounded-xl border border-terracotta/20 p-8">
          <h2 className="text-xl font-bold text-carbon mb-4">
            {isSpanish ? "Próximamente" : "Coming Soon"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-terracotta" />
              <p className="text-carbon/70">{isSpanish ? "Cartera digital" : "Digital wallet"}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-terracotta" />
              <p className="text-carbon/70">{isSpanish ? "Historial de transacciones" : "Transaction history"}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-terracotta" />
              <p className="text-carbon/70">{isSpanish ? "Reseñas y calificaciones" : "Reviews and ratings"}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-terracotta" />
              <p className="text-carbon/70">{isSpanish ? "Seguimiento en tiempo real" : "Real-time tracking"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
