import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5 MB" }, { status: 400 });
    }

    const provider = process.env.UPLOAD_PROVIDER ?? "local";

    if (provider === "s3") {
      // S3 / Cloudflare R2 upload
      const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
      const s3 = new S3Client({
        region: process.env.AWS_REGION ?? "auto",
        endpoint: process.env.AWS_S3_ENDPOINT,
        credentials: {
          accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const ext    = file.name.split(".").pop() ?? "jpg";
      const key    = `listings/${nanoid(12)}.${ext}`;

      await s3.send(new PutObjectCommand({
        Bucket:      process.env.AWS_S3_BUCKET!,
        Key:         key,
        Body:        buffer,
        ContentType: file.type,
      }));

      const url = process.env.AWS_S3_ENDPOINT
        ? `${process.env.AWS_S3_ENDPOINT}/${process.env.AWS_S3_BUCKET}/${key}`
        : `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return NextResponse.json({ url, key });
    }

    // Local disk upload (default)
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext    = file.name.split(".").pop() ?? "jpg";
    const name   = `${nanoid(12)}.${ext}`;
    const dir    = path.join(process.cwd(), "public", "uploads");

    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, name), buffer);

    const url = `/uploads/${name}`;
    return NextResponse.json({ url, key: name });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
