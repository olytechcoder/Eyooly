"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type Locale = "es" | "en" | "fr";

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
  fr: {
    "nav.market": "Marché",
    "nav.deliveries": "Livraisons",
    "nav.rides": "Trajets",
    "nav.food": "Nourriture",
    "nav.sellers": "Vendeurs",
    "nav.safety": "Sécurité",
    "nav.login": "Se connecter",
    "nav.post": "Publier une annonce",
    "nav.dashboard": "Mon compte",
    "nav.admin": "Admin",
    "nav.logout": "Se déconnecter",
    "hero.badge": "Guinée Équatoriale",
    "hero.title": "Votre marché local,\nen un seul endroit",
    "hero.subtitle": "Achetez, vendez, envoyez des colis, commandez de la nourriture et demandez des trajets — tout depuis Eyooly.",
    "hero.cta.primary": "Explorer le marché",
    "hero.cta.secondary": "Publier une annonce",
    "services.title": "Tout ce dont vous avez besoin",
    "services.subtitle": "Une plateforme, plusieurs services pour votre vie quotidienne en Guinée Équatoriale.",
    "services.marketplace.title": "Marché",
    "services.marketplace.desc": "Achetez et vendez des produits, services et petites annonces locales.",
    "services.deliveries.title": "Livraisons",
    "services.deliveries.desc": "Envoyez et recevez des colis partout en Guinée Équatoriale.",
    "services.rides.title": "Trajets",
    "services.rides.desc": "Demandez un trajet sûr et confortable dans votre ville.",
    "services.food.title": "Nourriture",
    "services.food.desc": "Commandez dans vos restaurants locaux préférés.",
    "stats.listings": "Annonces actives",
    "stats.cities": "Villes",
    "stats.sellers": "Vendeurs",
    "stats.deliveries": "Livraisons effectuées",
    "waitlist.title": "Soyez le premier informé",
    "waitlist.subtitle": "Rejoignez notre liste d'attente et obtenez un accès anticipé aux nouvelles fonctionnalités.",
    "waitlist.placeholder": "votre@email.com",
    "waitlist.cta": "Rejoindre",
    "waitlist.success": "Merci ! Nous vous informerons bientôt.",
    "waitlist.error": "Erreur lors de l'inscription. Veuillez réessayer.",
    "marketplace.title": "Marché",
    "marketplace.subtitle": "Découvrez des milliers d'annonces en Guinée Équatoriale",
    "marketplace.search": "Rechercher des annonces...",
    "marketplace.all": "Tous",
    "marketplace.empty": "Aucune annonce trouvée",
    "marketplace.empty.desc": "Essayez d'autres filtres ou soyez le premier à publier.",
    "listing.contact": "Contacter le vendeur",
    "listing.whatsapp": "WhatsApp",
    "listing.inquiry": "Envoyer une demande",
    "listing.seller": "Vendeur",
    "listing.related": "Annonces similaires",
    "listing.verified": "Vendeur vérifié",
    "create.title": "Publier une annonce",
    "create.success": "Annonce soumise ! Elle sera examinée prochainement.",
    "create.login_required": "Vous devez vous connecter pour publier",
    "common.back": "Retour",
    "common.loading": "Chargement...",
    "common.error": "Une erreur s'est produite",
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.view": "Voir",
    "common.login_required": "Accès requis",
    "footer.tagline": "Votre marché local en Guinée Équatoriale",
    "footer.rights": "Tous droits réservés",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
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
