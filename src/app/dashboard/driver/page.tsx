"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Car, MapPin, Zap, TrendingUp, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DriverDashboard() {
  const { data: session, status } = useSession();
  const { locale } = useLanguage();
  if (status === "loading") return <div className="min-h-screen bg-carbon flex items-center justify-center"><div className="text-cream">Cargando...</div></div>;
  if (!session) redirect("/auth/signin");

  const isSpanish = locale === "es";
  const menuItems = isSpanish
    ? [
        { icon: MapPin, label: "Solicitudes de viaje", href: "#", description: "Nuevos viajes" },
        { icon: Car, label: "Vehículo", href: "#", description: "Mi vehículo" },
        { icon: Zap, label: "Estado/Disponibilidad", href: "#", description: "Cambiar estado" },
        { icon: TrendingUp, label: "Ganancias", href: "#", description: "Próximamente" },
        { icon: User, label: "Perfil", href: "#", description: "Mi información" },
      ]
    : [
        { icon: MapPin, label: "Ride requests", href: "#", description: "New rides" },
        { icon: Car, label: "Vehicle", href: "#", description: "My vehicle" },
        { icon: Zap, label: "Status/Availability", href: "#", description: "Change status" },
        { icon: TrendingUp, label: "Earnings", href: "#", description: "Coming soon" },
        { icon: User, label: "Profile", href: "#", description: "My information" },
      ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-carbon mb-2">{isSpanish ? "Panel Conductor" : "Driver Dashboard"}</h1>
          <p className="text-carbon/60">{isSpanish ? "Gestiona tus viajes" : "Manage your rides"}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map(({ icon: Icon, label, href, description }) => (
            <Link key={label} href={href} className="bg-white rounded-xl border border-carbon/8 p-6 hover:border-terracotta/40 hover:shadow-lg transition-all duration-300 group">
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
      </div>
    </div>
  );
}
