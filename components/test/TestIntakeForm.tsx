"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { universityOptions } from "@/lib/intern-options";
import {
  TEST_ATTEMPT_STORAGE_KEY,
  TEST_EXAMPLES_ACK_STORAGE_KEY,
  TEST_GUIDE_ACK_STORAGE_KEY,
  TEST_RESULT_STORAGE_KEY
} from "@/lib/test/constants";
import { testDepartmentLabels, testDepartments, TestQuestion } from "@/lib/test/types";

type StartResponse = {
  token: string;
  startedAt: number;
  durationSeconds: number;
  candidate: {
    fullName: string;
    fatherName: string;
    email: string;
    university: string;
    department: string;
    semester: "6TH" | "7TH" | "8TH";
    internshipTrack: "INTERNSHIP" | "MTO";
    studyLevel: "BACHELORS" | "MASTERS";
  };
  questions: TestQuestion[];
};

export function TestIntakeForm({ linkToken }: { linkToken: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [internshipTrack, setInternshipTrack] = useState("");
  const [studyLevel, setStudyLevel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const universityListId = "test-university-options";

  const isReady =
    fullName.trim().length > 1 &&
    fatherName.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    university.trim().length > 1 &&
    department.trim().length > 0 &&
    semester.trim().length > 0 &&
    internshipTrack.trim().length > 0 &&
    studyLevel.trim().length > 0;

  const onStart = () => {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/test/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          fatherName: fatherName.trim(),
          email: email.trim().toLowerCase(),
          university: university.trim(),
          department,
          semester,
          internshipTrack,
          studyLevel,
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
      localStorage.removeItem(TEST_GUIDE_ACK_STORAGE_KEY);
      localStorage.removeItem(TEST_EXAMPLES_ACK_STORAGE_KEY);
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
      router.push("/test/guide");
    });
  };

  return (
    <Card className="test-panel overflow-hidden rounded-2xl">
      <CardHeader className="border-b border-dalda-green-muted/30 bg-dalda-green/10">
        <CardTitle className="text-dalda-gray-50">Candidate Intake</CardTitle>
        <p className="text-sm text-dalda-gray-200/90">
          Enter your details exactly as you want them to appear in the final test record.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="fullName">
              Full name
            </label>
            <Input
              className="border-dalda-green-muted/35 bg-white/95 focus-visible:ring-dalda-green"
              id="fullName"
              onChange={(event) => setFullName(event.target.value)}
              value={fullName}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="fatherName">
              Father&apos;s name
            </label>
            <Input
              className="border-dalda-green-muted/35 bg-white/95 focus-visible:ring-dalda-green"
              id="fatherName"
              onChange={(event) => setFatherName(event.target.value)}
              value={fatherName}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-dalda-gray-50" htmlFor="email">
            Registered email address
          </label>
          <Input
            className="border-dalda-green-muted/35 bg-white/95 focus-visible:ring-dalda-green"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          <p className="text-xs text-dalda-gray-200/90">
            Please use the same email address you used during registration.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="university">
              University name
            </label>
            <Input
              className="border-dalda-green-muted/35 bg-white/95 focus-visible:ring-dalda-green"
              id="university"
              list={universityListId}
              onChange={(event) => setUniversity(event.target.value)}
              value={university}
            />
            <datalist id={universityListId}>
              {universityOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="department">
              Department
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-dalda-green-muted/35 bg-white/95 px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="semester">
              Semester
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-dalda-green-muted/35 bg-white/95 px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              id="semester"
              onChange={(event) => setSemester(event.target.value)}
              value={semester}
            >
              <option value="">Select semester</option>
              <option value="6TH">6th</option>
              <option value="7TH">7th</option>
              <option value="8TH">8th</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="studyLevel">
              Study level
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-dalda-green-muted/35 bg-white/95 px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              id="studyLevel"
              onChange={(event) => setStudyLevel(event.target.value)}
              value={studyLevel}
            >
              <option value="">Select level</option>
              <option value="BACHELORS">Bachelors</option>
              <option value="MASTERS">Masters</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-dalda-gray-50" htmlFor="internshipTrack">
              Internship Type
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-dalda-green-muted/35 bg-white/95 px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green"
              id="internshipTrack"
              onChange={(event) => setInternshipTrack(event.target.value)}
              value={internshipTrack}
            >
              <option value="">Select type</option>
              <option value="INTERNSHIP">Summer Internship</option>
              <option value="MTO">Management Trainee</option>
            </select>
          </div>
        </div>

        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        <Button
          className="w-full bg-gradient-to-r from-dalda-green to-dalda-green-dark text-white hover:from-dalda-green-dark hover:to-dalda-green-dark"
          disabled={!isReady || isPending}
          onClick={onStart}
          type="button"
        >
          {isPending ? "Starting..." : "Start Test"}
        </Button>
      </CardContent>
    </Card>
  );
}
