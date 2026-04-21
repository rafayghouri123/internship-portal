import { TestIntakeForm } from "@/components/test/TestIntakeForm";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export default async function TestStartPage({
  searchParams
}: {
  searchParams?: Promise<{ link?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const linkToken = params.link?.trim() ?? "";

  if (!linkToken) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="surface-card p-6">
          <h1 className="text-xl font-semibold text-dalda-gray-900">Invalid test link</h1>
          <p className="mt-2 text-sm text-dalda-gray-600">
            This test link is missing. Please contact HR for a valid test link.
          </p>
        </div>
      </main>
    );
  }

  const link = await prisma.testLink.findFirst({
    where: {
      token: linkToken,
      isActive: true
    }
  });

  if (!link) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="surface-card p-6">
          <h1 className="text-xl font-semibold text-dalda-gray-900">Link not active</h1>
          <p className="mt-2 text-sm text-dalda-gray-600">
            This test link is invalid or has been deleted by HR.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <Image alt="Dalda Foods" className="h-12 w-12 rounded-md object-cover" height={48} src="/dalda-logo.jfif" width={48} />
          <div>
            <h1 className="text-2xl font-semibold text-dalda-gray-900">Internship Assessment Test</h1>
            <p className="text-sm text-dalda-gray-600">Dalda Foods Candidate Screening</p>
          </div>
        </div>
        <p className="mt-1 text-sm text-dalda-gray-600">
          Please fill in your details to start. You will get 30 questions and 30 minutes.
        </p>
      </div>
      <TestIntakeForm linkToken={linkToken} />
    </main>
  );
}
