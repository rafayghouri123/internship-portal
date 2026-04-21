import { TestQuestionManager } from "@/components/test/TestQuestionManager";
import { prisma } from "@/lib/prisma";
import { testDepartmentLabels, testDepartments } from "@/lib/test/types";

export default async function QuestionBankPage({
  searchParams
}: {
  searchParams?: Promise<{ department?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedDepartment = (params.department ?? "ALL").toString().trim().toUpperCase();
  const isSharedSection = ["LOGICAL", "REASONING", "MATH"].includes(selectedDepartment);
  const where =
    selectedDepartment !== "ALL"
      ? isSharedSection
        ? { section: selectedDepartment, OR: [{ department: "SHARED" }, { department: null }] }
        : { section: "FUNCTIONAL", department: selectedDepartment }
      : { section: "FUNCTIONAL" };

  const questions = await prisma.testQuestion.findMany({
    where,
    orderBy: [{ createdAt: "desc" }]
  });

  return (
    <div className="space-y-6">
      <div className="surface-card p-5">
        <h1 className="text-xl font-semibold text-dalda-gray-900">Question bank</h1>
        <p className="mt-1 text-sm text-dalda-gray-600">
          Manage test questions by department and section. Added/deleted questions are used in live test generation.
        </p>
        <form className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="department">
              Department
            </label>
            <select
              className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              defaultValue={selectedDepartment}
              id="department"
              name="department"
            >
              <option value="ALL">All departments</option>
              <option value="LOGICAL">Logical</option>
              <option value="REASONING">Reasoning</option>
              <option value="MATH">Math</option>
              {testDepartments.map((item) => (
                <option key={item} value={item}>
                  {testDepartmentLabels[item]}
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
              href="/question-bank"
            >
              Clear
            </a>
          </div>
        </form>
      </div>

      <TestQuestionManager rows={questions as any} selectedDepartment={selectedDepartment} />
    </div>
  );
}
