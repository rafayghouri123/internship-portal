import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ warmed: false, databaseConfigured: false });
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ warmed: true, databaseConfigured: true });
  } catch {
    return NextResponse.json({ warmed: false, databaseConfigured: true }, { status: 503 });
  }
}
