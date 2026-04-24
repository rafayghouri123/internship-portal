import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { buildAttemptQuestions, hasFunctionalPool } from "@/lib/test/question-bank";
import { createSignedTestSession, testSessionCookieName } from "@/lib/test/session";
import { prisma } from "@/lib/prisma";
import { startTestRequestSchema } from "@/lib/validations/test";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = startTestRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please complete all required fields before starting the test."
      },
      { status: 400 }
    );
  }

  const link = await prisma.testLink.findFirst({
    where: {
      token: parsed.data.linkToken,
      isActive: true
    }
  });

  if (!link) {
    return NextResponse.json(
      {
        error: "This test link is invalid or expired. Please contact HR."
      },
      { status: 403 }
    );
  }

  if (!(await hasFunctionalPool(parsed.data.department))) {
    return NextResponse.json(
      {
        error: "Question bank for this department is not ready yet."
      },
      { status: 422 }
    );
  }

  const startedAt = Date.now();
  const candidate = {
    fullName: parsed.data.fullName,
    fatherName: parsed.data.fatherName,
    university: parsed.data.university,
    department: parsed.data.department,
    semester: parsed.data.semester,
    internshipTrack: parsed.data.internshipTrack,
    studyLevel: parsed.data.studyLevel
  };
  const { questions, questionIds } = await buildAttemptQuestions(parsed.data.department);
  const token = createSignedTestSession({
    sid: randomUUID(),
    startedAt,
    candidate,
    questionIds
  });

  const response = NextResponse.json({
    token,
    startedAt,
    durationSeconds: 30 * 60,
    candidate,
    questions
  });

  response.cookies.set(testSessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60
  });

  return response;
}
