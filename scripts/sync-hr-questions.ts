import { prisma } from "@/lib/prisma";
import { hrQuestions } from "@/lib/test/hr-bank";

async function run() {
  await prisma.testQuestion.deleteMany({
    where: {
      section: "FUNCTIONAL",
      department: "HR"
    }
  });

  await prisma.testQuestion.createMany({
    data: hrQuestions.map((question) => ({
      section: "FUNCTIONAL",
      department: "HR",
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
      department: "HR"
    }
  });

  console.log("hr source questions:", hrQuestions.length);
  console.log("hr db questions:", count);
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

