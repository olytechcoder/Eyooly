import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";

function checkAdminKey(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "PENDING";
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip   = (page - 1) * limit;

    const where: any = {};
    if (status && Object.values(ListingStatus).includes(status as ListingStatus)) {
      where.status = status as ListingStatus;
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: { select: { nameEs: true, icon: true, slug: true } },
          images:   { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({ listings, total, page, limit });
  } catch (err) {
    console.error("[GET /api/admin/listings]", err);
    return NextResponse.json({ error: "Error al obtener los anuncios." }, { status: 500 });
  }
}
