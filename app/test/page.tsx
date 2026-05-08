import { TestIntakeForm } from "@/components/test/TestIntakeForm";
import { TestAnimatedBackground } from "@/components/test/TestAnimatedBackground";
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
        <TestAnimatedBackground />
        <div className="mx-auto w-full max-w-4xl">
          <div className="test-panel rounded-2xl p-6">
          <h1 className="text-xl font-semibold text-dalda-gray-50">Invalid test link</h1>
          <p className="mt-2 text-sm text-dalda-gray-200/90">
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
        <TestAnimatedBackground />
        <div className="mx-auto w-full max-w-4xl">
          <div className="test-panel rounded-2xl p-6">
          <h1 className="text-xl font-semibold text-dalda-gray-50">Link not active</h1>
          <p className="mt-2 text-sm text-dalda-gray-200/90">
            This test link is invalid or has been deleted by HR.
          </p>
        </div>
        </div>
      </main>
    );
  }

  return (
    <main className="test-background px-4 py-10 sm:px-6 lg:px-8">
      <TestAnimatedBackground />
      <div className="mx-auto w-full max-w-4xl">
        <div className="test-panel mb-6 overflow-hidden rounded-2xl shadow-card">
          <div className="h-2 bg-gradient-to-r from-dalda-green-dark via-dalda-green to-dalda-green-mid" />
          <div className="flex items-center gap-4 px-5 py-6 sm:px-6">
            <Image alt="Dalda Foods DFLP" className="h-16 w-24 object-contain" height={64} src="/dflp-logo.png" width={96} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dalda-green">Dalda Foods</p>
              <h1 className="text-2xl font-semibold text-dalda-gray-50">Welcome to Dalda Foods Future Leadership Program Online Assessment</h1>
              <p className="text-sm font-medium text-dalda-green-light">DFLP 2026</p>
              <p className="text-sm text-dalda-gray-200/90">Candidate Screening Portal</p>
            </div>
          </div>
          <p className="border-t border-dalda-green-muted/30 bg-dalda-green/10 px-5 py-3 text-sm text-dalda-gray-100 sm:px-6">
            Please fill in your details to start. You will get 30 questions and 30 minutes.
          </p>
        </div>
        <TestIntakeForm linkToken={linkToken} />
      </div>
    </main>
  );
}
