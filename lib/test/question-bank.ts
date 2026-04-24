import bank from "@/lib/test/question-bank.generated.json";
import { financeQuestions } from "@/lib/test/finance-bank";
import { hrQuestions } from "@/lib/test/hr-bank";
import { prisma } from "@/lib/prisma";
import { InternalQuestion, TestDepartment, TestQuestion, TestSection, testDepartments } from "@/lib/test/types";

type GeneratedBank = {
  functional: Record<string, InternalQuestion[]>;
  logical: InternalQuestion[];
  reasoning: InternalQuestion[];
  math: InternalQuestion[];
};

const generated = bank as GeneratedBank;
const functionalPools: Record<TestDepartment, InternalQuestion[]> = {
  IT: generated.functional.IT ?? [],
  HR: hrQuestions,
  MARKETING: generated.functional.MARKETING ?? [],
  ELECTRONICS: generated.functional.ELECTRONICS ?? [],
  CHEMICAL: generated.functional.CHEMICAL ?? [],
  FINANCE: financeQuestions,
  QUALITY_ASSURANCE: generated.functional.QUALITY_ASSURANCE ?? [],
  SUPPLY_CHAIN: generated.functional.SUPPLY_CHAIN ?? [],
  MECHANICAL: generated.functional.MECHANICAL ?? []
};

const optionIds: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

function toPublicQuestion(question: InternalQuestion, section: TestSection): TestQuestion {
  return {
    id: question.id,
    section,
    question: question.question,
    options: question.options.slice(0, 4).map((label, index) => ({
      id: optionIds[index] ?? "D",
      label
    }))
  };
}

function sampleQuestions(pool: InternalQuestion[], count: number): InternalQuestion[] {
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }
  return copy.slice(0, count);
}

export function assertQuestionBankIntegrity(department: TestDepartment) {
  const functionalCount = (functionalPools[department] ?? []).length;
  if (functionalCount < 15) {
    throw new Error(`Not enough functional questions for ${department}. Expected >= 15, found ${functionalCount}.`);
  }

  if (generated.logical.length < 5 || generated.reasoning.length < 5 || generated.math.length < 5) {
    throw new Error("Shared test pools must contain at least 5 questions each.");
  }
}

function getFallbackAttempt(department: TestDepartment) {
  assertQuestionBankIntegrity(department);

  const functional = sampleQuestions(functionalPools[department] ?? [], 15);
  const logical = sampleQuestions(generated.logical, 5);
  const reasoning = sampleQuestions(generated.reasoning, 5);
  const math = sampleQuestions(generated.math, 5);

  return {
    questions: [
      ...functional.map((question) => toPublicQuestion(question, "FUNCTIONAL")),
      ...logical.map((question) => toPublicQuestion(question, "LOGICAL")),
      ...reasoning.map((question) => toPublicQuestion(question, "REASONING")),
      ...math.map((question) => toPublicQuestion(question, "MATH"))
    ],
    questionIds: {
      functional: functional.map((question) => question.id),
      logical: logical.map((question) => question.id),
      reasoning: reasoning.map((question) => question.id),
      math: math.map((question) => question.id)
    }
  };
}

function toInternalQuestion(row: {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}): InternalQuestion {
  const normalized = row.correctOption.toUpperCase();
  const answer: "A" | "B" | "C" | "D" = normalized === "A" || normalized === "B" || normalized === "C" ? normalized : "D";

  return {
    id: row.id,
    question: row.question,
    options: [row.optionA, row.optionB, row.optionC, row.optionD],
    answer
  };
}

async function getDbPools(department: TestDepartment) {
  const [functionalRows, logicalRows, reasoningRows, mathRows] = await Promise.all([
    prisma.testQuestion.findMany({
      where: {
        isActive: true,
        section: "FUNCTIONAL",
        department
      }
    }),
    prisma.testQuestion.findMany({
      where: {
        isActive: true,
        section: "LOGICAL",
        OR: [{ department: "SHARED" }, { department: null }]
      }
    }),
    prisma.testQuestion.findMany({
      where: {
        isActive: true,
        section: "REASONING",
        OR: [{ department: "SHARED" }, { department: null }]
      }
    }),
    prisma.testQuestion.findMany({
      where: {
        isActive: true,
        section: "MATH",
        OR: [{ department: "SHARED" }, { department: null }]
      }
    })
  ]);

  return {
    functional: functionalRows.map(toInternalQuestion),
    logical: logicalRows.map(toInternalQuestion),
    reasoning: reasoningRows.map(toInternalQuestion),
    math: mathRows.map(toInternalQuestion)
  };
}

export async function buildAttemptQuestions(department: TestDepartment) {
  if (process.env.DATABASE_URL) {
    try {
      const pools = await getDbPools(department);
      if (pools.functional.length >= 15 && pools.logical.length >= 5 && pools.reasoning.length >= 5 && pools.math.length >= 5) {
        const functional = sampleQuestions(pools.functional, 15);
        const logical = sampleQuestions(pools.logical, 5);
        const reasoning = sampleQuestions(pools.reasoning, 5);
        const math = sampleQuestions(pools.math, 5);

        return {
          questions: [
            ...functional.map((question) => toPublicQuestion(question, "FUNCTIONAL")),
            ...logical.map((question) => toPublicQuestion(question, "LOGICAL")),
            ...reasoning.map((question) => toPublicQuestion(question, "REASONING")),
            ...math.map((question) => toPublicQuestion(question, "MATH"))
          ],
          questionIds: {
            functional: functional.map((question) => question.id),
            logical: logical.map((question) => question.id),
            reasoning: reasoning.map((question) => question.id),
            math: math.map((question) => question.id)
          }
        };
      }
    } catch {
      // fall back to static bank when DB question bank is unavailable.
    }
  }

  return getFallbackAttempt(department);
}

const allQuestionsById = (() => {
  const map = new Map<string, InternalQuestion>();

  for (const department of testDepartments) {
    for (const question of functionalPools[department] ?? []) {
      map.set(question.id, question);
    }
  }
  for (const question of generated.logical) {
    map.set(question.id, question);
  }
  for (const question of generated.reasoning) {
    map.set(question.id, question);
  }
  for (const question of generated.math) {
    map.set(question.id, question);
  }

  return map;
})();

export async function scoreAttempt(questionIds: string[], answers: Record<string, string>) {
  let score = 0;
  const dbAnswerMap = new Map<string, string>();

  if (process.env.DATABASE_URL && questionIds.length > 0) {
    try {
      const rows = await prisma.testQuestion.findMany({
        where: {
          id: {
            in: questionIds
          }
        },
        select: {
          id: true,
          correctOption: true
        }
      });

      for (const row of rows) {
        dbAnswerMap.set(row.id, row.correctOption.toUpperCase());
      }
    } catch {
      // Ignore DB errors and continue with static fallback.
    }
  }

  for (const questionId of questionIds) {
    const selected = answers[questionId];
    if (!selected) {
      continue;
    }

    const expected = dbAnswerMap.get(questionId) ?? allQuestionsById.get(questionId)?.answer;
    if (!expected) {
      continue;
    }

    if (selected.toUpperCase() === expected.toUpperCase()) {
      score += 1;
    }
  }

  return {
    score,
    total: questionIds.length
  };
}

export async function hasFunctionalPool(department: TestDepartment) {
  if (process.env.DATABASE_URL) {
    try {
      const dbCount = await prisma.testQuestion.count({
        where: {
          section: "FUNCTIONAL",
          department,
          isActive: true
        }
      });

      if (dbCount >= 15) {
        return true;
      }
    } catch {
      // ignore and fall back
    }
  }

  return (functionalPools[department] ?? []).length >= 15;
}
