"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TEST_ATTEMPT_STORAGE_KEY, TEST_RESULT_STORAGE_KEY } from "@/lib/test/constants";
import { testDepartmentLabels, testDepartments, TestQuestion } from "@/lib/test/types";

type StartResponse = {
  token: string;
  startedAt: number;
  durationSeconds: number;
  candidate: {
    fullName: string;
    fatherName: string;
    university: string;
    department: string;
  };
  questions: TestQuestion[];
};

export function TestIntakeForm({ linkToken }: { linkToken: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isReady =
    fullName.trim().length > 1 &&
    fatherName.trim().length > 1 &&
    university.trim().length > 1 &&
    department.trim().length > 0;

  const onStart = () => {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/test/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          fatherName: fatherName.trim(),
          university: university.trim(),
          department,
          linkToken
        })
      });

      const payload = (await response.json().catch(() => null)) as StartResponse | { error?: string } | null;
      if (!response.ok || !payload || "error" in payload) {
        setError(payload && "error" in payload ? payload.error ?? "Unable to start test." : "Unable to start test.");
        return;
      }

      const successPayload = payload as StartResponse;
      localStorage.removeItem(TEST_RESULT_STORAGE_KEY);
      localStorage.setItem(
        TEST_ATTEMPT_STORAGE_KEY,
        JSON.stringify({
          token: successPayload.token,
          startedAt: successPayload.startedAt,
          durationSeconds: successPayload.durationSeconds,
          candidate: successPayload.candidate,
          questions: successPayload.questions,
          answers: {}
        })
      );
      router.push("/test/attempt");
    });
  };

  return (
    <Card className="surface-card">
      <CardHeader>
        <CardTitle>Candidate Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="fullName">
              Full name
            </label>
            <Input id="fullName" onChange={(event) => setFullName(event.target.value)} value={fullName} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="fatherName">
              Father&apos;s name
            </label>
            <Input id="fatherName" onChange={(event) => setFatherName(event.target.value)} value={fatherName} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="university">
              University name
            </label>
            <Input id="university" onChange={(event) => setUniversity(event.target.value)} value={university} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-900" htmlFor="department">
              Department
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              id="department"
              onChange={(event) => setDepartment(event.target.value)}
              value={department}
            >
              <option value="">Select department</option>
              {testDepartments.map((item) => (
                <option key={item} value={item}>
                  {testDepartmentLabels[item]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? <p className="text-sm text-dalda-red">{error}</p> : null}

        <Button disabled={!isReady || isPending} onClick={onStart} type="button">
          {isPending ? "Starting..." : "Start Test"}
        </Button>
      </CardContent>
    </Card>
  );
}
