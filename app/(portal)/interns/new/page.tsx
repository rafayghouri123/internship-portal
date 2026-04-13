import { AddInternForm } from "@/components/interns/AddInternForm";
import { getDepartments } from "@/lib/data";

export default async function NewInternPage() {
  const departments: any[] = await getDepartments();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-dalda-gray-900">Add intern</h2>
        <p className="text-dalda-gray-600">Capture the full internship record in one complete form.</p>
      </div>
      <AddInternForm
        departments={departments.map((department) => ({ id: department.id, name: department.name }))}
      />
    </div>
  );
}
