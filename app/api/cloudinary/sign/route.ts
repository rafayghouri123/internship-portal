import { NextResponse } from "next/server";
import { generateSignature } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const folder = typeof body.folder === "string" ? body.folder : "dalda-internship/cvs";

    return NextResponse.json(generateSignature(folder));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate upload signature";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
