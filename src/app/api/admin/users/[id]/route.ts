import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

function checkAdminKey(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { verified, role } = body;

    const updateData: any = {};
    if (verified !== undefined) updateData.verified = Boolean(verified);
    if (role && Object.values(UserRole).includes(role as UserRole)) {
      updateData.role = role as UserRole;
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data:  updateData,
      select: { id: true, name: true, email: true, role: true, verified: true },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error("[PATCH /api/admin/users/[id]]", err);
    return NextResponse.json({ error: "Error al actualizar el usuario." }, { status: 500 });
  }
}
