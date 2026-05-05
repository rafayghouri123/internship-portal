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
import {
  TEST_ATTEMPT_STORAGE_KEY,
  TEST_DURATION_SECONDS,
  TEST_GUIDE_ACK_STORAGE_KEY,
  TEST_RESULT_STORAGE_KEY
} from "@/lib/test/constants";
import { CandidateInfo, TestDepartment, TestQuestion } from "@/lib/test/types";

type AttemptState = {
  token: string;
  startedAt: number;
  durationSeconds: number;
  candidate: CandidateInfo;
  questions: TestQuestion[];
  answers: Record<string, string>;
};

type SubmitResponse = {
  score: number;
  total: number;
  timeTakenSeconds: number;
};

export type GuideContent = {
  title: string;
  description: string;
  sampleQuestion: string;
  options: Array<{ id: "A" | "B" | "C" | "D"; label: string }>;
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
};

export const sharedSectionGuides: Record<"LOGICAL" | "REASONING" | "MATH", GuideContent> = {
  LOGICAL: {
    title: "Logical Section Guide",
    description:
      "The following questions are designed to assess your ability to draw valid conclusions from written information. In each question, read the statement carefully and choose the only option that must be true based on the given facts.",
    sampleQuestion:
      "All interns in Team Alpha submit a weekly progress report. Hina is an intern in Team Alpha. Which conclusion is valid?",
    options: [
      { id: "A", label: "Hina may not need to submit progress reports." },
      { id: "B", label: "Hina must submit a weekly progress report." },
      { id: "C", label: "Only Team Alpha interns submit any reports." },
      { id: "D", label: "Hina already submitted all future reports." }
    ],
    correctAnswer: "B",
    explanation:
      "The rule applies to all Team Alpha interns, and Hina is in Team Alpha."
  },
  REASONING: {
    title: "Reasoning Section Guide",
    description:
      "The following questions are designed to assess your pattern recognition and structured reasoning ability. Focus on the rule provided in the question and select the option that correctly follows that rule.",
    sampleQuestion:
      "Pattern Rule: Each figure contains a shape with a number of sides that equals its row number multiplied by its column number (Row x Column = sides). What shape appears in Row 2, Column 3?",
    options: [
      { id: "A", label: "Pentagon (5 sides)" },
      { id: "B", label: "Hexagon (6 sides)" },
      { id: "C", label: "Triangle (3 sides)" },
      { id: "D", label: "Square (4 sides)" }
    ],
    correctAnswer: "B",
    explanation:
      "Row 2 x Column 3 = 6, so the required shape must have 6 sides, which is a hexagon."
  },
  MATH: {
    title: "Math Section Guide",
    description:
      "The following questions are designed to assess your quantitative ability using arithmetic, percentages, ratios, and practical numerical interpretation. Show careful step-by-step thinking and choose the most accurate option.",
    sampleQuestion:
      "An intern receives a stipend of PKR 20,000. If 15% is spent on travel, how much is left?",
    options: [
      { id: "A", label: "PKR 17,000" },
      { id: "B", label: "PKR 16,500" },
      { id: "C", label: "PKR 15,000" },
      { id: "D", label: "PKR 18,000" }
    ],
    correctAnswer: "A",
    explanation:
      "15% of 20,000 is 3,000. Remaining amount is 20,000 - 3,000 = 17,000."
  }
};

export const functionalDepartmentGuides: Record<TestDepartment, GuideContent> = {
  IT: {
    title: "IT Functional Guide",
    description:
      "The following questions assess your practical IT decision-making in real-world support and system scenarios. You will evaluate symptoms, identify likely technical causes, and choose the most effective first-response action.",
    sampleQuestion:
      "A web app is slow only when loading reports. CPU usage is low, but database query time is very high. What is the best first step?",
    options: [
      { id: "A", label: "Increase server RAM immediately." },
      { id: "B", label: "Optimize and index the slow database queries." },
      { id: "C", label: "Change the website color theme." },
      { id: "D", label: "Disable logging forever." }
    ],
    correctAnswer: "B",
    explanation:
      "The bottleneck is query time, so query tuning/indexing should be investigated first."
  },
  HR: {
    title: "HR Functional Guide",
    description:
      "These questions test core HR concepts including recruitment, job design, compensation, benefits, and performance management. Choose the option that is most accurate in practical HR context.",
    sampleQuestion: "What is the purpose of a job description?",
    options: [
      { id: "A", label: "To describe the company mission and values only" },
      { id: "B", label: "To describe job duties and responsibilities" },
      { id: "C", label: "To define only marketing strategy" },
      { id: "D", label: "None of the above" }
    ],
    correctAnswer: "B",
    explanation:
      "A job description primarily defines role duties, responsibilities, and scope."
  },
  MARKETING: {
    title: "Marketing Functional Guide",
    description:
      "These questions test campaign thinking, audience targeting, funnel stages, communication decisions, and performance metrics. Focus on business impact, not just creative preference.",
    sampleQuestion:
      "A campaign has high impressions but low click-through rate. What is the best first action?",
    options: [
      { id: "A", label: "Increase budget immediately." },
      { id: "B", label: "Change the landing page server." },
      { id: "C", label: "Test new ad creatives and hooks." },
      { id: "D", label: "Stop the campaign permanently." }
    ],
    correctAnswer: "C",
    explanation:
      "Low CTR usually indicates weak messaging or weak creative relevance for the audience."
  },
  ELECTRONICS: {
    title: "Electronics Functional Guide",
    description:
      "The following questions assess your electronics troubleshooting and measurement logic. You will analyze component behavior, signal paths, and practical diagnostics to identify the most technically sound response.",
    sampleQuestion:
      "A 5V sensor output is read as 0V on the controller input. Which check should come first?",
    options: [
      { id: "A", label: "Replace the office internet router." },
      { id: "B", label: "Verify ground and wiring continuity between sensor and controller." },
      { id: "C", label: "Increase room temperature." },
      { id: "D", label: "Update the HR policy document." }
    ],
    correctAnswer: "B",
    explanation:
      "A missing shared ground or broken wire is a common first-cause for zero input readings."
  },
  CHEMICAL: {
    title: "Chemical Functional Guide",
    description:
      "The following questions assess your chemical process understanding with emphasis on safety, control, and operational judgment. Select the response that aligns with standard process discipline and safe plant practice.",
    sampleQuestion:
      "A reaction vessel temperature is rising above the safe operating limit. What is the best immediate action?",
    options: [
      { id: "A", label: "Ignore until the next shift." },
      { id: "B", label: "Follow emergency SOP: reduce heat input and start approved cooling control action." },
      { id: "C", label: "Increase feed rate to finish faster." },
      { id: "D", label: "Turn off all plant alarms." }
    ],
    correctAnswer: "B",
    explanation:
      "The safe first response is to follow approved emergency controls to bring temperature back into safe range."
  },
  FINANCE: {
    title: "Finance Functional Guide",
    description:
      "The following questions assess your finance and accounting reasoning in practical business situations. Focus on cash-flow impact, financial interpretation, internal control logic, and decision quality.",
    sampleQuestion:
      "A company shows strong sales growth but negative operating cash flow. What is the most likely concern?",
    options: [
      { id: "A", label: "Healthy cash conversion with no risk." },
      { id: "B", label: "Possible working-capital stress, such as delayed customer collections." },
      { id: "C", label: "Gross profit must be zero." },
      { id: "D", label: "Depreciation creates immediate cash inflow." }
    ],
    correctAnswer: "B",
    explanation:
      "Sales can rise while cash remains tight if receivables increase or collections are delayed."
  },
  QUALITY_ASSURANCE: {
    title: "Quality Assurance Functional Guide",
    description:
      "The following questions assess your quality assurance judgment, including containment, root-cause orientation, and compliance-focused decision making. Choose actions that protect product integrity and process reliability.",
    sampleQuestion:
      "Defect rate rises on one packaging line for two consecutive shifts. What is the best first QA response?",
    options: [
      { id: "A", label: "Ship all units immediately without checks." },
      { id: "B", label: "Start containment, isolate suspect batches, and begin root-cause analysis." },
      { id: "C", label: "Delete previous quality records." },
      { id: "D", label: "Stop recording defects to improve KPI." }
    ],
    correctAnswer: "B",
    explanation:
      "Containment plus root-cause analysis is the standard QA-first response to recurring defects."
  },
  SUPPLY_CHAIN: {
    title: "Supply Chain Functional Guide",
    description:
      "The following questions assess your supply chain decision-making in sourcing, planning, inventory risk, and operational continuity. Prioritize options that reduce disruption while maintaining execution control.",
    sampleQuestion:
      "A critical raw material delivery is delayed and current stock covers only two days. What is the best immediate action?",
    options: [
      { id: "A", label: "Wait silently and hope shipment arrives." },
      { id: "B", label: "Escalate risk, evaluate approved alternate supplier or redistribution plan, and update production plan." },
      { id: "C", label: "Cancel all future procurement permanently." },
      { id: "D", label: "Increase finished goods giveaway." }
    ],
    correctAnswer: "B",
    explanation:
      "Fast risk escalation and a validated mitigation plan reduce stockout impact."
  },
  MECHANICAL: {
    title: "Mechanical Functional Guide",
    description:
      "The following questions assess your mechanical troubleshooting and maintenance judgment. You will evaluate equipment symptoms and select responses that support reliability, safety, and correct fault isolation.",
    sampleQuestion:
      "A conveyor motor shows overheating and unusual vibration during operation. What should be checked first?",
    options: [
      { id: "A", label: "Bearing condition and shaft alignment." },
      { id: "B", label: "Office printer toner level." },
      { id: "C", label: "Marketing campaign budget." },
      { id: "D", label: "Cafeteria menu quality." }
    ],
    correctAnswer: "A",
    explanation:
      "Overheating with vibration commonly indicates bearing wear or alignment issues."
  }
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
  const [seenSectionExamples, setSeenSectionExamples] = useState<Record<TestQuestion["section"], boolean>>({
    FUNCTIONAL: false,
    LOGICAL: false,
    REASONING: false,
    MATH: false
  });

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
    const currentSection = attempt?.questions?.[currentIndex]?.section;
    const isSectionExampleOpen = currentSection ? !seenSectionExamples[currentSection] : false;
    if (!attempt || submitted || isSectionExampleOpen) {
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
  }, [attempt, submitted, currentIndex, seenSectionExamples]);

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

  useEffect(() => {
    if (!attempt || submitted) {
      return;
    }

    const onCopy = (event: ClipboardEvent) => event.preventDefault();
    const onCut = (event: ClipboardEvent) => event.preventDefault();
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && ["c", "x", "a", "u", "s", "p"].includes(key)) {
        event.preventDefault();
      }
      if (event.key === "F12") {
        event.preventDefault();
      }
    };

    window.addEventListener("copy", onCopy);
    window.addEventListener("cut", onCut);
    window.addEventListener("contextmenu", onContextMenu);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("copy", onCopy);
      window.removeEventListener("cut", onCut);
      window.removeEventListener("contextmenu", onContextMenu);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [attempt, submitted]);

  const current = useMemo(() => {
    if (!attempt) {
      return null;
    }
    return attempt.questions[currentIndex] ?? null;
  }, [attempt, currentIndex]);

  const sectionGuideContent: GuideContent | null =
    current?.section === "FUNCTIONAL"
      ? attempt
        ? functionalDepartmentGuides[attempt.candidate.department]
        : null
      : current?.section === "LOGICAL" || current?.section === "REASONING" || current?.section === "MATH"
        ? sharedSectionGuides[current.section]
        : null;
  const showSectionExample = current ? !seenSectionExamples[current.section] : false;

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
    localStorage.removeItem(TEST_GUIDE_ACK_STORAGE_KEY);
    router.replace("/test/done");
  };

  if (!attempt || !current) {
    return (
      <div className="test-panel rounded-2xl p-6">
        <p className="text-sm text-dalda-gray-200/90">Loading test attempt...</p>
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
      <div className="test-panel flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <Image alt="Dalda Foods" className="h-10 w-14 object-contain" height={40} src="/dalda-logo.png" width={56} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-dalda-gray-300">Internship Assessment Test</p>
            <p className="text-sm font-semibold text-dalda-gray-50">
              {attempt.candidate.department.replaceAll("_", " ")} Department Test
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-dalda-gray-50">{attempt.candidate.fullName}</p>
          <p className="text-xs text-dalda-gray-300">{attempt.candidate.department.replaceAll("_", " ")}</p>
        </div>
        <div className="rounded-md bg-rose-300/20 px-3 py-2 text-sm font-semibold text-rose-200">
          Time left: {formatSeconds(remainingSeconds)}
        </div>
      </div>

      {showSectionExample && sectionGuideContent ? (
        <div
          className="test-panel test-protected rounded-2xl p-4"
          onContextMenu={(event) => event.preventDefault()}
          onCopy={(event) => event.preventDefault()}
          onCut={(event) => event.preventDefault()}
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-dalda-green">{sectionGuideContent.title}</p>
          <p className="mt-2 text-base text-dalda-gray-100">{sectionGuideContent.description}</p>
          <div className="mt-3 rounded-md border border-dalda-green-muted/35 bg-black/20 p-3">
            <p className="text-sm font-semibold text-dalda-gray-300">Sample question (for understanding)</p>
            <p className="mt-2 text-lg font-medium text-dalda-gray-50">{sectionGuideContent.sampleQuestion}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {sectionGuideContent.options.map((option) => (
                <div className="rounded-md border border-dalda-green-muted/30 bg-black/25 px-3 py-2 text-sm text-dalda-gray-100" key={option.id}>
                  <strong>{option.id}.</strong> {option.label}
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm font-semibold text-dalda-green">Correct answer: {sectionGuideContent.correctAnswer}</p>
            <p className="mt-1 text-sm text-dalda-gray-200/90">{sectionGuideContent.explanation}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                if (!current) return;
                setSeenSectionExamples((prev) => ({ ...prev, [current.section]: true }));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              type="button"
            >
              Continue to {current.section}
            </Button>
          </div>
        </div>
      ) : null}

      {!showSectionExample ? (
      <div
        className="test-panel test-protected rounded-2xl p-4"
        onContextMenu={(event) => event.preventDefault()}
        onCopy={(event) => event.preventDefault()}
        onCut={(event) => event.preventDefault()}
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {sectionEntries.map(({ section, range }, sectionIndex) => {
            const isActive = currentIndex >= range.start && currentIndex <= range.end;
            const isUnlocked = sectionIndex <= unlockedSectionIndex;
            return (
              <button
                className={`rounded-md px-3 py-1 text-xs font-medium ${
                  isActive ? "bg-dalda-green text-white" : "bg-black/25 text-dalda-gray-200"
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

        <p className="text-xs font-medium text-dalda-gray-300">
          Question {currentIndex + 1} of {attempt.questions.length}
        </p>
        <h2 className="mt-2 text-base font-semibold text-dalda-gray-50">{current.question}</h2>

        <div className="mt-4 space-y-2">
          {current.options.map((option) => {
            const selected = attempt.answers[current.id] === option.id;
            return (
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm ${
                  selected
                    ? "border-dalda-green bg-dalda-green-light text-dalda-gray-900"
                    : "border-dalda-green-muted/30 bg-black/20 text-dalda-gray-100"
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
      ) : null}

      {!showSectionExample ? (
      <div className="test-panel flex flex-wrap items-center justify-between gap-2 rounded-2xl p-4">
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
          <p className="self-center text-xs text-dalda-gray-200">
            Answered {answeredCount}/{attempt.questions.length}
          </p>
        </div>

        {allAnswered ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={submitted} type="button">
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
                <Button onClick={() => void submitAttempt(false)} type="button">
                  Confirm Submit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
      ) : null}

      {!allAnswered ? (
        <p className="text-sm text-dalda-gray-100">Submit will be enabled after you answer all questions.</p>
      ) : null}
      {isAtSectionEnd && !canLeaveCurrentSection ? (
        <p className="text-sm text-dalda-gray-100">Please answer all questions in this section to continue.</p>
      ) : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
