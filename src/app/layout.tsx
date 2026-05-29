import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "Eyooly — Tu mercado local en Guinea Ecuatorial",
    template: "%s | Eyooly",
  },
  description:
    "Eyooly es la plataforma local de Guinea Ecuatorial para comprar, vender, enviar paquetes, pedir comida y solicitar viajes.",
  keywords: ["mercado", "Guinea Ecuatorial", "Malabo", "Bata", "comprar", "vender", "entregas", "viajes"],
  authors: [{ name: "Eyooly" }],
  creator: "Eyooly",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://eyooly.com"),
  openGraph: {
    type: "website",
    locale: "es_GQ",
    url: "https://eyooly.com",
    siteName: "Eyooly",
    title: "Eyooly — Tu mercado local en Guinea Ecuatorial",
    description:
      "Compra, vende, envía paquetes, pide comida y solicita viajes — todo desde Eyooly.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Eyooly — Tu mercado local",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eyooly — Tu mercado local en Guinea Ecuatorial",
    description: "La plataforma local de Guinea Ecuatorial.",
    creator: "@eyoooly",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/assets/eyooly-logo.png",
    shortcut: "/assets/eyooly-logo.png",
    apple: "/assets/eyooly-logo.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/assets/eyooly-logo.png" />
        <link rel="shortcut icon" href="/assets/eyooly-logo.png" />
        <link rel="apple-touch-icon" href="/assets/eyooly-logo.png" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
