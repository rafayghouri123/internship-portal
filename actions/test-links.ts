"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function ensureHrUser() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

function generateToken() {
  return crypto.randomBytes(16).toString("base64url");
}

export async function createTestLink() {
  const user = await ensureHrUser();
  const userId = user.id || null;
  let createdById: string | null = null;

  if (userId) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    createdById = existingUser?.id ?? null;
  }

  const created = await prisma.testLink.create({
    data: {
      token: generateToken(),
      createdById
    }
  });

  revalidatePath("/test-links");
  return created;
}

export async function deleteTestLink(id: string) {
  await ensureHrUser();
  if (!id) {
    throw new Error("Link id is required.");
  }

  await prisma.testLink.delete({
    where: { id }
  });

  revalidatePath("/test-links");
}
