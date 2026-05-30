export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, source } = body;

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo electrónico inválido." }, { status: 400 });
    }

    const existing = await prisma.waitlistLead.findUnique({ where: { email: email.trim() } });
    if (existing) {
      return NextResponse.json({ message: "Ya estás registrado en la lista de espera." }, { status: 200 });
    }

    await prisma.waitlistLead.create({
      data: {
        email:  email.trim(),
        name:   name?.trim() ?? null,
        source: source ?? "homepage",
      },
    });

    // Notify admin
    notifyAdmin(email.trim(), name?.trim()).catch(console.error);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/waitlist]", err);
    return NextResponse.json({ error: "Error al registrarse." }, { status: 500 });
  }
}

async function notifyAdmin(email: string, name?: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey  = process.env.RESEND_API_KEY;
  if (!adminEmail || !resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      adminEmail,
      subject: `[Eyooly] Nuevo registro en lista de espera`,
      html: `<h2>Nuevo registro en lista de espera</h2><p><strong>Email:</strong> ${email}</p>${name ? `<p><strong>Nombre:</strong> ${name}</p>` : ""}`,
    }),
  });
}
