import { TestLinkManager } from "@/components/test/TestLinkManager";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function TestLinksPage() {
  const links = await prisma.testLink.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  const headerStore = await headers();
  const forwardedProto = headerStore.get("x-forwarded-proto");
  const forwardedHost = headerStore.get("x-forwarded-host") || headerStore.get("host");
  const headerBaseUrl =
    forwardedProto && forwardedHost ? `${forwardedProto}://${forwardedHost}`.replace(/\/$/, "") : null;

  const envBaseUrlCandidate = (process.env.APP_URL || process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
  const envBaseUrl =
    envBaseUrlCandidate && !envBaseUrlCandidate.includes("localhost") ? envBaseUrlCandidate : null;

  const baseUrl = headerBaseUrl || envBaseUrl || "http://localhost:3000";

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
