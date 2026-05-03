"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TEST_ATTEMPT_STORAGE_KEY, TEST_GUIDE_ACK_STORAGE_KEY } from "@/lib/test/constants";

export function TestGuideClient() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const attempt = localStorage.getItem(TEST_ATTEMPT_STORAGE_KEY);
    if (!attempt) {
      router.replace("/test");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="test-panel rounded-2xl p-6">
        <p className="text-sm text-dalda-gray-200/90">Loading assessment guide...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="test-panel rounded-2xl p-6">
        <h1 className="text-xl font-semibold text-dalda-gray-50">Assessment Guide</h1>
        <p className="mt-2 text-sm text-dalda-gray-100">
          Thank you for showing your interest in Dalda Future Leadership Program (DFLP) 2026. You are about to begin
          the online assessment. Please read the instructions carefully before starting.
        </p>
      </div>

      <div className="test-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold text-dalda-gray-50">Before You Begin</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-dalda-gray-100">
          <li>This is a multiple-choice question assessment.</li>
          <li>Ensure you have a stable internet connection throughout the assessment.</li>
          <li>The assessment link can only be used once.</li>
          <li>Use a laptop or desktop. Mobile phones and tablets are not recommended.</li>
          <li>Choose a quiet environment and close unnecessary tabs or applications.</li>
          <li>
            Technical issues related to your own device or internet connection are your responsibility, so please ensure
            readiness before starting.
          </li>
        </ul>
      </div>

      <div className="test-panel rounded-2xl p-6">
        <h2 className="text-base font-semibold text-dalda-gray-50">During the Assessment</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-dalda-gray-100">
          <li>The assessment has 4 sections: Functional, Math, Logical Reasoning, and Verbal Reasoning.</li>
          <li>There are 30 questions in total: Functional (15), Math (5), Logical Reasoning (5), Verbal Reasoning (5).</li>
          <li>Total duration is 30 minutes.</li>
          <li>Do not refresh or exit during the test.</li>
          <li>Read each question carefully before answering.</li>
          <li>Switching to a previous question is not possible once you move ahead.</li>
          <li>Manage your time wisely. The test auto-submits when time ends.</li>
          <li>To submit manually, all questions must be answered.</li>
        </ul>
      </div>

      <div className="test-panel rounded-2xl p-6">
        <p className="text-sm text-dalda-gray-100">
          We wish you the very best for your assessment. This is the first step in your journey toward becoming part of
          the Dalda Future Leadership Program 2026.
        </p>
        <div className="mt-4 flex justify-end">
          <Button
            className="bg-gradient-to-r from-dalda-green to-dalda-green-dark text-white hover:from-dalda-green-dark hover:to-dalda-green-dark"
            onClick={() => {
              localStorage.setItem(TEST_GUIDE_ACK_STORAGE_KEY, "1");
              router.push("/test/attempt");
            }}
            type="button"
          >
            I Have Read and Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
