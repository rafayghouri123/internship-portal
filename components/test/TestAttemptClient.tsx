"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { TEST_ATTEMPT_STORAGE_KEY, TEST_RESULT_STORAGE_KEY, TEST_DURATION_SECONDS } from "@/lib/test/constants";
import { TestQuestion } from "@/lib/test/types";

type AttemptState = {
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
  answers: Record<string, string>;
};

type SubmitResponse = {
  score: number;
  total: number;
  timeTakenSeconds: number;
};

function formatSeconds(total: number) {
  const safe = Math.max(total, 0);
  const minutes = Math.floor(safe / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(safe % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function TestAttemptClient() {
  const router = useRouter();
  const [attempt, setAttempt] = useState<AttemptState | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(TEST_DURATION_SECONDS);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(TEST_ATTEMPT_STORAGE_KEY);
    if (!raw) {
      router.replace("/test");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AttemptState;
      if (!parsed.questions?.length) {
        router.replace("/test");
        return;
      }

      setAttempt(parsed);
      const elapsed = Math.max(0, Math.floor((Date.now() - parsed.startedAt) / 1000));
      setRemainingSeconds(Math.max((parsed.durationSeconds || TEST_DURATION_SECONDS) - elapsed, 0));
    } catch {
      router.replace("/test");
    }
  }, [router]);

  useEffect(() => {
    if (!attempt || submitted) {
      return;
    }

    const id = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(id);
          void submitAttempt(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [attempt, submitted]);

  useEffect(() => {
    if (submitted) {
      return;
    }

    const warning = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("beforeunload", warning);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", warning);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [submitted]);

  const current = useMemo(() => {
    if (!attempt) {
      return null;
    }
    return attempt.questions[currentIndex] ?? null;
  }, [attempt, currentIndex]);

  const orderedSections: TestQuestion["section"][] = ["FUNCTIONAL", "LOGICAL", "REASONING", "MATH"];

  const submitAttempt = async (autoSubmit = false) => {
    if (!attempt || submitted) {
      return;
    }

    setError(null);
    setSubmitted(true);

    const elapsed = Math.max(0, Math.floor((Date.now() - attempt.startedAt) / 1000));
    const timeTakenSeconds = Math.min(elapsed, attempt.durationSeconds || TEST_DURATION_SECONDS);

    const response = await fetch("/api/test/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: attempt.token,
        answers: attempt.answers,
        timeTakenSeconds
      })
    });

    const payload = (await response.json().catch(() => null)) as SubmitResponse | { error?: string } | null;
    if (!response.ok || !payload || "error" in payload) {
      setSubmitted(false);
      setError(
        payload && "error" in payload
          ? payload.error ?? "Unable to submit test right now."
          : "Unable to submit test right now."
      );
      return;
    }

    const successPayload = payload as SubmitResponse;
    localStorage.setItem(
      TEST_RESULT_STORAGE_KEY,
      JSON.stringify({
        score: successPayload.score,
        total: successPayload.total,
        timeTakenSeconds: successPayload.timeTakenSeconds,
        autoSubmitted: autoSubmit,
        candidate: attempt.candidate
      })
    );
    localStorage.removeItem(TEST_ATTEMPT_STORAGE_KEY);
    router.replace("/test/done");
  };

  if (!attempt || !current) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-dalda-gray-600">Loading test attempt...</p>
      </div>
    );
  }

  const sections = attempt.questions.reduce<Record<string, { start: number; end: number }>>((acc, question, index) => {
    if (!acc[question.section]) {
      acc[question.section] = { start: index, end: index };
    } else {
      acc[question.section].end = index;
    }
    return acc;
  }, {});
  const sectionEntries = orderedSections
    .map((section) => ({ section, range: sections[section] }))
    .filter((item): item is { section: TestQuestion["section"]; range: { start: number; end: number } } => Boolean(item.range));

  const isSectionComplete = (range: { start: number; end: number }) => {
    for (let index = range.start; index <= range.end; index += 1) {
      const question = attempt.questions[index];
      if (!question || !attempt.answers[question.id]) {
        return false;
      }
    }
    return true;
  };

  const firstIncompleteSectionIndex = sectionEntries.findIndex((entry) => !isSectionComplete(entry.range));
  const unlockedSectionIndex =
    firstIncompleteSectionIndex === -1 ? sectionEntries.length - 1 : Math.max(firstIncompleteSectionIndex, 0);
  const currentSectionIndex = sectionEntries.findIndex(
    (entry) => currentIndex >= entry.range.start && currentIndex <= entry.range.end
  );

  const answeredCount = Object.keys(attempt.answers).length;
  const allAnswered = answeredCount >= attempt.questions.length;
  const activeSection = currentSectionIndex >= 0 ? sectionEntries[currentSectionIndex] : null;
  const isAtSectionEnd = activeSection ? currentIndex >= activeSection.range.end : false;
  const canLeaveCurrentSection = activeSection ? isSectionComplete(activeSection.range) : true;

  return (
    <div className="space-y-4">
      <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <Image alt="Dalda Foods" className="h-10 w-10 rounded-md object-cover" height={40} src="/dalda-logo.jfif" width={40} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-dalda-gray-400">Internship Assessment Test</p>
            <p className="text-sm font-semibold text-dalda-gray-900">
              {attempt.candidate.department.replaceAll("_", " ")} Department Test
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-dalda-gray-900">{attempt.candidate.fullName}</p>
          <p className="text-xs text-dalda-gray-600">{attempt.candidate.department.replaceAll("_", " ")}</p>
        </div>
        <div className="rounded-md bg-dalda-red-light px-3 py-2 text-sm font-semibold text-dalda-red">
          Time left: {formatSeconds(remainingSeconds)}
        </div>
      </div>

      <div className="surface-card p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {sectionEntries.map(({ section, range }, sectionIndex) => {
            const isActive = currentIndex >= range.start && currentIndex <= range.end;
            const isUnlocked = sectionIndex <= unlockedSectionIndex;
            return (
              <button
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  isActive ? "bg-dalda-green text-white" : "bg-dalda-gray-50 text-dalda-gray-600"
                }`}
                disabled={!isUnlocked}
                key={section}
                onClick={() => {
                  if (!isUnlocked) {
                    return;
                  }
                  setCurrentIndex(range.start);
                }}
                type="button"
              >
                {section}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-medium text-dalda-gray-400">
          Question {currentIndex + 1} of {attempt.questions.length}
        </p>
        <h2 className="mt-2 text-base font-semibold text-dalda-gray-900">{current.question}</h2>

        <div className="mt-4 space-y-2">
          {current.options.map((option) => {
            const selected = attempt.answers[current.id] === option.id;
            return (
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                  selected
                    ? "border-dalda-green bg-dalda-green-light text-dalda-gray-900"
                    : "border-dalda-gray-100 bg-white text-dalda-gray-700"
                }`}
                key={option.id}
              >
                <input
                  checked={selected}
                  className="mt-0.5"
                  name={current.id}
                  onChange={() => {
                    const next = {
                      ...attempt,
                      answers: {
                        ...attempt.answers,
                        [current.id]: option.id
                      }
                    };
                    setAttempt(next);
                    localStorage.setItem(TEST_ATTEMPT_STORAGE_KEY, JSON.stringify(next));

                    const activeSection = sectionEntries[currentSectionIndex];
                    if (!activeSection) {
                      return;
                    }

                    let complete = true;
                    for (let index = activeSection.range.start; index <= activeSection.range.end; index += 1) {
                      const question = next.questions[index];
                      if (!question || !next.answers[question.id]) {
                        complete = false;
                        break;
                      }
                    }

                    if (!complete) {
                      return;
                    }

                    const nextSection = sectionEntries[currentSectionIndex + 1];
                    if (nextSection) {
                      setCurrentIndex(nextSection.range.start);
                    }
                  }}
                  type="radio"
                  value={option.id}
                />
                <span>
                  <strong>{option.id}.</strong> {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="surface-card flex flex-wrap items-center justify-between gap-2 p-4">
        <div className="flex gap-2">
          <Button
            disabled={currentIndex === 0 || submitted}
            onClick={() => setCurrentIndex((value) => Math.max(value - 1, 0))}
            type="button"
            variant="secondary"
          >
            Previous
          </Button>
          <Button
            disabled={
              currentIndex >= attempt.questions.length - 1 ||
              submitted ||
              (isAtSectionEnd && !canLeaveCurrentSection)
            }
            onClick={() => setCurrentIndex((value) => Math.min(value + 1, attempt.questions.length - 1))}
            type="button"
            variant="secondary"
          >
            Next
          </Button>
          <p className="self-center text-xs text-dalda-gray-500">
            Answered {answeredCount}/{attempt.questions.length}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={submitted || !allAnswered} type="button">
              {submitted ? "Submitting..." : "Submit Test"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit your test?</DialogTitle>
              <DialogDescription>
                You will not be able to go back after submission. Make sure you have reviewed all answers.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button disabled={!allAnswered} onClick={() => void submitAttempt(false)} type="button">
                Confirm Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!allAnswered ? (
        <p className="text-sm text-dalda-gray-600">Submit will be enabled after you answer all questions.</p>
      ) : null}
      {isAtSectionEnd && !canLeaveCurrentSection ? (
        <p className="text-sm text-dalda-gray-600">Please answer all questions in this section to continue.</p>
      ) : null}
      {error ? <p className="text-sm text-dalda-red">{error}</p> : null}
    </div>
  );
}
