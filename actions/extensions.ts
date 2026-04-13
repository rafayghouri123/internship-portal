"use server";

import { InternStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { extendSchema, type ExtendInput } from "@/lib/validations/intern";

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

export async function extendEndDate(id: string, data: ExtendInput) {
  const parsed = extendSchema.parse(data);
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const currentIntern = await prisma.intern.findUnique({
    where: { id }
  });

  if (!currentIntern) {
    throw new Error("Intern not found");
  }

  const extension = await prisma.extensionLog.create({
    data: {
      internId: id,
      extendedById: userId,
      previousEndDate: currentIntern.endDate,
      newEndDate: parsed.newEndDate,
      reason: parsed.reason
    }
  });

  await prisma.intern.update({
    where: { id },
    data: {
      endDate: parsed.newEndDate,
      status: InternStatus.EXTENDED
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/interns");
  revalidatePath(`/interns/${id}`);

  return extension;
}
