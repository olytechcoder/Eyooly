export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const [
      totalListings,
      pendingListings,
      approvedListings,
      totalUsers,
      totalRequests,
      pendingRequests,
      totalReports,
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "PENDING" } }),
      prisma.listing.count({ where: { status: "APPROVED" } }),
      prisma.user.count(),
      prisma.request.count(),
      prisma.request.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
    ]);

    return NextResponse.json({
      listings: {
        total: totalListings,
        pending: pendingListings,
        approved: approvedListings,
      },
      users: {
        total: totalUsers,
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
      },
      reports: {
        pending: totalReports,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/stats]", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
