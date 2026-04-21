"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_RESULT_STORAGE_KEY } from "@/lib/test/constants";

type ResultState = {
  score: number;
  total: number;
  timeTakenSeconds: number;
  autoSubmitted: boolean;
  candidate: {
    fullName: string;
    fatherName: string;
    university: string;
    department: string;
  };
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

export function TestDoneClient() {
  const router = useRouter();
  const [result, setResult] = useState<ResultState | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(TEST_RESULT_STORAGE_KEY);
    if (!raw) {
      router.replace("/test");
      return;
    }

    try {
      setResult(JSON.parse(raw) as ResultState);
      window.history.pushState(null, "", window.location.href);
      const blockBack = () => window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", blockBack);
      return () => window.removeEventListener("popstate", blockBack);
    } catch {
      router.replace("/test");
    }
  }, [router]);

  if (!result) {
    return (
      <Card className="surface-card">
        <CardContent className="p-6">
          <p className="text-sm text-dalda-gray-600">Loading result...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="surface-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Image alt="Dalda Foods" className="h-10 w-10 rounded-md object-cover" height={40} src="/dalda-logo.jfif" width={40} />
          <CardTitle>Test Submitted</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-dalda-gray-700">Thank you. Your assessment has been submitted successfully.</p>
        <p className="text-sm text-dalda-gray-700">Time taken: {formatDuration(result.timeTakenSeconds)}</p>
        {result.autoSubmitted ? (
          <p className="text-sm text-dalda-red">Your test was auto-submitted because the timer ended.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
