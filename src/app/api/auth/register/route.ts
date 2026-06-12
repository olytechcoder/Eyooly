export const dynamic = "force-dynamic";
export const revalidate = 0;

import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, whatsapp, accountType, password } = await req.json();

    // Validation
    if (!email || !fullName || !whatsapp) {
      return NextResponse.json(
        { error: "Missing required fields: email, fullName, and whatsapp are required" },
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

    // Updated account type mapping
const accountTypeMap: Record<string, any> = {
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

    const mappedAccountType = accountTypeMap[accountType] || "buyer";

    // Prepare user data
    const userData: any = {
      email,
      name: fullName,
      phone: whatsapp,
      role: "USER",
      accountType: mappedAccountType,
      emailVerified: null,
    };

    // Add password if provided
    if (password) {
      userData.password = await bcrypt.hash(password, 10);
    }

    // Create new user
    const user = await prisma.user.create({
      data: userData,
    });

    // Return success without sensitive data
    return NextResponse.json(
      { 
        success: true, 
        userId: user.id,
        message: "User registered successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}