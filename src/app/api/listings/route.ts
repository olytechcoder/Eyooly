import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ListingStatus, ListingType } from "@prisma/client";

// ─── Slug generator ───────────────────────────────────────────────────────────

function makeSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    Date.now().toString(36)
  );
}

// ─── GET /api/listings ────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search   = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const city     = searchParams.get("city") ?? "";
    const type     = searchParams.get("type") ?? "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const status   = searchParams.get("status") ?? "APPROVED";
    const page     = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit    = Math.min(48, parseInt(searchParams.get("limit") ?? "24"));
    const skip     = (page - 1) * limit;

    const where: any = {};

    if (status && Object.values(ListingStatus).includes(status as ListingStatus)) {
      where.status = status as ListingStatus;
    }

    if (search.trim()) {
      where.OR = [
        { title:       { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { sellerName:  { contains: search, mode: "insensitive" } },
        { city:        { contains: search, mode: "insensitive" } },
      ];
    }

    if (category.trim()) {
      where.category = { slug: category };
    }

    if (city.trim()) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (type.trim() && Object.values(ListingType).includes(type as ListingType)) {
      where.listingType = type as ListingType;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          category: { select: { nameEs: true, icon: true, slug: true } },
          user:     { select: { verified: true } },
          images:   { select: { id: true, url: true, sortOrder: true }, orderBy: { sortOrder: "asc" } },
        },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({ listings, total, page, limit });
  } catch (err) {
    console.error("[GET /api/listings]", err);
    return NextResponse.json({ error: "Error al obtener los anuncios." }, { status: 500 });
  }
}

// ─── POST /api/listings (no auth required for MVP) ───────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title, description, categorySlug, listingType,
      price, currency, city, address,
      sellerName, sellerWhatsapp, sellerEmail, imageUrl,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });
    }
    if (!sellerName?.trim()) {
      return NextResponse.json({ error: "El nombre del vendedor es obligatorio." }, { status: 400 });
    }
    if (!sellerWhatsapp?.trim()) {
      return NextResponse.json({ error: "El número de WhatsApp es obligatorio." }, { status: 400 });
    }

    let categoryId: number | undefined;
    if (categorySlug) {
      const cat = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (cat) categoryId = cat.id;
    }

    const slug = makeSlug(title.trim());

    const listing = await prisma.listing.create({
      data: {
        slug,
        title:          title.trim(),
        description:    description?.trim() ?? null,
        price:          price != null ? price : null,
        currency:       currency ?? "XAF",
        city:           city?.trim() ?? null,
        address:        address?.trim() ?? null,
        listingType:    (listingType as ListingType) ?? ListingType.PRODUCT,
        status:         ListingStatus.PENDING,
        imageUrl:       imageUrl?.trim() ?? null,
        sellerName:     sellerName.trim(),
        sellerWhatsapp: sellerWhatsapp.trim(),
        sellerEmail:    sellerEmail?.trim() ?? null,
        categoryId,
      },
    });

    notifyAdminNewListing(listing).catch(console.error);

    return NextResponse.json({ listing }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/listings]", err);
    return NextResponse.json({ error: "Error al crear el anuncio." }, { status: 500 });
  }
}

// ─── Admin notification ───────────────────────────────────────────────────────

async function notifyAdminNewListing(listing: { id: number; title: string; sellerName: string | null }) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const resendKey  = process.env.RESEND_API_KEY;
  if (!adminEmail || !resendKey) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
      to:      adminEmail,
      subject: `[Eyooly] Nuevo anuncio pendiente: ${listing.title}`,
      html: `<h2>Nuevo anuncio pendiente de revisión</h2><p><strong>Título:</strong> ${listing.title}</p><p><strong>Vendedor:</strong> ${listing.sellerName ?? "Desconocido"}</p><p><strong>ID:</strong> #${listing.id}</p><p>Accede al <a href="${process.env.NEXTAUTH_URL ?? "https://eyooly.com"}/admin">panel de administración</a> para aprobar o rechazar este anuncio.</p>`,
    }),
  });
}
