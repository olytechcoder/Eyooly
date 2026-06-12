import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, whatsapp, accountType } = body;

    if (!email || !whatsapp) {
      return NextResponse.json(
        { error: "Email and WhatsApp are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Map account type if needed (based on the error log's 'mappedAccountType')
    const mappedAccountType = accountType || "PERSONAL";

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: whatsapp,
        role: "USER" as any,
        accountType: mappedAccountType,
        emailVerified: null,
      },
    });

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
