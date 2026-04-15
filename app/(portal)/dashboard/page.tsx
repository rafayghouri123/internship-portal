import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { ExpiryAlert } from "@/components/dashboard/ExpiryAlert";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardDataByRange } from "@/lib/data";

export default async function DashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ fromYear?: string; toYear?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const fromYear = params.fromYear ? Number(params.fromYear) : undefined;
  const toYear = params.toYear ? Number(params.toYear) : undefined;
  const data: any = await getDashboardDataByRange({
    fromYear: Number.isFinite(fromYear) ? fromYear : undefined,
    toYear: Number.isFinite(toYear) ? toYear : undefined
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter by year</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-dalda-gray-900" htmlFor="fromYear">
                From year
              </label>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
                defaultValue={params.fromYear ?? ""}
                id="fromYear"
                name="fromYear"
              >
                <option value="">All years</option>
                {data.availableYears.map((year: number) => (
                  <option key={`from-${year}`} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-dalda-gray-900" htmlFor="toYear">
                Till year
              </label>
              <select
                className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
                defaultValue={params.toYear ?? ""}
                id="toYear"
                name="toYear"
              >
                <option value="">All years</option>
                {data.availableYears.map((year: number) => (
                  <option key={`to-${year}`} value={year}>
                    {year}
                  </option>
                ))}
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
                href="/dashboard"
              >
                Clear
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <StatsCards stats={data.stats} />
      <ExpiryAlert interns={data.completingSoon} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Interns Per Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentChart data={data.departmentBreakdown} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Universities Interns</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentChart
              data={data.universityBreakdown}
              barColor="#C8102E"
              yAxisWidth={190}
              tickFontSize={10}
              maxLabelLength={30}
            />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Internship Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <DepartmentChart data={data.officeBreakdown} barColor="#2D8A41" />
        </CardContent>
      </Card>
    </div>
  );
}
