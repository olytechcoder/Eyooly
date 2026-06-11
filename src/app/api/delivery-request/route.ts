import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, pickup, dropoff, notes } = body;

    if (!name?.trim() || !phone?.trim() || !pickup?.trim() || !dropoff?.trim()) {
      return NextResponse.json(
        { error: "Nombre, teléfono, recogida y entrega son obligatorios." },
        { status: 400 }
      );
    }

    const request = await prisma.request.create({
      data: {
        type:    RequestType.DELIVERY,
        name:    name.trim(),
        phone:   phone.trim(),
        email:   email?.trim() ?? null,
        pickup:  pickup.trim(),
        dropoff: dropoff.trim(),
        notes:   notes?.trim() ?? null,
      },
    });

    // Notify admin
    notifyAdmin("entrega", request).catch(console.error);

    return NextResponse.json({ success: true, id: request.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/delivery-request]", err);
    return NextResponse.json({ error: "Error al enviar la solicitud." }, { status: 500 });
  }
}

async function notifyAdmin(
  type: string,
  r: { id: number; name: string; phone: string; pickup: string; dropoff?: string | null; notes?: string | null }
) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey  = process.env.RESEND_API_KEY;
  if (!adminEmail || !resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      adminEmail,
      subject: `[Eyooly] Nueva solicitud de ${type} #${r.id}`,
      html: `
        <h2>Nueva solicitud de ${type}</h2>
        <table cellpadding="6">
          <tr><td><strong>ID</strong></td><td>#${r.id}</td></tr>
          <tr><td><strong>Nombre</strong></td><td>${r.name}</td></tr>
          <tr><td><strong>Teléfono</strong></td><td>${r.phone}</td></tr>
          <tr><td><strong>Recogida</strong></td><td>${r.pickup}</td></tr>
          ${r.dropoff ? `<tr><td><strong>Entrega</strong></td><td>${r.dropoff}</td></tr>` : ""}
          ${r.notes ? `<tr><td><strong>Notas</strong></td><td>${r.notes}</td></tr>` : ""}
        </table>
        <p><a href="${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/admin">Ver en el panel de administración</a></p>
      `,
    }),
  });
}
