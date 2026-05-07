import { prisma } from "@/lib/prisma";
import { dataAnalyticsQuestions } from "@/lib/test/data-analytics-bank";

async function run() {
  await prisma.testQuestion.deleteMany({
    where: {
      section: "FUNCTIONAL",
      department: "DATA_ANALYTICS"
    }
  });

  await prisma.testQuestion.createMany({
    data: dataAnalyticsQuestions.map((question) => ({
      section: "FUNCTIONAL",
      department: "DATA_ANALYTICS",
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
      department: "DATA_ANALYTICS"
    }
  });

  console.log("data analytics source questions:", dataAnalyticsQuestions.length);
  console.log("data analytics db questions:", count);
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
