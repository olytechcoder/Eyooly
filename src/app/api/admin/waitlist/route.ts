import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const page  = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));
    const skip  = (page - 1) * limit;

    const [leads, total] = await Promise.all([
      prisma.waitlistLead.findMany({ orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.waitlistLead.count(),
    ]);

    return NextResponse.json({ leads, total, page, limit });
  } catch (err) {
    console.error("[GET /api/admin/waitlist]", err);
    return NextResponse.json({ error: "Error al obtener la lista de espera." }, { status: 500 });
  }
}
