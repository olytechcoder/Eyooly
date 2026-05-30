export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { type, name, phone, email, pickup, dropoff, notes } = await req.json();

    // Validation
    if (!type || !Object.values(RequestType).includes(type)) {
      return NextResponse.json(
        { error: "Tipo de solicitud inválido" },
        { status: 400 }
      );
    }

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "El nombre es obligatorio" },
        { status: 400 }
      );
    }

    if (!phone || phone.trim().length < 7) {
      return NextResponse.json(
        { error: "El número de teléfono es obligatorio" },
        { status: 400 }
      );
    }

    if (!pickup || pickup.trim().length < 3) {
      return NextResponse.json(
        { error: "La ubicación de recogida es obligatoria" },
        { status: 400 }
      );
    }

    // Create request
    const request = await prisma.request.create({
      data: {
        type: type as RequestType,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        pickup: pickup.trim(),
        dropoff: dropoff?.trim() || null,
        notes: notes?.trim() || null,
      },
    });

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    if (adminEmail && resendKey) {
      const typeLabels: Record<RequestType, string> = {
        DELIVERY: "Entrega",
        RIDE: "Viaje",
        FOOD: "Comida",
      };
      const typeLabel = typeLabels[type as RequestType];

      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
          to: adminEmail,
          subject: `[Eyooly] Nueva solicitud de ${typeLabel}`,
          html: `<h2>Nueva solicitud de ${typeLabel}</h2><p><strong>Nombre:</strong> ${name}</p><p><strong>Teléfono:</strong> ${phone}</p><p><strong>Email:</strong> ${email || "No proporcionado"}</p><p><strong>Desde:</strong> ${pickup}</p>${dropoff ? `<p><strong>Hasta:</strong> ${dropoff}</p>` : ""}<p><strong>Notas:</strong> ${notes || "Ninguna"}</p><p><a href="${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/admin">Ver en panel de administración</a></p>`,
        }),
      }).catch(console.error);
    }

    return NextResponse.json({ request }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/requests]", error);
    return NextResponse.json(
      { error: "Error al crear la solicitud" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const where: any = {};
    if (type && Object.values(RequestType).includes(type as RequestType)) {
      where.type = type as RequestType;
    }
    if (status) {
      where.status = status;
    }

    const requests = await prisma.request.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.error("[GET /api/requests]", error);
    return NextResponse.json(
      { error: "Error al obtener solicitudes" },
      { status: 500 }
    );
  }
}
