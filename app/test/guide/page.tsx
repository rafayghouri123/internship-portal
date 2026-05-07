import { TestAnimatedBackground } from "@/components/test/TestAnimatedBackground";
import { TestGuideClient } from "@/components/test/TestGuideClient";
import Image from "next/image";

export default function TestGuidePage() {
  return (
    <main className="test-background px-4 py-8 sm:px-6 lg:px-8">
      <TestAnimatedBackground />
      <div className="mx-auto w-full max-w-5xl">
        <div className="test-panel mb-6 overflow-hidden rounded-2xl shadow-card">
          <div className="h-2 bg-gradient-to-r from-dalda-green-dark via-dalda-green to-dalda-green-mid" />
          <div className="flex items-center gap-4 px-5 py-6 sm:px-6">
            <Image alt="Dalda Foods" className="h-14 w-20 object-contain" height={56} src="/dalda-logo.png" width={80} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-dalda-green">Dalda Foods</p>
              <h1 className="text-2xl font-semibold text-dalda-gray-50">Welcome to Dalda Foods Future Leadership Program Online Assessment</h1>
              <p className="text-sm font-medium text-dalda-green-light">DFLP 2026</p>
              <p className="text-sm text-dalda-gray-200/90">Candidate Screening Portal</p>
            </div>
          </div>
          <p className="border-t border-dalda-green-muted/30 bg-dalda-green/10 px-5 py-3 text-sm text-dalda-gray-100 sm:px-6">
            Please review the guide carefully before starting your assessment.
          </p>
        </div>
        <TestGuideClient />
      </div>
    </main>
  );
}
