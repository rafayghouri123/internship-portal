import { TestDoneClient } from "@/components/test/TestDoneClient";

export default function TestDonePage() {
  return (
    <main className="test-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <TestDoneClient />
      </div>
    </main>
  );
}
