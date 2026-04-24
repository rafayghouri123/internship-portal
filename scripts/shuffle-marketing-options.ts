import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";

type Question = {
  id: string;
  question: string;
  options: string[];
  answer: "A" | "B" | "C" | "D";
};

type Bank = {
  functional: Record<string, Question[]>;
};

const answerLetters: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];
const targetCycle: Array<"A" | "C" | "D"> = ["A", "C", "D"];

function buildShuffledQuestion(question: Question, index: number): Question {
  const oldCorrectIndex = answerLetters.indexOf(question.answer);
  if (oldCorrectIndex < 0) {
    return question;
  }

  let targetLetter = targetCycle[index % targetCycle.length];
  if (targetLetter === question.answer) {
    targetLetter = targetCycle[(index + 1) % targetCycle.length];
  }
  const targetIndex = answerLetters.indexOf(targetLetter);

  const correctOption = question.options[oldCorrectIndex];
  const otherOptions = question.options.filter((_, optionIndex) => optionIndex !== oldCorrectIndex);

  const nextOptions = ["", "", "", ""];
  nextOptions[targetIndex] = correctOption;

  let otherPointer = 0;
  for (let optionIndex = 0; optionIndex < nextOptions.length; optionIndex += 1) {
    if (optionIndex === targetIndex) {
      continue;
    }
    nextOptions[optionIndex] = otherOptions[otherPointer] ?? "";
    otherPointer += 1;
  }

  return {
    ...question,
    options: nextOptions,
    answer: targetLetter
  };
}

async function run() {
  const bankPath = path.join(process.cwd(), "lib", "test", "question-bank.generated.json");
  const bank = JSON.parse(fs.readFileSync(bankPath, "utf8")) as Bank;

  const marketing = bank.functional.MARKETING ?? [];
  const shuffled = marketing.map((question, index) => buildShuffledQuestion(question, index));
  bank.functional.MARKETING = shuffled;

  fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2), "utf8");

  await prisma.testQuestion.deleteMany({
    where: {
      section: "FUNCTIONAL",
      department: "MARKETING"
    }
  });

  await prisma.testQuestion.createMany({
    data: shuffled.map((question) => ({
      section: "FUNCTIONAL",
      department: "MARKETING",
      question: question.question,
      optionA: question.options[0] ?? "",
      optionB: question.options[1] ?? "",
      optionC: question.options[2] ?? "",
      optionD: question.options[3] ?? "",
      correctOption: question.answer,
      isActive: true
    }))
  });

  const distribution = shuffled.reduce<Record<string, number>>(
    (acc, question) => {
      acc[question.answer] = (acc[question.answer] ?? 0) + 1;
      return acc;
    },
    { A: 0, B: 0, C: 0, D: 0 }
  );

  console.log("Marketing questions updated:", shuffled.length);
  console.log("New correct-answer distribution:", distribution);
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
