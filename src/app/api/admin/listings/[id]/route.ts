import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus } from "@prisma/client";

function checkAdminKey(req: NextRequest) {
  const key = req.headers.get("x-admin-key");
  return !!process.env.ADMIN_SECRET && key === process.env.ADMIN_SECRET;
}

// PATCH /api/admin/listings/[id]  — approve, reject, feature, unfeature
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { action, note } = body;

    const statusMap: Record<string, ListingStatus> = {
      approve: ListingStatus.APPROVED,
      reject:  ListingStatus.REJECTED,
      pending: ListingStatus.PENDING,
    };

    const updateData: any = {};
    if (statusMap[action]) updateData.status = statusMap[action];
    if (action === "feature")   updateData.featured = true;
    if (action === "unfeature") updateData.featured = false;

    const listing = await prisma.listing.update({
      where: { id: parseInt(params.id) },
      data:  updateData,
    });

    await prisma.adminAction.create({
      data: {
        adminEmail: process.env.ADMIN_EMAIL ?? "admin@eyooly.com",
        action,
        targetId:   String(listing.id),
        targetType: "listing",
        note:       note ?? null,
      },
    });

    if (action === "approve" && listing.sellerEmail) {
      notifySellerApproved(listing).catch(console.error);
    }

    return NextResponse.json(listing);
  } catch (err) {
    console.error("[PATCH /api/admin/listings/[id]]", err);
    return NextResponse.json({ error: "Error al actualizar el anuncio." }, { status: 500 });
  }
}

// DELETE /api/admin/listings/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await prisma.listing.delete({ where: { id: parseInt(params.id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/listings/[id]]", err);
    return NextResponse.json({ error: "Error al eliminar el anuncio." }, { status: 500 });
  }
}

async function notifySellerApproved(listing: {
  title: string;
  slug: string;
  sellerEmail: string | null;
  sellerName: string | null;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !listing.sellerEmail) return;
  const listingUrl = `${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/mercado/${listing.slug}`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      listing.sellerEmail,
      subject: `✅ Tu anuncio "${listing.title}" ha sido aprobado en Eyooly`,
      html: `<h2>¡Tu anuncio ha sido aprobado!</h2><p>Hola ${listing.sellerName ?? ""},</p><p>Tu anuncio <strong>"${listing.title}"</strong> ya está publicado en Eyooly.</p><p><a href="${listingUrl}" style="background:#c9735a;color:#fff;padding:12px 24px;border-radius:24px;text-decoration:none;font-weight:bold;">Ver mi anuncio</a></p>`,
    }),
  });
}
