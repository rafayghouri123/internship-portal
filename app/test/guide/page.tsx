import { TestAnimatedBackground } from "@/components/test/TestAnimatedBackground";
import { TestGuideClient } from "@/components/test/TestGuideClient";

export default function TestGuidePage() {
  return (
    <main className="test-background px-4 py-8 sm:px-6 lg:px-8">
      <TestAnimatedBackground />
      <div className="mx-auto w-full max-w-5xl">
        <TestGuideClient />
      </div>
    </main>
  );
}

