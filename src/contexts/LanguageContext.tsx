"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type Locale = "es" | "en";

const translations: Record<Locale, Record<string, string>> = {
  es: {
    // Nav
    "nav.market": "Mercado",
    "nav.deliveries": "Entregas",
    "nav.rides": "Viajes",
    "nav.food": "Comida",
    "nav.sellers": "Vendedores",
    "nav.safety": "Seguridad",
    "nav.login": "Iniciar sesión",
    "nav.post": "Publicar anuncio",
    "nav.dashboard": "Mi cuenta",
    "nav.admin": "Admin",
    "nav.logout": "Cerrar sesión",
    // Hero
    "hero.badge": "Guinea Ecuatorial",
    "hero.title": "Tu mercado local,\nen un solo lugar",
    "hero.subtitle": "Compra, vende, envía paquetes, pide comida y solicita viajes — todo desde Eyooly.",
    "hero.cta.primary": "Explorar el mercado",
    "hero.cta.secondary": "Publicar anuncio",
    // Services
    "services.title": "Todo lo que necesitas",
    "services.subtitle": "Una plataforma, múltiples servicios para tu vida diaria en Guinea Ecuatorial.",
    "services.marketplace.title": "Mercado",
    "services.marketplace.desc": "Compra y vende productos, servicios y clasificados locales.",
    "services.deliveries.title": "Entregas",
    "services.deliveries.desc": "Envía y recibe paquetes en toda Guinea Ecuatorial.",
    "services.rides.title": "Viajes",
    "services.rides.desc": "Solicita un viaje seguro y cómodo en tu ciudad.",
    "services.food.title": "Comida",
    "services.food.desc": "Pide comida de tus restaurantes favoritos.",
    // Stats
    "stats.listings": "Anuncios activos",
    "stats.cities": "Ciudades",
    "stats.sellers": "Vendedores",
    "stats.deliveries": "Entregas realizadas",
    // Waitlist
    "waitlist.title": "Sé el primero en saber",
    "waitlist.subtitle": "Únete a nuestra lista de espera y recibe acceso anticipado a nuevas funciones.",
    "waitlist.placeholder": "tu@correo.com",
    "waitlist.cta": "Unirme",
    "waitlist.success": "¡Gracias! Te avisaremos pronto.",
    "waitlist.error": "Error al registrarse. Inténtalo de nuevo.",
    // Marketplace
    "marketplace.title": "Mercado",
    "marketplace.subtitle": "Descubre miles de anuncios en Guinea Ecuatorial",
    "marketplace.search": "Buscar anuncios...",
    "marketplace.all": "Todos",
    "marketplace.empty": "No se encontraron anuncios",
    "marketplace.empty.desc": "Intenta con otros filtros o sé el primero en publicar.",
    // Listing
    "listing.contact": "Contactar vendedor",
    "listing.whatsapp": "WhatsApp",
    "listing.inquiry": "Enviar consulta",
    "listing.seller": "Vendedor",
    "listing.related": "Anuncios relacionados",
    "listing.verified": "Vendedor verificado",
    // Create
    "create.title": "Publicar anuncio",
    "create.success": "¡Anuncio enviado! Será revisado pronto.",
    "create.login_required": "Debes iniciar sesión para publicar",
    // Common
    "common.back": "Volver",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.view": "Ver",
    "common.login_required": "Acceso requerido",
    // Footer
    "footer.tagline": "Tu mercado local en Guinea Ecuatorial",
    "footer.rights": "Todos los derechos reservados",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.contact": "Contacto",
  },
  en: {
    "nav.market": "Market",
    "nav.deliveries": "Deliveries",
    "nav.rides": "Rides",
    "nav.food": "Food",
    "nav.sellers": "Sellers",
    "nav.safety": "Safety",
    "nav.login": "Log in",
    "nav.post": "Post listing",
    "nav.dashboard": "My account",
    "nav.admin": "Admin",
    "nav.logout": "Log out",
    "hero.badge": "Equatorial Guinea",
    "hero.title": "Your local market,\nin one place",
    "hero.subtitle": "Buy, sell, send packages, order food and request rides — all from Eyooly.",
    "hero.cta.primary": "Explore market",
    "hero.cta.secondary": "Post listing",
    "services.title": "Everything you need",
    "services.subtitle": "One platform, multiple services for your daily life in Equatorial Guinea.",
    "services.marketplace.title": "Market",
    "services.marketplace.desc": "Buy and sell products, services and local classifieds.",
    "services.deliveries.title": "Deliveries",
    "services.deliveries.desc": "Send and receive packages across Equatorial Guinea.",
    "services.rides.title": "Rides",
    "services.rides.desc": "Request a safe, comfortable ride in your city.",
    "services.food.title": "Food",
    "services.food.desc": "Order from your favourite local restaurants.",
    "stats.listings": "Active listings",
    "stats.cities": "Cities",
    "stats.sellers": "Sellers",
    "stats.deliveries": "Deliveries made",
    "waitlist.title": "Be the first to know",
    "waitlist.subtitle": "Join our waitlist and get early access to new features.",
    "waitlist.placeholder": "your@email.com",
    "waitlist.cta": "Join",
    "waitlist.success": "Thanks! We'll notify you soon.",
    "waitlist.error": "Error signing up. Please try again.",
    "marketplace.title": "Market",
    "marketplace.subtitle": "Discover thousands of listings in Equatorial Guinea",
    "marketplace.search": "Search listings...",
    "marketplace.all": "All",
    "marketplace.empty": "No listings found",
    "marketplace.empty.desc": "Try different filters or be the first to post.",
    "listing.contact": "Contact seller",
    "listing.whatsapp": "WhatsApp",
    "listing.inquiry": "Send inquiry",
    "listing.seller": "Seller",
    "listing.related": "Related listings",
    "listing.verified": "Verified seller",
    "create.title": "Post listing",
    "create.success": "Listing submitted! It will be reviewed shortly.",
    "create.login_required": "You must log in to post a listing",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.view": "View",
    "common.login_required": "Access required",
    "footer.tagline": "Your local market in Equatorial Guinea",
    "footer.rights": "All rights reserved",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
  },

};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "es",
  setLocale: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("eyooly-locale", l);
    }
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[locale][key] ?? translations["es"][key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
