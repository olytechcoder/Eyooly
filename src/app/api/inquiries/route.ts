export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/inquiries — save a listing inquiry as a ContactMessage and notify admin
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, listingId, listingTitle } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Nombre, email y mensaje son obligatorios." }, { status: 400 });
    }

    const subject = listingTitle ? `Consulta sobre: ${listingTitle}` : `Consulta sobre anuncio #${listingId ?? ""}`;

    const msg = await prisma.contactMessage.create({
      data: {
        name:    String(name).trim(),
        email:   String(email).trim(),
        subject: subject.slice(0, 200),
        message: String(message).trim(),
      },
    });

    // Notify admin via Resend
    notifyAdmin(msg, listingId).catch(console.error);

    return NextResponse.json({ success: true, id: msg.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json({ error: "Error al enviar la consulta." }, { status: 500 });
  }
}

async function notifyAdmin(
  msg: { id: number; name: string; email: string; subject: string | null; message: string },
  listingId?: number
) {
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resendKey || !adminEmail) return;

  const listingUrl = listingId
    ? `${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/mercado/${listingId}`
    : "";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      adminEmail,
      subject: `💬 Nueva consulta: ${msg.subject ?? "Anuncio"} — Eyooly`,
      html: `<h3>Nueva consulta de anuncio</h3>
             <p><strong>De:</strong> ${msg.name} (${msg.email})</p>
             <p><strong>Asunto:</strong> ${msg.subject ?? "—"}</p>
             <p><strong>Mensaje:</strong> ${msg.message}</p>
             ${listingUrl ? `<p><a href="${listingUrl}">Ver anuncio</a></p>` : ""}`,
    }),
  });
}
