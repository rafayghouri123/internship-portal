"use server";

import { InternStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createInternSchema,
  type CreateInternInput,
  type UpdateInternInput,
  updateInternSchema
} from "@/lib/validations/intern";
import { completeInternSchema, type CompleteInternInput } from "@/lib/validations/evaluation";

async function getCurrentUserId() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  if (session.user.id) {
    const existingById = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (existingById) {
      return existingById.id;
    }
  }

  const existingByEmail = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  return existingByEmail?.id ?? null;
}

export async function createIntern(data: CreateInternInput) {
  const parsed = createInternSchema.parse(data);
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const createData: Prisma.InternUncheckedCreateInput = {
    fullName: parsed.fullName,
    fatherName: parsed.fatherName,
    cnicNumber: parsed.cnicNumber,
    contactNumber: parsed.contactNumber,
    email: parsed.email,
    city: parsed.city,
    address: parsed.address,
    university: parsed.university,
    officeLocation: parsed.officeLocation,
    degree: parsed.degree,
    major: parsed.major,
    currentSemester: parsed.currentSemester,
    graduationYear: parsed.graduationYear,
    departmentId: parsed.departmentId,
    durationWeeks: parsed.durationWeeks,
    referralSource: parsed.applicationSource,
    internshipType: parsed.internshipType,
    applicationSource: parsed.applicationSource,
    knownEmployee: parsed.knownEmployee,
    previousIntern: false,
    comments: parsed.comments,
    supervisorName: parsed.supervisorName,
    supervisorEmail: parsed.supervisorEmail || null,
    reference: parsed.reference,
    testScore: parsed.testScore,
    testDate: parsed.testDate,
    supervisorId: null,
    joiningDate: parsed.joiningDate,
    endDate: parsed.endDate,
    extraNotes: parsed.extraNotes,
    cvFile: parsed.cvFile as Prisma.InputJsonValue | undefined,
    addedById: userId
  };

  try {
    const intern = await prisma.intern.create({
      data: createData
    });

    revalidatePath("/dashboard");
    revalidatePath("/interns");
    revalidatePath(`/interns/${intern.id}`);

    return intern;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && Array.isArray(error.meta?.target) && error.meta.target.includes("cnicNumber")) {
        throw new Error("CNIC already exists");
      }

      if (error.code === "P2003") {
        throw new Error("Your session is out of date or a linked record is missing. Please sign in again.");
      }
    }

    throw error;
  }
}

export async function updateIntern(id: string, data: UpdateInternInput) {
  const parsed = updateInternSchema.parse(data);

  const updateData: Prisma.InternUncheckedUpdateInput = {
    fullName: parsed.fullName,
    fatherName: parsed.fatherName,
    cnicNumber: parsed.cnicNumber,
    contactNumber: parsed.contactNumber,
    email: parsed.email,
    city: parsed.city,
    address: parsed.address,
    university: parsed.university,
    officeLocation: parsed.officeLocation,
    degree: parsed.degree,
    major: parsed.major,
    currentSemester: parsed.currentSemester,
    graduationYear: parsed.graduationYear,
    departmentId: parsed.departmentId,
    durationWeeks: parsed.durationWeeks,
    referralSource: parsed.applicationSource,
    internshipType: parsed.internshipType,
    applicationSource: parsed.applicationSource,
    knownEmployee: parsed.knownEmployee,
    previousIntern: false,
    comments: parsed.comments,
    supervisorName: parsed.supervisorName,
    supervisorEmail: parsed.supervisorEmail || null,
    reference: parsed.reference,
    testScore: parsed.testScore,
    testDate: parsed.testDate,
    supervisorId: null,
    joiningDate: parsed.joiningDate,
    endDate: parsed.endDate,
    extraNotes: parsed.extraNotes,
    cvFile: parsed.cvFile as Prisma.InputJsonValue | undefined
  };

  const intern = await prisma.intern.update({
    where: { id },
    data: updateData
  });

  revalidatePath("/interns");
  revalidatePath(`/interns/${id}`);

  return intern;
}

export async function markCompleted(id: string, data: CompleteInternInput) {
  const parsed = completeInternSchema.parse(data);

  const updated = await prisma.intern.update({
    where: { id },
    data: {
      endDate: parsed.actualEndDate,
      status: InternStatus.COMPLETED,
      certificateFile: parsed.certificateFile as Prisma.InputJsonValue | undefined,
      reportFile: parsed.reportFile as Prisma.InputJsonValue | undefined
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/interns");
  revalidatePath(`/interns/${id}`);

  return updated;
}

export async function markTerminated(id: string) {
  const intern = await prisma.intern.update({
    where: { id },
    data: { status: InternStatus.TERMINATED }
  });

  revalidatePath("/dashboard");
  revalidatePath("/interns");
  revalidatePath(`/interns/${id}`);

  return intern;
}

export async function checkCnicExists(cnic: string) {
  const existing = await prisma.intern.findUnique({
    where: { cnicNumber: cnic }
  });

  return Boolean(existing);
}
