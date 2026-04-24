import { z } from "zod";
import { testDepartments } from "@/lib/test/types";

export const testDepartmentEnum = z.enum(testDepartments);
const semesterEnum = z.enum(["6TH", "7TH", "8TH"]);
const internshipTrackEnum = z.enum(["INTERNSHIP", "MTO"]);
const studyLevelEnum = z.enum(["BACHELORS", "MASTERS"]);

export const candidateSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  fatherName: z.string().trim().min(2, "Father's name is required."),
  university: z.string().trim().min(2, "University is required."),
  department: testDepartmentEnum,
  semester: semesterEnum,
  internshipTrack: internshipTrackEnum,
  studyLevel: studyLevelEnum
});

export const startTestSchema = candidateSchema;
export const startTestRequestSchema = candidateSchema.extend({
  linkToken: z.string().trim().min(8, "Invalid test link.")
});

export const submitTestSchema = z.object({
  token: z.string().optional(),
  answers: z.record(z.string(), z.string()),
  timeTakenSeconds: z.number().int().min(0).max(60 * 60)
});
