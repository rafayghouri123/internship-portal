import { TestAnimatedBackground } from "@/components/test/TestAnimatedBackground";
import { TestExamplesClient } from "@/components/test/TestExamplesClient";

export default function TestExamplesPage() {
  return (
    <main className="test-background px-4 py-8 sm:px-6 lg:px-8">
      <TestAnimatedBackground />
      <div className="mx-auto w-full max-w-5xl">
        <TestExamplesClient />
      </div>
    </main>
  );
}

