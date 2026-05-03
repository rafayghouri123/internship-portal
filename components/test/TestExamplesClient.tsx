"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  TEST_ATTEMPT_STORAGE_KEY,
  TEST_EXAMPLES_ACK_STORAGE_KEY,
  TEST_GUIDE_ACK_STORAGE_KEY
} from "@/lib/test/constants";
import { TestDepartment } from "@/lib/test/types";
import { functionalDepartmentGuides, sharedSectionGuides } from "@/components/test/TestAttemptClient";

type AttemptLite = {
  candidate: {
    department: TestDepartment;
  };
};

const sectionOrder = ["FUNCTIONAL", "MATH", "LOGICAL", "REASONING"] as const;

export function TestExamplesClient() {
  const router = useRouter();
  const [department, setDepartment] = useState<TestDepartment | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const guideAck = localStorage.getItem(TEST_GUIDE_ACK_STORAGE_KEY);
    if (!guideAck) {
      router.replace("/test/guide");
      return;
    }

    const raw = localStorage.getItem(TEST_ATTEMPT_STORAGE_KEY);
    if (!raw) {
      router.replace("/test");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AttemptLite;
      setDepartment(parsed.candidate.department);
    } catch {
      router.replace("/test");
    }
  }, [router]);

  const cards = useMemo(() => {
    if (!department) return [];
    return sectionOrder.map((section) => {
      if (section === "FUNCTIONAL") return { section, guide: functionalDepartmentGuides[department] };
      if (section === "MATH") return { section, guide: sharedSectionGuides.MATH };
      if (section === "LOGICAL") return { section, guide: sharedSectionGuides.LOGICAL };
      return { section, guide: sharedSectionGuides.REASONING };
    });
  }, [department]);

  if (!department || cards.length === 0) {
    return (
      <div className="test-panel rounded-2xl p-6">
        <p className="text-sm text-dalda-gray-200/90">Loading section examples...</p>
      </div>
    );
  }

  const current = cards[index];
  const isLast = index === cards.length - 1;

  return (
    <div className="space-y-5">
      <div className="test-panel rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-dalda-green">Section Example {index + 1} of {cards.length}</p>
        <h1 className="mt-1 text-xl font-semibold text-dalda-gray-50">{current.guide.title}</h1>
        <p className="mt-2 text-sm text-dalda-gray-100">{current.guide.description}</p>
      </div>

      <div className="test-panel rounded-2xl p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-dalda-gray-300">Sample Question</p>
        <p className="mt-2 text-sm font-medium text-dalda-gray-50">{current.guide.sampleQuestion}</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {current.guide.options.map((option) => (
            <div className="rounded-md border border-dalda-green-muted/30 bg-black/25 px-3 py-2 text-xs text-dalda-gray-100" key={option.id}>
              <strong>{option.id}.</strong> {option.label}
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs font-semibold text-dalda-green">Correct answer: {current.guide.correctAnswer}</p>
        <p className="mt-1 text-xs text-dalda-gray-200/90">{current.guide.explanation}</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          disabled={index === 0}
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          type="button"
          variant="secondary"
        >
          Previous
        </Button>
        {!isLast ? (
          <Button onClick={() => setIndex((value) => Math.min(cards.length - 1, value + 1))} type="button">
            Next Example
          </Button>
        ) : (
          <Button
            onClick={() => {
              localStorage.setItem(TEST_EXAMPLES_ACK_STORAGE_KEY, "1");
              router.push("/test/attempt");
            }}
            type="button"
          >
            Start Test
          </Button>
        )}
      </div>
    </div>
  );
}

