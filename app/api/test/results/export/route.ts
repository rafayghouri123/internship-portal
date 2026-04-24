import Papa from "papaparse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department") ?? "";
  const sort = searchParams.get("sort") === "score" ? "score" : "date";

  const results = await prisma.testSubmission.findMany({
    where: department && department !== "ALL" ? { department } : undefined,
    orderBy:
      sort === "score"
        ? [{ score: "desc" }, { submittedAt: "desc" }]
        : [{ submittedAt: "desc" }, { score: "desc" }]
  });

  const csv = Papa.unparse(
    results.map((row) => ({
      Name: row.fullName,
      "Father Name": row.fatherName,
      University: row.university,
      Department: row.department,
      Semester: (row as any).semester ?? "",
      "Study Level": (row as any).studyLevel ?? "",
      "Internship Type": (row as any).internshipTrack ?? "",
      Score: row.score,
      "Total Questions": row.totalQuestions,
      Percentage: `${Math.round((row.score / Math.max(row.totalQuestions, 1)) * 100)}%`,
      "Time Taken (minutes)": (row.timeTaken / 60).toFixed(2),
      "Submitted At": row.submittedAt.toISOString()
    }))
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="internship-test-results.csv"'
    }
  });
}
