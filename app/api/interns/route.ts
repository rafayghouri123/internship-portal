import { NextResponse } from "next/server";
import { getInterns } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const interns = await getInterns({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined
  });

  return NextResponse.json({ data: interns });
}
