export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { listingId, reason } = await req.json();

    if (!listingId || typeof listingId !== "number") {
      return NextResponse.json(
        { error: "ID de anuncio inválido" },
        { status: 400 }
      );
    }

    if (!reason || typeof reason !== "string" || reason.trim().length < 10) {
      return NextResponse.json(
        { error: "Por favor describe el motivo del reporte (mínimo 10 caracteres)" },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    let reporterId: string | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
      reporterId = user?.id || null;
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, title: true, sellerName: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 }
      );
    }

    const report = await prisma.report.create({
      data: {
        listingId,
        reporterId,
        reason: reason.trim(),
      },
    });

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const resendKey = process.env.RESEND_API_KEY;
    if (adminEmail && resendKey) {
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
          to: adminEmail,
          subject: `[Eyooly] Nuevo reporte de anuncio #${listing.id}`,
          html: `<h2>Nuevo reporte de anuncio</h2><p><strong>Anuncio:</strong> ${listing.title}</p><p><strong>Vendedor:</strong> ${listing.sellerName || "Desconocido"}</p><p><strong>Motivo:</strong></p><p>${reason.replace(/\n/g, "<br>")}</p><p><a href="${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/admin">Ver en panel de administración</a></p>`,
        }),
      }).catch(console.error);
    }

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/listings/report]", error);
    return NextResponse.json(
      { error: "Error al enviar el reporte" },
      { status: 500 }
    );
  }
}
