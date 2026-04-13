import { notFound } from "next/navigation";
import { InternStatus } from "@prisma/client";
import { markTerminated } from "@/actions/interns";
import { CompleteDialog } from "@/components/interns/CompleteDialog";
import { ExtensionDialog } from "@/components/interns/ExtensionDialog";
import { InternProfile } from "@/components/interns/InternProfile";
import { PrintInternButton } from "@/components/interns/PrintInternButton";
import { InternStatusBadge } from "@/components/interns/InternStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInternById } from "@/lib/data";

export default async function InternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern: any = await getInternById(id);

  if (!intern) {
    notFound();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <InternProfile intern={intern} />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current status</CardTitle>
          </CardHeader>
          <CardContent>
            <InternStatusBadge large status={intern.status} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <DocumentRow label="CV" value={Boolean(intern.cvFile)} />
            <DocumentRow label="Certificate" value={Boolean(intern.certificateFile)} />
            <DocumentRow label="Report" value={Boolean(intern.reportFile)} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {intern.status === InternStatus.COMPLETED ? (
              <PrintInternButton internId={intern.id} />
            ) : intern.status === InternStatus.TERMINATED ? (
              <p className="rounded-lg border border-dalda-gray-100 bg-dalda-gray-50 px-4 py-3 text-sm text-dalda-gray-600">
                This record is closed because the intern left.
              </p>
            ) : (
              <>
                <ExtensionDialog currentEndDate={intern.endDate} internId={intern.id} />
                <CompleteDialog internId={intern.id} />
                <form
                  action={async () => {
                    "use server";
                    await markTerminated(intern.id);
                  }}
                >
                  <Button className="w-full" type="submit" variant="destructive">
                    Mark as left
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DocumentRow({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-dalda-gray-100 px-4 py-3">
      <span className="text-sm font-medium text-dalda-gray-900">{label}</span>
      <span className="text-sm text-dalda-gray-600">{value ? "Available" : "Pending"}</span>
    </div>
  );
}
