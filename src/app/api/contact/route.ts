import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Nombre, correo y mensaje son obligatorios." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo electrónico inválido." }, { status: 400 });
    }

    await prisma.contactMessage.create({
      data: {
        name:    name.trim(),
        email:   email.trim(),
        subject: subject?.trim() ?? null,
        message: message.trim(),
      },
    });

    if (process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      await resend.emails
        .send({
          from:    process.env.EMAIL_FROM ?? "Eyooly <noreply@eyooly.com>",
          to:      [process.env.ADMIN_EMAIL],
          subject: `[Eyooly] Nuevo mensaje de contacto: ${subject ?? "Sin asunto"}`,
          html: `<h2>Nuevo mensaje de contacto</h2><p><strong>De:</strong> ${name} &lt;${email}&gt;</p><p><strong>Asunto:</strong> ${subject ?? "Sin asunto"}</p><hr/><p>${message.replace(/\n/g, "<br>")}</p>`,
        })
        .catch((e) => console.error("[Contact email]", e));
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Error al enviar el mensaje." }, { status: 500 });
  }
}
