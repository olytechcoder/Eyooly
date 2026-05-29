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
    const [
      totalListings,
      pendingListings,
      approvedListings,
      rejectedListings,
      totalUsers,
      totalWaitlist,
      totalRequests,
      pendingRequests,
      totalMessages,
    ] = await Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { status: "PENDING" } }),
      prisma.listing.count({ where: { status: "APPROVED" } }),
      prisma.listing.count({ where: { status: "REJECTED" } }),
      prisma.user.count(),
      prisma.waitlistLead.count(),
      prisma.request.count(),
      prisma.request.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count(),
    ]);

    return NextResponse.json({
      listings: { total: totalListings, pending: pendingListings, approved: approvedListings, rejected: rejectedListings },
      users:    { total: totalUsers },
      waitlist: { total: totalWaitlist },
      requests: { total: totalRequests, pending: pendingRequests },
      messages: { total: totalMessages },
    });
  } catch (err) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json({ error: "Error al obtener estadísticas." }, { status: 500 });
  }
}
