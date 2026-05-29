"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Apple, Play } from "lucide-react";

// ─── Inline SVG social icons ─────────────────────────────────────────────────
// Using official brand-accurate SVG paths — no external dependency needed.

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

// ─── Social link data ─────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
  {
    href:       "https://linkedin.com/company/eyoooly",
    label:      "Eyooly on LinkedIn",
    Icon:       LinkedInIcon,
  },
  {
    href:       "https://x.com/eyoooly",
    label:      "Eyooly on X",
    Icon:       XIcon,
  },
  {
    href:       "https://instagram.com/eyoooly",
    label:      "Eyooly on Instagram",
    Icon:       InstagramIcon,
  },
  {
    href:       "https://facebook.com/eyoooly",
    label:      "Eyooly on Facebook",
    Icon:       FacebookIcon,
  },
];

// ─── Social icon button ───────────────────────────────────────────────────────

function SocialButton({
  href,
  label,
  Icon,
}: {
  href: string;
  label: string;
  Icon: React.FC<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={[
        "group w-10 h-10 rounded-full flex items-center justify-center",
        "bg-white/8 border border-white/10",
        "text-cream/60",
        "hover:bg-terracotta/20 hover:border-terracotta/40 hover:text-terracotta",
        "transition-all duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/60",
      ].join(" ")}
    >
      <Icon className="w-5 h-5 transition-colors duration-300" />
    </a>
  );
}

// ─── App Store Badge Component ────────────────────────────────────────────────

function AppStoreBadge({
  platform,
  href,
}: {
  platform: "apple" | "google";
  href: string;
}) {
  const isApple = platform === "apple";
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white/8 border border-white/10 rounded-xl hover:bg-white/12 hover:border-white/20 transition-all duration-300 group"
    >
      {isApple ? (
        <Apple className="h-5 w-5 text-cream/70 group-hover:text-cream transition-colors" />
      ) : (
        <Play className="h-5 w-5 text-cream/70 group-hover:text-cream transition-colors" />
      )}
      <div className="text-left">
        <div className="text-xs text-cream/50 group-hover:text-cream/70 transition-colors">
          {isApple ? "Descargar en" : "Disponible en"}
        </div>
        <div className="text-sm font-semibold text-cream group-hover:text-cream transition-colors">
          {isApple ? "App Store" : "Google Play"}
        </div>
      </div>
    </a>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  const services = [
    { href: "/mercado",  label: t("nav.market") },
    { href: "/entregas", label: t("nav.deliveries") },
    { href: "/viajes",   label: t("nav.rides") },
    { href: "/comida",   label: t("nav.food") },
    { href: "/sellers",  label: t("nav.sellers") },
  ];

  const company = [
    { href: "/safety",   label: t("nav.safety") },
    { href: "/contact",  label: t("footer.contact") },
    { href: "/privacy",  label: t("footer.privacy") },
    { href: "/terms",    label: t("footer.terms") },
  ];

  return (
    <footer className="bg-carbon border-t border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">

          {/* ── Brand column ── */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6" aria-label="Eyooly — Inicio">
              <Image
                src="/assets/eyooly_logo.png"
                alt="Eyooly"
                width={180}
                height={54}
                className="h-12 w-auto object-contain sm:h-13 lg:h-14 transition-all duration-300"
                style={{ maxWidth: "180px" }}
              />
            </Link>

            <p className="text-cream/50 text-sm leading-relaxed max-w-xs mb-5">
              {t("footer.tagline")}
            </p>

            <div className="flex items-center gap-1.5 text-cream/40 text-sm mb-8">
              <MapPin className="h-4 w-4 text-terracotta shrink-0" />
              Malabo, Guinea Ecuatorial
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 mb-8">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <SocialButton key={label} href={href} label={label} Icon={Icon} />
              ))}
            </div>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row gap-3">
              <AppStoreBadge platform="apple" href="https://www.apple.com/app-store/" />
              <AppStoreBadge platform="google" href="https://play.google.com/store/" />
            </div>
          </div>

          {/* ── Services column ── */}
          <div>
            <h4 className="text-cream text-xs font-semibold uppercase tracking-widest mb-5">
              Servicios
            </h4>
            <ul className="space-y-3">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/50 hover:text-cream text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company column ── */}
          <div>
            <h4 className="text-cream text-xs font-semibold uppercase tracking-widest mb-5">
              Empresa
            </h4>
            <ul className="space-y-3 mb-8">
              {company.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/50 hover:text-cream text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Waitlist CTA */}
            <div className="p-4 bg-gradient-to-br from-terracotta/15 to-terracotta/5 border border-terracotta/20 rounded-xl">
              <p className="text-cream/70 text-xs mb-2.5 font-medium">Únete a la lista de espera</p>
              <Link
                href="/#waitlist"
                className="inline-flex items-center gap-1.5 text-terracotta text-sm font-semibold hover:text-terracotta/80 transition-colors duration-200"
              >
                Registrarme →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/6 my-8" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            © {year} Eyooly. {t("footer.rights")}.
          </p>

          {/* Social icons repeated in bottom bar on desktop for balance */}
          <div className="hidden sm:flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-cream/30 hover:text-terracotta transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-cream/30 hover:text-cream/60 text-xs transition-colors duration-200"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-cream/30 hover:text-cream/60 text-xs transition-colors duration-200"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
