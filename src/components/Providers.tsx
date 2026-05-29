"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LanguageProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f1110",
              color: "#f5f2ed",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#c9735a", secondary: "#f5f2ed" },
            },
          }}
        />
      </LanguageProvider>
    </SessionProvider>
  );
}
