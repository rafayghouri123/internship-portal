"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTestLink, deleteTestLink } from "@/actions/test-links";
import { Button } from "@/components/ui/button";

type TestLinkRow = {
  id: string;
  token: string;
  isActive: boolean;
  createdAt: Date;
};

export function TestLinkManager({
  rows,
  baseUrl
}: {
  rows: TestLinkRow[];
  baseUrl: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <div className="surface-card flex items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-base font-semibold text-dalda-gray-900">Generate candidate test link</h2>
          <p className="mt-1 text-sm text-dalda-gray-600">
            Create a unique link and share it with candidates. Deleted links stop future access.
          </p>
        </div>
        <Button
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              try {
                const created = await createTestLink();
                const url = `${baseUrl}/test?link=${created.token}`;
                await navigator.clipboard.writeText(url);
                toast.success("Test link created and copied.");
                router.refresh();
              } catch (error) {
                if (error instanceof Error) {
                  toast.error(error.message);
                  return;
                }
                toast.error("Unable to create test link.");
              }
            });
          }}
          type="button"
        >
          Generate link
        </Button>
      </div>

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-dalda-gray-50 text-dalda-gray-400">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Link</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row) => {
                const url = `${baseUrl}/test?link=${row.token}`;
                return (
                  <tr className="border-b border-dalda-gray-100" key={row.id}>
                    <td className="p-4 text-dalda-gray-700">{url}</td>
                    <td className="p-4 text-dalda-gray-700">{new Date(row.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(url);
                              toast.success("Link copied.");
                            } catch {
                              toast.error("Unable to copy link.");
                            }
                          }}
                          size="sm"
                          type="button"
                          variant="secondary"
                        >
                          Copy
                        </Button>
                        <Button
                          onClick={() => {
                            startTransition(async () => {
                              try {
                                await deleteTestLink(row.id);
                                toast.success("Link deleted.");
                                router.refresh();
                              } catch (error) {
                                if (error instanceof Error) {
                                  toast.error(error.message);
                                  return;
                                }
                                toast.error("Unable to delete link.");
                              }
                            });
                          }}
                          size="sm"
                          type="button"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td className="p-5 text-center text-dalda-gray-500" colSpan={3}>
                  No test links yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
