import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Resend } from "resend";
import prisma from "./prisma";

// Augment next-auth types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      verified?: boolean;
      phone?: string | null;
      city?: string | null;
    accountType?: string | null;
    };
  }
  interface User {
    id: string;
    role?: string;
    verified?: boolean;
    phone?: string | null;
    city?: string | null;
    accountType?: string | null;
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const { host } = new URL(url);
        try {
          await resend.emails.send({
            from: provider.from as string,
            to: [email],
            subject: `Inicia sesión en Eyooly`,
            html: magicLinkEmailHtml({ url, host, email }),
            text: magicLinkEmailText({ url, host }),
          });
        } catch (error) {
          console.error("[NextAuth] Failed to send magic link email:", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        // Fetch role and verified status from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, verified: true, phone: true, city: true, accountType: true },
        });
        if (dbUser) {
          session.user.role = dbUser.role;
          session.user.verified = dbUser.verified;
          session.user.phone = dbUser.phone;
          session.user.city = dbUser.city;
          session.user.accountType = dbUser.accountType;
        }
      }
      return session;
    },
    async signIn({ user }) {
      // Auto-promote admin email
      if (user.email && user.email === process.env.ADMIN_EMAIL) {
        try {
          await prisma.user.update({
            where: { email: user.email },
            data: { role: "ADMIN" },
          });
        } catch {
          // User may not exist yet on first sign-in; ignore
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// ─── Email templates ──────────────────────────────────────────────────────────

function magicLinkEmailHtml({
  url,
  host,
  email,
}: {
  url: string;
  host: string;
  email: string;
}): string {
  void host; void email; // used in template
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inicia sesión en Eyooly</title>
</head>
<body style="margin:0;padding:0;background:#f5f2ed;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f2ed;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#080e0a;padding:32px 40px;text-align:center;">
              <span style="font-size:24px;font-weight:700;color:#f5f2ed;letter-spacing:-0.5px;">Eyooly</span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#080e0a;">Tu enlace de acceso</h1>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Haz clic en el botón de abajo para iniciar sesión en Eyooly. Este enlace expira en 24 horas y solo puede usarse una vez.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${url}" style="display:inline-block;background:#c9735a;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:50px;">
                  Iniciar sesión →
                </a>
              </div>
              <p style="margin:0 0 8px;color:#9ca3af;font-size:13px;">
                Si no solicitaste este correo, puedes ignorarlo con seguridad.
              </p>
              <p style="margin:0;color:#9ca3af;font-size:12px;word-break:break-all;">
                O copia este enlace: <a href="${url}" style="color:#c9735a;">${url}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9f7f4;padding:20px 40px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                © ${new Date().getFullYear()} Eyooly · Guinea Ecuatorial ·
                <a href="${process.env.NEXTAUTH_URL ?? ""}/privacy" style="color:#9ca3af;">Privacidad</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function magicLinkEmailText({ url, host }: { url: string; host: string }): string {
  void host;
  return `Inicia sesión en Eyooly\n\nHaz clic en el enlace de abajo para acceder:\n${url}\n\nEste enlace expira en 24 horas.\n\nSi no solicitaste este correo, ignóralo.\n\n— El equipo de Eyooly`;
}
