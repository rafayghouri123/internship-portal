import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTestResultDepartments, getTestResults } from "@/lib/data";

function formatMinutes(seconds: number) {
  return `${(seconds / 60).toFixed(1)} min`;
}

function formatSemester(value: string | null | undefined) {
  if (!value) return "-";
  return value === "6TH" ? "6th" : value === "7TH" ? "7th" : value === "8TH" ? "8th" : value;
}

function formatStudyLevel(value: string | null | undefined) {
  if (!value) return "-";
  return value === "BACHELORS" ? "Bachelors" : value === "MASTERS" ? "Masters" : value;
}

function formatInternshipTrack(value: string | null | undefined) {
  if (!value) return "-";
  return value === "MTO" ? "Management Trainee" : value === "INTERNSHIP" ? "Internship" : value;
}

export default async function TestResultsPage({
  searchParams
}: {
  searchParams?: Promise<{ department?: string; sort?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const department = params.department ?? "ALL";
  const sort = params.sort === "score" ? "score" : "date";

  const [results, departments] = await Promise.all([
    getTestResults({ department, sort }),
    getTestResultDepartments()
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-dalda-gray-900" htmlFor="department">
                Department
              </label>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
                defaultValue={department}
                id="department"
                name="department"
              >
                <option value="ALL">All departments</option>
                {departments.map((item) => (
                  <option key={item} value={item}>
                    {item.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-dalda-gray-900" htmlFor="sort">
                Sort by
              </label>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
                defaultValue={sort}
                id="sort"
                name="sort"
              >
                <option value="date">Date</option>
                <option value="score">Score</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                className="h-10 rounded-md bg-dalda-green px-4 text-sm font-medium text-white transition hover:bg-dalda-green-dark"
                type="submit"
              >
                Apply
              </button>
              <a
                className="inline-flex h-10 items-center rounded-md border border-dalda-gray-100 px-4 text-sm font-medium text-dalda-gray-700 hover:bg-dalda-gray-50"
                href="/dashboard/test-results"
              >
                Clear
              </a>
            </div>
          </form>
          <div className="mt-3">
            <a
              className="inline-flex h-9 items-center rounded-md border border-dalda-gray-100 px-3 text-sm font-medium text-dalda-gray-700 hover:bg-dalda-gray-50"
              href={`/api/test/results/export?department=${encodeURIComponent(department)}&sort=${sort}`}
            >
              Export CSV
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Father&apos;s Name</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Study Level</TableHead>
                  <TableHead>Internship Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Time Taken</TableHead>
                  <TableHead>Submitted At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length ? (
                  results.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.fullName}</TableCell>
                      <TableCell>{row.fatherName}</TableCell>
                      <TableCell>{row.university}</TableCell>
                      <TableCell>{row.department.replaceAll("_", " ")}</TableCell>
                      <TableCell>{formatSemester((row as any).semester)}</TableCell>
                      <TableCell>{formatStudyLevel((row as any).studyLevel)}</TableCell>
                      <TableCell>{formatInternshipTrack((row as any).internshipTrack)}</TableCell>
                      <TableCell>
                        {row.score}/{row.totalQuestions}
                      </TableCell>
                      <TableCell>{Math.round((row.score / Math.max(row.totalQuestions, 1)) * 100)}%</TableCell>
                      <TableCell>{formatMinutes(row.timeTaken)}</TableCell>
                      <TableCell>{format(row.submittedAt, "PPp")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center text-dalda-gray-500" colSpan={11}>
                      No test submissions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
