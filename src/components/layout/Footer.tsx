"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin } from "lucide-react";

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
        "group w-9 h-9 rounded-full flex items-center justify-center",
        "bg-white/6 border border-white/8",
        "text-[#f5f2ed]/60",
        "hover:bg-terracotta/15 hover:border-terracotta/30 hover:text-[#c9735a]",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/60",
      ].join(" ")}
    >
      <Icon className="w-[18px] h-[18px] transition-colors duration-200" />
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Brand column ── */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-5" aria-label="Eyooly — Inicio">
              <Image
                src="/assets/eyooly_logo.png"
                alt="Eyooly"
                width={180}
                height={54}
                className="h-12 w-auto object-contain sm:h-13 lg:h-14"
                style={{ maxWidth: "180px" }}
              />
            </Link>

            <p className="text-cream/50 text-sm leading-relaxed max-w-xs mb-4">
              {t("footer.tagline")}
            </p>

            <div className="flex items-center gap-1.5 text-cream/40 text-sm mb-6">
              <MapPin className="h-3.5 w-3.5 text-terracotta shrink-0" />
              Malabo, Guinea Ecuatorial
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <SocialButton key={label} href={href} label={label} Icon={Icon} />
              ))}
            </div>

            {/* Handle hint — subtle, below icons */}
            <p className="text-cream/25 text-xs mt-3 tracking-wide">@eyoooly</p>

            {/* App store badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {/* Apple App Store */}
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Descargar en App Store"
                className="flex items-center gap-2 px-3.5 py-2 bg-white/6 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/16 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-cream/70 group-hover:text-cream transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-cream/35 text-[9px] leading-none mb-0.5">Disponible en</div>
                  <div className="text-cream/80 text-xs font-semibold leading-none group-hover:text-cream transition-colors">App Store</div>
                </div>
              </a>

              {/* Google Play */}
              <a
                href="https://play.google.com/store/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Descargar en Google Play"
                className="flex items-center gap-2 px-3.5 py-2 bg-white/6 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/16 transition-all duration-200 group"
              >
                <svg className="w-5 h-5 text-cream/70 group-hover:text-cream transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.72-2.72-10.87 9.79zm-1.5-20.5c-.1.27-.17.57-.17.89v19.7c0 .32.06.62.17.89l.09.09 11.04-11.04v-.26L1.77 3.17l-.09.09zm19.07 9.26l-2.64-1.52-3.01 3.01 3.01 3.01 2.66-1.53c.76-.44.76-1.54-.02-1.97zm-17.57 9.24l12.6-7.27-2.72-2.72L3.18.24c-.35-.04-.69.03-.99.2-.72.42-.72 1.48 0 1.9l.99.62z" />
                </svg>
                <div>
                  <div className="text-cream/35 text-[9px] leading-none mb-0.5">Disponible en</div>
                  <div className="text-cream/80 text-xs font-semibold leading-none group-hover:text-cream transition-colors">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          {/* ── Services column ── */}
          <div>
            <h4 className="text-cream text-xs font-semibold uppercase tracking-widest mb-4">
              Servicios
            </h4>
            <ul className="space-y-2.5">
              {services.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/50 hover:text-cream text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company column ── */}
          <div>
            <h4 className="text-cream text-xs font-semibold uppercase tracking-widest mb-4">
              Empresa
            </h4>
            <ul className="space-y-2.5">
              {company.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/50 hover:text-cream text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Waitlist CTA */}
            <div className="mt-6 p-4 bg-terracotta/10 border border-terracotta/20 rounded-xl">
              <p className="text-cream/70 text-xs mb-2">Únete a la lista de espera</p>
              <Link
                href="/#waitlist"
                className="text-terracotta text-sm font-medium hover:text-terracotta/80 transition-colors"
              >
                Registrarme →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-12 pt-6 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            © {year} Eyooly. {t("footer.rights")}.
          </p>

          {/* Social icons repeated in bottom bar on desktop for balance */}
          <div className="hidden sm:flex items-center gap-2">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-cream/25 hover:text-[#b7baad] transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-cream/30 hover:text-cream/60 text-xs transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              href="/terms"
              className="text-cream/30 hover:text-cream/60 text-xs transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
