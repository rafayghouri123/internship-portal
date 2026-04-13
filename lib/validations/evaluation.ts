import { z } from "zod";
import { documentSchema } from "@/lib/validations/intern";

export const evaluationSchema = z.object({
  punctuality: z.coerce.number().int().min(1).max(5),
  technicalSkills: z.coerce.number().int().min(1).max(5),
  communication: z.coerce.number().int().min(1).max(5),
  teamwork: z.coerce.number().int().min(1).max(5),
  initiative: z.coerce.number().int().min(1).max(5),
  remarks: z.string().max(500).optional()
});

export const completeInternSchema = z.object({
  actualEndDate: z.coerce.date(),
  certificateFile: documentSchema.optional(),
  reportFile: documentSchema.optional()
});

export type EvaluationInput = z.infer<typeof evaluationSchema>;
export type CompleteInternInput = z.infer<typeof completeInternSchema>;
