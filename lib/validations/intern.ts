import { z } from "zod";
import { InternshipType } from "@prisma/client";
import { applicationChannelOptions, internshipOfficeOptions } from "@/lib/intern-options";

function normalizeCnic(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length !== 13) {
    return value.trim();
  }

  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}

function normalizePakistanPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("03")) {
    return digits;
  }

  if (digits.length === 12 && digits.startsWith("923")) {
    return `0${digits.slice(2)}`;
  }

  return value.trim();
}

export const documentSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string().url(),
  uploadedAt: z.string(),
  originalFilename: z.string().optional(),
  bytes: z.number().optional()
});

export const personalInfoSchema = z.object({
  fullName: z.string().min(2).max(100),
  fatherName: z.string().min(2).max(100),
  cnicNumber: z
    .string()
    .transform(normalizeCnic)
    .pipe(z.string().regex(/^\d{5}-\d{7}-\d$/, "Format: XXXXX-XXXXXXX-X")),
  contactNumber: z
    .string()
    .transform(normalizePakistanPhone)
    .pipe(z.string().regex(/^03\d{9}$/, "Format: 03XXXXXXXXX")),
  email: z.string().email(),
  city: z.string().min(2),
  address: z.string().min(5),
  university: z.string().min(2),
  officeLocation: z.enum(internshipOfficeOptions),
  degree: z.string().min(2),
  major: z.string().min(2).max(100),
  currentSemester: z.coerce.number().int().min(1).max(10),
  graduationYear: z.coerce.number().int().min(2024).max(2032)
});

export const internshipDetailsSchema = z.object({
  departmentId: z.string().cuid(),
  durationWeeks: z.coerce.number().int().min(1).max(52),
  internshipType: z.nativeEnum(InternshipType),
  applicationSource: z.enum(applicationChannelOptions),
  knownEmployee: z.string().optional(),
  comments: z.string().max(500).optional(),
  supervisorName: z.string().min(2, "Supervisor name is required").max(100),
  supervisorEmail: z.string().email("Enter a valid supervisor email").optional().or(z.literal(""))
});

export const officeUseBaseSchema = z.object({
  reference: z.string().optional(),
  testScore: z.coerce.number().min(0).max(100).optional(),
  testDate: z.coerce.date().optional(),
  joiningDate: z.coerce.date(),
  endDate: z.coerce.date(),
  extraNotes: z.string().optional()
});

export const officeUseSchema = officeUseBaseSchema
  .refine((data) => data.endDate > data.joiningDate, {
    message: "End date must be after joining date",
    path: ["endDate"]
  });

export const createInternSchema = personalInfoSchema
  .merge(internshipDetailsSchema)
  .merge(officeUseBaseSchema)
  .extend({
    cvFile: documentSchema.optional()
  })
  .refine((data) => data.endDate > data.joiningDate, {
    message: "End date must be after joining date",
    path: ["endDate"]
  });

export const updateInternSchema = personalInfoSchema
  .merge(internshipDetailsSchema)
  .merge(officeUseBaseSchema)
  .extend({
    cvFile: documentSchema.optional()
  })
  .partial();

export const extendSchema = z.object({
  newEndDate: z.coerce.date(),
  reason: z.string().max(300).optional()
});

export type CreateInternInput = z.infer<typeof createInternSchema>;
export type UpdateInternInput = z.infer<typeof updateInternSchema>;
export type ExtendInput = z.infer<typeof extendSchema>;
