"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { type CloudinaryResult } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function attachDocument(
  internId: string,
  type: "cv" | "certificate" | "report",
  cloudinaryResult: CloudinaryResult
) {
  const fieldName =
    type === "cv" ? "cvFile" : type === "certificate" ? "certificateFile" : "reportFile";

  const intern = await prisma.intern.update({
    where: { id: internId },
    data: {
      [fieldName]: cloudinaryResult as Prisma.InputJsonValue
    }
  });

  revalidatePath(`/interns/${internId}`);

  return intern;
}
