export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Debes iniciar sesión para guardar anuncios" },
        { status: 401 }
      );
    }

    const { listingId } = await req.json();
    if (!listingId || typeof listingId !== "number") {
      return NextResponse.json(
        { error: "ID de anuncio inválido" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 }
      );
    }

    // Check if already saved
    const existing = await prisma.savedListing.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId,
        },
      },
    });

    if (existing) {
      // Unsave
      await prisma.savedListing.delete({
        where: {
          userId_listingId: {
            userId: user.id,
            listingId,
          },
        },
      });
      return NextResponse.json({ saved: false });
    } else {
      // Save
      await prisma.savedListing.create({
        data: {
          userId: user.id,
          listingId,
        },
      });
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error("[POST /api/listings/save]", error);
    return NextResponse.json(
      { error: "Error al guardar el anuncio" },
      { status: 500 }
    );
  }
}
