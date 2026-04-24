import { prisma } from "@/lib/prisma";
import { financeQuestions } from "@/lib/test/finance-bank";

async function run() {
  await prisma.testQuestion.deleteMany({
    where: {
      section: "FUNCTIONAL",
      department: "FINANCE"
    }
  });

  await prisma.testQuestion.createMany({
    data: financeQuestions.map((question) => ({
      section: "FUNCTIONAL",
      department: "FINANCE",
      question: question.question,
      optionA: question.options[0] ?? "",
      optionB: question.options[1] ?? "",
      optionC: question.options[2] ?? "",
      optionD: question.options[3] ?? "",
      correctOption: question.answer,
      isActive: true
    }))
  });

  const count = await prisma.testQuestion.count({
    where: {
      section: "FUNCTIONAL",
      department: "FINANCE"
    }
  });

  console.log("finance source questions:", financeQuestions.length);
  console.log("finance db questions:", count);
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
