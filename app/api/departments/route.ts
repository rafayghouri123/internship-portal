import { NextResponse } from "next/server";
import { getDepartments } from "@/lib/data";

export async function GET() {
  const departments = await getDepartments();
  return NextResponse.json({ data: departments });
}
