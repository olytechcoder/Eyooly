export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, whatsapp, accountType } = await req.json();

    if (!email || !fullName || !whatsapp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Map account type to enum
    const accountTypeMap: Record<string, string> = {
      "Comprador": "BUYER",
      "Buyer": "BUYER",
      "Vendedor de marketplace": "MARKETPLACE_VENDOR",
      "Marketplace vendor": "MARKETPLACE_VENDOR",
      "Vendedor ecommerce": "ECOMMERCE_VENDOR",
      "Ecommerce vendor": "ECOMMERCE_VENDOR",
      "Restaurante / negocio de comida": "RESTAURANT",
      "Restaurant / food business": "RESTAURANT",
      "Repartidor / dispatch": "DISPATCH_PARTNER",
      "Dispatch / delivery partner": "DISPATCH_PARTNER",
      "Conductor": "DRIVER",
      "Driver": "DRIVER",
    };

    const mappedAccountType = (accountTypeMap[accountType] || "BUYER") as any;

    // Create new user with account type
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        phone: whatsapp,
        role: "USER" as any,
        accountType: mappedAccountType,
        emailVerified: null,
      },
    });

    // TODO: Send magic link email via Resend
    // For now, just return success
    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
