"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Package, ShoppingCart, Boxes, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function EcommerceVendorDashboard() {
  const { data: session, status } = useSession();
  const { locale } = useLanguage();
  if (status === "loading") return <div className="min-h-screen bg-carbon flex items-center justify-center"><div className="text-cream">Cargando...</div></div>;
  if (!session) redirect("/auth/signin");

  const isSpanish = locale === "es";
  const menuItems = isSpanish
    ? [
        { icon: Package, label: "Productos", href: "#", description: "Gestiona tu catálogo" },
        { icon: ShoppingCart, label: "Pedidos", href: "#", description: "Órdenes de clientes" },
        { icon: Boxes, label: "Inventario", href: "#", description: "Stock y disponibilidad" },
        { icon: CreditCard, label: "Pagos", href: "#", description: "Próximamente" },
        { icon: User, label: "Perfil de tienda", href: "#", description: "Mi información" },
      ]
    : [
        { icon: Package, label: "Products", href: "#", description: "Manage your catalog" },
        { icon: ShoppingCart, label: "Orders", href: "#", description: "Customer orders" },
        { icon: Boxes, label: "Inventory", href: "#", description: "Stock and availability" },
        { icon: CreditCard, label: "Payments", href: "#", description: "Coming soon" },
        { icon: User, label: "Store profile", href: "#", description: "My information" },
      ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-carbon mb-2">{isSpanish ? "Panel Ecommerce" : "Ecommerce Dashboard"}</h1>
          <p className="text-carbon/60">{isSpanish ? "Gestiona tu tienda online" : "Manage your online store"}</p>
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
