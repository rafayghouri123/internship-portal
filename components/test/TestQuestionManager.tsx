"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ZodError } from "zod";
import { createTestQuestion, deleteTestQuestion, importDefaultQuestionBank } from "@/actions/test-questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { testDepartmentLabels, testDepartments } from "@/lib/test/types";

type QuestionRow = {
  id: string;
  section: string;
  department: string | null;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  createdAt: Date;
};

export function TestQuestionManager({
  rows,
  selectedDepartment
}: {
  rows: QuestionRow[];
  selectedDepartment: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <div className="space-y-6">
      <form
        className="surface-card space-y-4 p-5"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          const formData = new FormData(event.currentTarget);

          startTransition(async () => {
            try {
              await createTestQuestion({
                department: String(formData.get("department") || "IT"),
                question: String(formData.get("question") || ""),
                optionA: String(formData.get("optionA") || ""),
                optionB: String(formData.get("optionB") || ""),
                optionC: String(formData.get("optionC") || ""),
                optionD: String(formData.get("optionD") || ""),
                correctOption: String(formData.get("correctOption") || "A") as "A" | "B" | "C" | "D"
              });
              toast.success("Question added.");
              event.currentTarget.reset();
              router.refresh();
            } catch (caughtError) {
              if (caughtError instanceof ZodError) {
                setError(caughtError.issues[0]?.message ?? "Please fix the highlighted fields.");
                return;
              }
              if (caughtError instanceof Error) {
                setError(caughtError.message);
                return;
              }
              setError("Unable to add question right now.");
            }
          });
        }}
      >
        <h2 className="text-base font-semibold text-dalda-gray-900">Add question</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="department">
              Department
            </label>
            <select
              className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              defaultValue={selectedDepartment !== "ALL" ? selectedDepartment : "IT"}
              id="department"
              name="department"
            >
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
          <div>
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="correctOption">
              Correct option
            </label>
            <select
              className="mt-2 flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              defaultValue="A"
              id="correctOption"
              name="correctOption"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-dalda-gray-900" htmlFor="question">
            Question
          </label>
          <Textarea id="question" name="question" placeholder="Enter question text" rows={4} />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <Input name="optionA" placeholder="Option A" />
          <Input name="optionB" placeholder="Option B" />
          <Input name="optionC" placeholder="Option C" />
          <Input name="optionD" placeholder="Option D" />
        </div>

        {error ? <p className="text-sm text-dalda-red">{error}</p> : null}
        <Button disabled={isPending} type="submit">
          Add question
        </Button>
      </form>

      <div className="surface-card flex items-center justify-between gap-3 p-4">
        <p className="text-sm text-dalda-gray-600">
          If this is your first time, import the default question bank into database to make questions editable.
        </p>
        <Button
          onClick={() => {
            startTransition(async () => {
              try {
                const result = await importDefaultQuestionBank();
                if (result.skipped) {
                  toast.message("Question bank already exists in database.");
                } else {
                  toast.success(`${result.imported} questions imported to database.`);
                }
                router.refresh();
              } catch (caughtError) {
                if (caughtError instanceof Error) {
                  toast.error(caughtError.message);
                  return;
                }
                toast.error("Unable to import default question bank.");
              }
            });
          }}
          type="button"
          variant="secondary"
        >
          Import default bank
        </Button>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dalda-gray-50 text-dalda-gray-400">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Section</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Department</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Question</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Answer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => (
                <tr className="border-b border-dalda-gray-100" key={row.id}>
                  <td className="p-4 text-dalda-gray-700">{row.section}</td>
                  <td className="p-4 text-dalda-gray-700">{row.department ?? "Shared"}</td>
                  <td className="max-w-xl p-4 text-dalda-gray-700">{row.question}</td>
                  <td className="p-4 font-medium text-dalda-gray-900">{row.correctOption}</td>
                  <td className="p-4">
                    <Button
                      onClick={() => {
                        startTransition(async () => {
                          try {
                            await deleteTestQuestion(row.id);
                            toast.success("Question deleted.");
                            router.refresh();
                          } catch (caughtError) {
                            if (caughtError instanceof Error) {
                              toast.error(caughtError.message);
                              return;
                            }
                            toast.error("Unable to delete question.");
                          }
                        });
                      }}
                      size="sm"
                      type="button"
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-5 text-center text-dalda-gray-500" colSpan={5}>
                  No questions found for selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
