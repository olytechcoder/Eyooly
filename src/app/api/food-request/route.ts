export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, pickup, notes } = body;

    if (!name?.trim() || !phone?.trim() || !pickup?.trim()) {
      return NextResponse.json(
        { error: "Nombre, teléfono y dirección de entrega son obligatorios." },
        { status: 400 }
      );
    }

    const request = await prisma.request.create({
      data: {
        type:   RequestType.FOOD,
        name:   name.trim(),
        phone:  phone.trim(),
        email:  email?.trim() ?? null,
        pickup: pickup.trim(),
        notes:  notes?.trim() ?? null,
      },
    });

    notifyAdmin(request).catch(console.error);

    return NextResponse.json({ success: true, id: request.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/food-request]", err);
    return NextResponse.json({ error: "Error al enviar el pedido." }, { status: 500 });
  }
}

async function notifyAdmin(r: { id: number; name: string; phone: string; pickup: string; notes?: string | null }) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey  = process.env.RESEND_API_KEY;
  if (!adminEmail || !resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      adminEmail,
      subject: `[Eyooly] Nuevo pedido de comida #${r.id}`,
      html: `<h2>Nuevo pedido de comida</h2><table cellpadding="6"><tr><td><strong>ID</strong></td><td>#${r.id}</td></tr><tr><td><strong>Nombre</strong></td><td>${r.name}</td></tr><tr><td><strong>Teléfono</strong></td><td>${r.phone}</td></tr><tr><td><strong>Dirección</strong></td><td>${r.pickup}</td></tr>${r.notes ? `<tr><td><strong>Pedido</strong></td><td>${r.notes}</td></tr>` : ""}</table><p><a href="${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/admin">Ver en el panel</a></p>`,
    }),
  });
}
