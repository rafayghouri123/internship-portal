import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-dalda-off-white px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-dalda-gray-900">Record not found</h1>
        <p className="mt-3 text-dalda-gray-600">
          The page you requested does not exist or the intern record could not be found.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
