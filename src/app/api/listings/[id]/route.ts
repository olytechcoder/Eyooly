import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";

// GET /api/listings/[id]  — id can be a numeric id OR a slug string
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const isNumeric = /^\d+$/.test(id);

    const listing = await prisma.listing.findFirst({
      where: isNumeric
        ? { id: parseInt(id), status: ListingStatus.APPROVED }
        : { slug: id, status: ListingStatus.APPROVED },
      include: {
        category: { select: { nameEs: true, icon: true, color: true, slug: true } },
        user:     { select: { verified: true, name: true } },
        images:   { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Anuncio no encontrado." }, { status: 404 });
    }

    // Increment view count (fire-and-forget)
    prisma.listing
      .update({ where: { id: listing.id }, data: { views: { increment: 1 } } })
      .catch(() => {});

    return NextResponse.json(listing);
  } catch (err) {
    console.error("[GET /api/listings/[id]]", err);
    return NextResponse.json({ error: "Error al obtener el anuncio." }, { status: 500 });
  }
}

// PATCH /api/listings/[id]  — admin only (checked via ADMIN_SECRET header)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("x-admin-key");
    if (!process.env.ADMIN_SECRET || authHeader !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { status, featured, adminNote } = body;

    const listing = await prisma.listing.update({
      where: { id: parseInt(params.id) },
      data: {
        ...(status && { status: status as ListingStatus }),
        ...(featured !== undefined && { featured }),
      },
    });

    if (adminNote) {
      await prisma.adminAction.create({
        data: {
          adminEmail: process.env.ADMIN_EMAIL ?? "admin@eyooly.com",
          action:     `set_status_${status ?? "updated"}`,
          targetId:   String(listing.id),
          targetType: "listing",
          note:       adminNote,
        },
      });
    }

    return NextResponse.json(listing);
  } catch (err) {
    console.error("[PATCH /api/listings/[id]]", err);
    return NextResponse.json({ error: "Error al actualizar el anuncio." }, { status: 500 });
  }
}

// DELETE /api/listings/[id]  — admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("x-admin-key");
    if (!process.env.ADMIN_SECRET || authHeader !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.listing.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/listings/[id]]", err);
    return NextResponse.json({ error: "Error al eliminar el anuncio." }, { status: 500 });
  }
}
