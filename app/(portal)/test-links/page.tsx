import { TestLinkManager } from "@/components/test/TestLinkManager";
import { prisma } from "@/lib/prisma";

export default async function TestLinksPage() {
  const links = await prisma.testLink.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  const baseUrl =
    process.env.APP_URL?.replace(/\/$/, "") ||
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  return (
    <div className="space-y-6">
      <div className="surface-card p-5">
        <h1 className="text-xl font-semibold text-dalda-gray-900">Test Links</h1>
        <p className="mt-1 text-sm text-dalda-gray-600">
          Generate and manage candidate test links. Candidates can only access the test using an active link.
        </p>
      </div>
      <TestLinkManager baseUrl={baseUrl} rows={links as any} />
    </div>
  );
}
