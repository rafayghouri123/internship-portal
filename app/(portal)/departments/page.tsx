import { AddDepartmentForm } from "@/components/departments/AddDepartmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDepartments } from "@/lib/data";

export default async function DepartmentsPage() {
  const departments: any[] = await getDepartments();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add department</CardTitle>
        </CardHeader>
        <CardContent>
          <AddDepartmentForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {departments.map((department: any) => (
            <div key={department.id} className="rounded-xl border border-dalda-gray-100 p-4">
              <p className="font-medium text-dalda-gray-900">{department.name}</p>
              <p className="text-sm text-dalda-gray-600">{department._count.interns} interns</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
