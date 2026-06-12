import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { reporterId, reason } = body;

    if (!reason?.trim()) {
      return NextResponse.json({ error: "El motivo es obligatorio." }, { status: 400 });
    }

    const listingId = parseInt(id);
    if (isNaN(listingId)) {
      return NextResponse.json({ error: "ID de anuncio inválido." }, { status: 400 });
    }

    const report = await prisma.listingReport.create({
      data: {
        listingId,
        reporterId: reporterId ?? undefined,
        reason: reason.trim(),
      },
    });

    return NextResponse.json({ success: true, id: report.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/listings/[id]/report]", error);
    return NextResponse.json({ error: "Error al enviar el reporte." }, { status: 500 });
  }
}
