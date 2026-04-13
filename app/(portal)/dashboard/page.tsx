import { DepartmentChart } from "@/components/dashboard/DepartmentChart";
import { ExpiryAlert } from "@/components/dashboard/ExpiryAlert";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { YearRangeChart } from "@/components/dashboard/YearRangeChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/data";

export default async function DashboardPage() {
  const data: any = await getDashboardData();

  return (
    <div className="space-y-6">
      <StatsCards stats={data.stats} />
      <ExpiryAlert interns={data.completingSoon} />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>Department breakdown</CardTitle>
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
      <Card>
        <CardHeader>
          <CardTitle>Interns by end year</CardTitle>
        </CardHeader>
        <CardContent>
          <YearRangeChart data={data.yearlyBreakdown} />
        </CardContent>
      </Card>
    </div>
  );
}
