"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_RESULT_STORAGE_KEY } from "@/lib/test/constants";
import { CandidateInfo } from "@/lib/test/types";

type ResultState = {
  score: number;
  total: number;
  timeTakenSeconds: number;
  autoSubmitted: boolean;
  candidate: CandidateInfo;
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
      <Card className="test-panel rounded-2xl">
        <CardContent className="p-6">
          <p className="text-sm text-dalda-gray-200/90">Loading result...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="test-panel overflow-hidden rounded-2xl">
      <CardHeader className="border-b border-dalda-green-muted/30 bg-dalda-green/10">
        <div className="flex items-center gap-3">
          <Image alt="Dalda Foods DFLP" className="h-12 w-16 object-contain" height={48} src="/dflp-logo.png" width={64} />
          <CardTitle className="text-dalda-gray-50">Test Submitted</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-dalda-gray-100">Thank you for your time. If you qualify, we will reach out you soon regarding the next step. Stay connected to your email for updates.

.</p>
        <p className="text-sm text-dalda-gray-100">Time taken: {formatDuration(result.timeTakenSeconds)}</p>
        {result.autoSubmitted ? (
          <p className="text-sm text-rose-300">Your test was auto-submitted because the timer ended.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
