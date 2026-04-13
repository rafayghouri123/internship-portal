"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { evaluationSchema, type EvaluationInput } from "@/lib/validations/evaluation";

export async function saveEvaluation(internId: string, data: EvaluationInput) {
  const parsed = evaluationSchema.parse(data);
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const overallScore = Number(
    (
      (parsed.punctuality +
        parsed.technicalSkills +
        parsed.communication +
        parsed.teamwork +
        parsed.initiative) /
      5
    ).toFixed(2)
  );

  return prisma.evaluation.upsert({
    where: { internId },
    update: {
      ...parsed,
      overallScore,
      evaluatedById: session.user.id
    },
    create: {
      ...parsed,
      overallScore,
      evaluatedById: session.user.id,
      internId
    }
  });
}
