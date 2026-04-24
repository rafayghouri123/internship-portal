import { TestAttemptClient } from "@/components/test/TestAttemptClient";

export default function TestAttemptPage() {
  return (
    <main className="test-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <TestAttemptClient />
      </div>
    </main>
  );
}
