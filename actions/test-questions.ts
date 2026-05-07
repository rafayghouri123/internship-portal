"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { dataAnalyticsQuestions } from "@/lib/test/data-analytics-bank";
import bank from "@/lib/test/question-bank.generated.json";
import { financeQuestions } from "@/lib/test/finance-bank";
import { hrQuestions } from "@/lib/test/hr-bank";
import { testDepartments } from "@/lib/test/types";

const questionDepartmentValues = [...testDepartments, "LOGICAL", "REASONING", "MATH"] as const;
const sharedSectionValues = ["LOGICAL", "REASONING", "MATH"] as const;

const createQuestionSchema = z.object({
  department: z.enum(questionDepartmentValues),
  question: z.string().trim().min(10, "Question text is required."),
  optionA: z.string().trim().min(1, "Option A is required."),
  optionB: z.string().trim().min(1, "Option B is required."),
  optionC: z.string().trim().min(1, "Option C is required."),
  optionD: z.string().trim().min(1, "Option D is required."),
  correctOption: z.enum(["A", "B", "C", "D"])
});

async function ensureHrUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
}

export async function createTestQuestion(input: {
  department: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
}) {
  await ensureHrUser();

  const parsed = createQuestionSchema.parse(input);
  const isSharedSection = (sharedSectionValues as readonly string[]).includes(parsed.department);
  const section = isSharedSection ? parsed.department : "FUNCTIONAL";
  const normalizedDepartment = isSharedSection ? "SHARED" : parsed.department;

  await prisma.testQuestion.create({
    data: {
      section,
      department: normalizedDepartment,
      question: parsed.question,
      optionA: parsed.optionA,
      optionB: parsed.optionB,
      optionC: parsed.optionC,
      optionD: parsed.optionD,
      correctOption: parsed.correctOption
    }
  });

  revalidatePath("/question-bank");
}

export async function deleteTestQuestion(id: string) {
  await ensureHrUser();
  if (!id) {
    throw new Error("Question id is required.");
  }

  await prisma.testQuestion.delete({
    where: { id }
  });

  revalidatePath("/question-bank");
}

export async function importDefaultQuestionBank() {
  await ensureHrUser();

  const currentCount = await prisma.testQuestion.count();
  if (currentCount > 0) {
    return { imported: 0, skipped: true };
  }

  const generated = bank as {
    functional: Record<string, Array<{ question: string; options: string[]; answer: string }>>;
    logical: Array<{ question: string; options: string[]; answer: string }>;
    reasoning: Array<{ question: string; options: string[]; answer: string }>;
    math: Array<{ question: string; options: string[]; answer: string }>;
  };

  const rows: Array<{
    section: string;
    department: string | null;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
  }> = [];

  for (const department of testDepartments) {
    const source =
      department === "FINANCE"
        ? financeQuestions
        : department === "HR"
          ? hrQuestions
          : department === "DATA_ANALYTICS"
            ? dataAnalyticsQuestions
          : generated.functional[department] ?? [];
    for (const item of source) {
      rows.push({
        section: "FUNCTIONAL",
        department,
        question: item.question,
        optionA: item.options[0] ?? "",
        optionB: item.options[1] ?? "",
        optionC: item.options[2] ?? "",
        optionD: item.options[3] ?? "",
        correctOption: item.answer
      });
    }
  }

  for (const item of generated.logical) {
    rows.push({
      section: "LOGICAL",
      department: "SHARED",
      question: item.question,
      optionA: item.options[0] ?? "",
      optionB: item.options[1] ?? "",
      optionC: item.options[2] ?? "",
      optionD: item.options[3] ?? "",
      correctOption: item.answer
    });
  }

  for (const item of generated.reasoning) {
    rows.push({
      section: "REASONING",
      department: "SHARED",
      question: item.question,
      optionA: item.options[0] ?? "",
      optionB: item.options[1] ?? "",
      optionC: item.options[2] ?? "",
      optionD: item.options[3] ?? "",
      correctOption: item.answer
    });
  }

  for (const item of generated.math) {
    rows.push({
      section: "MATH",
      department: "SHARED",
      question: item.question,
      optionA: item.options[0] ?? "",
      optionB: item.options[1] ?? "",
      optionC: item.options[2] ?? "",
      optionD: item.options[3] ?? "",
      correctOption: item.answer
    });
  }

  await prisma.testQuestion.createMany({
    data: rows
  });

  revalidatePath("/question-bank");
  return { imported: rows.length, skipped: false };
}
