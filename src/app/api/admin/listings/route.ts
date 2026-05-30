export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";

async function isAdmin(email: string | undefined) {
  if (!email) return false;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });
  return user?.role === "ADMIN";
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") || "PENDING";
    const status = statusParam as ListingStatus;

    const listings = await prisma.listing.findMany({
      where: { status },
      include: {
        category: true,
        user: { select: { name: true, email: true } },
        images: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("[GET /api/admin/listings]", error);
    return NextResponse.json(
      { error: "Error al obtener listados" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !(await isAdmin(session.user.email))) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const { listingId, status: statusParam, note } = await req.json();
    const status = statusParam as ListingStatus;

    if (!listingId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: { status },
    });

    // Log admin action
    await prisma.adminAction.create({
      data: {
        adminEmail: session.user.email,
        action: status === "APPROVED" ? "approve_listing" : "reject_listing",
        targetId: listingId.toString(),
        targetType: "listing",
        note: note || null,
      },
    });

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("[PATCH /api/admin/listings]", error);
    return NextResponse.json(
      { error: "Error al actualizar listado" },
      { status: 500 }
    );
  }
}
