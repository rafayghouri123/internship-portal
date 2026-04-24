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
      <main className="test-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="surface-card border-dalda-gray-100 p-6">
          <h1 className="text-xl font-semibold text-dalda-gray-900">Invalid test link</h1>
          <p className="mt-2 text-sm text-dalda-gray-600">
            This test link is missing. Please contact HR for a valid test link.
          </p>
        </div>
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
      <main className="test-background px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          <div className="surface-card border-dalda-gray-100 p-6">
          <h1 className="text-xl font-semibold text-dalda-gray-900">Link not active</h1>
          <p className="mt-2 text-sm text-dalda-gray-600">
            This test link is invalid or has been deleted by HR.
          </p>
        </div>
        </div>
      </main>
    );
  }

  return (
    <main className="test-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-6 overflow-hidden rounded-2xl border border-dalda-green-muted bg-white shadow-card">
          <div className="h-2 bg-gradient-to-r from-dalda-green to-dalda-green-mid" />
          <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
            <Image alt="Dalda Foods" className="h-14 w-20 object-contain" height={56} src="/dalda-logo.png" width={80} />
            <div>
              <h1 className="text-2xl font-semibold text-dalda-gray-900">Internship Assessment Test</h1>
              <p className="text-sm text-dalda-gray-600">Dalda Foods Candidate Screening Portal</p>
            </div>
          </div>
          <p className="border-t border-dalda-gray-100 bg-dalda-gray-50 px-5 py-3 text-sm text-dalda-gray-700 sm:px-6">
            Please fill in your details to start. You will get 30 questions and 30 minutes.
          </p>
        </div>
        <TestIntakeForm linkToken={linkToken} />
      </div>
    </main>
  );
}
