"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createDepartmentSchema = z.object({
  name: z.string().min(2, "Department name is required").max(100, "Department name is too long")
});

export async function createDepartment(input: { name: string }) {
  const parsed = createDepartmentSchema.parse(input);

  try {
    const department = await prisma.department.create({
      data: {
        name: parsed.name.trim()
      }
    });

    revalidatePath("/departments");
    revalidatePath("/interns/new");

    return department;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new Error("Department already exists");
    }

    throw error;
  }
}
