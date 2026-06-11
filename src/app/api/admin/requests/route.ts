import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RequestType, RequestStatus } from "@prisma/client";

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
    const type   = searchParams.get("type") ?? "";
    const status = searchParams.get("status") ?? "";
    const page   = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit  = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
    const skip   = (page - 1) * limit;

    const where: any = {};
    if (type && Object.values(RequestType).includes(type as RequestType)) {
      where.type = type as RequestType;
    }
    if (status && Object.values(RequestStatus).includes(status as RequestStatus)) {
      where.status = status as RequestStatus;
    }

    const [requests, total] = await Promise.all([
      prisma.request.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.request.count({ where }),
    ]);

    return NextResponse.json({ requests, total, page, limit });
  } catch (err) {
    console.error("[GET /api/admin/requests]", err);
    return NextResponse.json({ error: "Error al obtener las solicitudes." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status || !Object.values(RequestStatus).includes(status as RequestStatus)) {
      return NextResponse.json({ error: "ID y estado válido son obligatorios." }, { status: 400 });
    }

    const request = await prisma.request.update({
      where: { id: parseInt(id) },
      data:  { status: status as RequestStatus },
    });

    return NextResponse.json(request);
  } catch (err) {
    console.error("[PATCH /api/admin/requests]", err);
    return NextResponse.json({ error: "Error al actualizar la solicitud." }, { status: 500 });
  }
}
