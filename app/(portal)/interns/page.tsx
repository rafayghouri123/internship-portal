import { format } from "date-fns";
import Link from "next/link";
import { InternTable } from "@/components/interns/InternTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInterns } from "@/lib/data";

export default async function InternsPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string | string[]; status?: string | string[] }>;
}) {
  const rawParams = (await searchParams) ?? {};
  const params = {
    q: Array.isArray(rawParams.q) ? rawParams.q[0] : rawParams.q,
    status: Array.isArray(rawParams.status) ? rawParams.status[0] : rawParams.status
  };
  const interns: any[] = await getInterns(params);
  const rows = interns.map((intern) => ({
    id: intern.id,
    fullName: intern.fullName,
    cnicNumber: intern.cnicNumber,
    university: intern.university,
    department: intern.department,
    supervisorName: intern.supervisorName,
    joiningDate: format(intern.joiningDate, "PPP"),
    endDate: format(intern.endDate, "PPP"),
    status: intern.status
  }));

  const statuses = ["ALL", "ACTIVE", "EXTENDED", "COMPLETING_SOON", "COMPLETED", "TERMINATED"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-dalda-gray-900">Interns</h2>
          <p className="text-dalda-gray-600">Track every internship record from intake to completion.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="secondary">
            <Link href={`/api/interns/export?status=${params.status ?? "ALL"}&q=${params.q ?? ""}`}>
              Export CSV
            </Link>
          </Button>
          <Button asChild>
            <Link href="/interns/new">Add intern</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle>Intern directory</CardTitle>
          <form className="flex flex-wrap gap-3" method="GET">
            <input
              className="h-10 rounded-md border border-dalda-gray-100 px-3 text-sm"
              defaultValue={params.q}
              name="q"
              placeholder="Search by name, CNIC, or university"
            />
            <select
              className="h-10 rounded-md border border-dalda-gray-100 px-3 text-sm"
              defaultValue={params.status ?? "ALL"}
              name="status"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <Button type="submit" variant="secondary">
              Apply filters
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <InternTable data={rows} />
        </CardContent>
      </Card>
    </div>
  );
}
