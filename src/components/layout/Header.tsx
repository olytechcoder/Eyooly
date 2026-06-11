"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, ChevronDown, Globe, User, LogOut, LayoutDashboard, Shield } from "lucide-react";
import Image from "next/image";
import { useLanguage, type Locale } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: "🇬🇶" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function Header() {
  const { data: session } = useSession();
  const { t, locale, setLocale } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/mercado",           label: t("nav.market") },
    { href: "/entregas",          label: t("nav.deliveries") },
    { href: "/viajes",            label: t("nav.rides") },
    { href: "/comida",            label: t("nav.food") },
    { href: "/sellers",           label: t("nav.sellers") },
    { href: "/safety",            label: t("nav.safety") },
  ];

  const currentLang = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;
  const isAdmin = user?.role === "admin";

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled || mobileOpen ? "glass-header" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Eyooly — Inicio">
            <Image
              src="/assets/eyooly_logo.png"
              alt="Eyooly"
              width={160}
              height={48}
              priority
              className="h-10 w-auto object-contain lg:h-11"
              style={{ maxWidth: "160px" }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-terracotta bg-terracotta/10"
                    : "text-cream/70 hover:text-cream hover:bg-white/8"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-cream hover:bg-white/8 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <ChevronDown className={cn("h-3 w-3 transition-transform", langOpen && "rotate-180")} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-ink border border-white/10 rounded-xl shadow-xl overflow-hidden w-40 py-1">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLocale(l.code); setLangOpen(false); }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition-colors",
                        locale === l.code
                          ? "text-terracotta bg-terracotta/10"
                          : "text-cream/70 hover:text-cream hover:bg-white/8"
                      )}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cream/70 hover:text-cream hover:bg-white/8 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-terracotta/20 text-terracotta text-xs font-bold flex items-center justify-center">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.name ?? "Mi cuenta"}</span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", userOpen && "rotate-180")} />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-ink border border-white/10 rounded-xl shadow-xl overflow-hidden w-48 py-1">
                    <Link href="/dashboard" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-white/8 transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-terracotta hover:bg-terracotta/10 transition-colors">
                        <Shield className="h-4 w-4" /> {t("nav.admin")}
                      </Link>
                    )}
                    <div className="border-t border-white/8 my-1" />
                    <button onClick={() => signOut({ callbackUrl: "/" })}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-white/8 transition-colors">
                      <LogOut className="h-4 w-4" /> {t("nav.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin"
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-cream/70 hover:text-cream hover:bg-white/8 transition-colors">
                {t("nav.login")}
              </Link>
            )}

            <Link href="/publicar-anuncio"
              className="px-4 py-2 rounded-full text-sm font-semibold bg-terracotta hover:bg-terracotta/90 text-white transition-colors btn-press shadow-lg shadow-terracotta/20">
              {t("nav.post")}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-cream/70 hover:text-cream hover:bg-white/8 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/8 py-4 space-y-1 animate-fade-in">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={cn(
                  "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-terracotta bg-terracotta/10"
                    : "text-cream/70 hover:text-cream hover:bg-white/8"
                )}>
                {label}
              </Link>
            ))}
            <div className="border-t border-white/8 pt-3 mt-3 space-y-1">
              {/* Language */}
              <div className="flex gap-2 px-4 pb-2">
                {LOCALES.map((l) => (
                  <button key={l.code} onClick={() => setLocale(l.code)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      locale === l.code
                        ? "bg-terracotta text-white"
                        : "bg-white/8 text-cream/60 hover:bg-white/12"
                    )}>
                    {l.flag} {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
              {session ? (
                <>
                  <Link href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-cream/70 hover:text-cream rounded-lg hover:bg-white/8">
                    <User className="h-4 w-4" /> {t("nav.dashboard")}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-terracotta rounded-lg hover:bg-terracotta/10">
                      <Shield className="h-4 w-4" /> {t("nav.admin")}
                    </Link>
                  )}
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-cream/70 hover:text-cream rounded-lg hover:bg-white/8">
                    <LogOut className="h-4 w-4" /> {t("nav.logout")}
                  </button>
                </>
              ) : (
                <Link href="/auth/signin"
                  className="block px-4 py-2.5 text-sm text-cream/70 hover:text-cream rounded-lg hover:bg-white/8">
                  {t("nav.login")}
                </Link>
              )}
              <Link href="/publicar-anuncio"
                className="block mx-4 mt-2 py-2.5 text-center rounded-full text-sm font-semibold bg-terracotta text-white">
                {t("nav.post")}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Close dropdowns on outside click */}
      {(langOpen || userOpen) && (
        <div className="fixed inset-0 z-[-1]" onClick={() => { setLangOpen(false); setUserOpen(false); }} />
      )}
    </header>
  );
}
