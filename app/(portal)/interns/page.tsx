import { format } from "date-fns";
import Link from "next/link";
import { InternTable } from "@/components/interns/InternTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInternsPage } from "@/lib/data";

export default async function InternsPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string | string[]; status?: string | string[]; page?: string | string[] }>;
}) {
  const rawParams = (await searchParams) ?? {};
  const pageValue = Array.isArray(rawParams.page) ? rawParams.page[0] : rawParams.page;
  const currentPage = Math.max(1, Number(pageValue) || 1);
  const params = {
    q: Array.isArray(rawParams.q) ? rawParams.q[0] : rawParams.q,
    status: Array.isArray(rawParams.status) ? rawParams.status[0] : rawParams.status
  };
  const paged = await getInternsPage(params, currentPage, 12);
  const interns: any[] = paged.items;
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

  const from = paged.total === 0 ? 0 : (paged.page - 1) * paged.pageSize + 1;
  const to = Math.min(paged.total, paged.page * paged.pageSize);

  const buildPageHref = (page: number) => {
    const query = new URLSearchParams();
    if (params.q) query.set("q", params.q);
    if (params.status) query.set("status", params.status);
    query.set("page", String(page));
    return `/interns?${query.toString()}`;
  };

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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-dalda-gray-600">
              Showing {from}-{to} of {paged.total} interns
            </p>
            <div className="flex items-center gap-2">
              {paged.page <= 1 ? (
                <Button disabled size="sm" variant="secondary">
                  Previous
                </Button>
              ) : (
                <Button asChild size="sm" variant="secondary">
                  <Link href={buildPageHref(paged.page - 1)}>Previous</Link>
                </Button>
              )}
              <span className="text-sm text-dalda-gray-700">
                Page {paged.page} of {paged.totalPages}
              </span>
              {paged.page >= paged.totalPages ? (
                <Button disabled size="sm" variant="secondary">
                  Next
                </Button>
              ) : (
                <Button asChild size="sm" variant="secondary">
                  <Link href={buildPageHref(paged.page + 1)}>Next</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
