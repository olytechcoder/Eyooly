import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/rides — create a ride request
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, pickup, dropoff, notes } = body;

    if (!name || !phone || !pickup) {
      return NextResponse.json({ error: "Nombre, teléfono y punto de recogida son obligatorios." }, { status: 400 });
    }

    const request = await prisma.request.create({
      data: {
        type:    "RIDE",
        name:    String(name).trim(),
        phone:   String(phone).trim(),
        email:   email   ? String(email).trim()   : null,
        pickup:  String(pickup).trim(),
        dropoff: dropoff ? String(dropoff).trim() : null,
        notes:   notes   ? String(notes).trim()   : null,
        status:  "PENDING",
      },
    });

    // Notify admin via Resend
    notifyAdmin(request).catch(console.error);

    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    console.error("[POST /api/rides]", err);
    return NextResponse.json({ error: "Error al crear la solicitud de viaje." }, { status: 500 });
  }
}

async function notifyAdmin(req: { id: number; name: string; phone: string; pickup: string; dropoff: string | null }) {
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!resendKey || !adminEmail) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      adminEmail,
      subject: `🚗 Nueva solicitud de Viaje #${req.id} — Eyooly`,
      html: `<h3>Nueva solicitud de Viaje</h3>
             <p><strong>Nombre:</strong> ${req.name}</p>
             <p><strong>Teléfono:</strong> ${req.phone}</p>
             <p><strong>Recogida:</strong> ${req.pickup}</p>
             ${req.dropoff ? `<p><strong>Destino:</strong> ${req.dropoff}</p>` : ""}
             <p><a href="${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/admin">Ver en el panel</a></p>`,
    }),
  });
}
