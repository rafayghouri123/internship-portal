import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { scoreAttempt } from "@/lib/test/question-bank";
import { sessionTokenHash, testSessionCookieName, verifySignedTestSession } from "@/lib/test/session";
import { submitTestSchema } from "@/lib/validations/test";

function readCookieToken(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const parts = cookieHeader.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(`${testSessionCookieName}=`)) {
      return decodeURIComponent(part.slice(`${testSessionCookieName}=`.length));
    }
  }
  return null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = submitTestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission payload." }, { status: 400 });
  }

  const cookieToken = readCookieToken(request);
  const token = parsed.data.token || cookieToken;
  const session = verifySignedTestSession(token);
  if (!token || !session) {
    return NextResponse.json({ error: "Unable to validate test session. Please restart the test." }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database is not configured for test submissions." }, { status: 503 });
  }

  const questionIds = [
    ...session.questionIds.functional,
    ...session.questionIds.logical,
    ...session.questionIds.reasoning,
    ...session.questionIds.math
  ];

  const { score, total } = await scoreAttempt(questionIds, parsed.data.answers);
  const tokenHash = sessionTokenHash(token);

  const existing = await prisma.testSubmission.findUnique({
    where: { sessionTokenHash: tokenHash }
  });

  if (existing) {
    return NextResponse.json({
      score: existing.score,
      total: existing.totalQuestions,
      timeTakenSeconds: existing.timeTaken,
      alreadySubmitted: true
    });
  }

  const saved = await prisma.testSubmission.create({
    data: {
      sessionTokenHash: tokenHash,
      fullName: session.candidate.fullName,
      fatherName: session.candidate.fatherName,
      university: session.candidate.university,
      department: session.candidate.department,
      semester: session.candidate.semester,
      internshipTrack: session.candidate.internshipTrack,
      studyLevel: session.candidate.studyLevel,
      score,
      totalQuestions: total,
      timeTaken: parsed.data.timeTakenSeconds,
      answers: parsed.data.answers
    } as any
  });

  const response = NextResponse.json({
    score,
    total,
    timeTakenSeconds: parsed.data.timeTakenSeconds
  });

  response.cookies.set(testSessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

  return response;
}
