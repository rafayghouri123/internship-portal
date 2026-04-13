import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { PrintNowButton } from "@/components/interns/PrintNowButton";
import { getInternById } from "@/lib/data";

type StoredDocument =
  | {
      secureUrl?: string;
      originalFilename?: string;
      publicId?: string;
      uploadedAt?: string;
      bytes?: number;
    }
  | null
  | undefined;

export default async function PrintInternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern: any = await getInternById(id);

  if (!intern) {
    notFound();
  }

  const documents = [
    { label: "CV", value: intern.cvFile as StoredDocument },
    { label: "Certificate", value: intern.certificateFile as StoredDocument },
    { label: "Internship report", value: intern.reportFile as StoredDocument }
  ];

  return (
    <main className="min-h-screen bg-[#f6f7f5] px-4 py-8 print:bg-white print:p-0">
      <div className="mx-auto max-w-5xl space-y-6 print:max-w-none">
        <div className="flex items-center justify-between print:hidden">
          <div>
            <h1 className="text-2xl font-semibold text-[#18190F]">Intern record print view</h1>
            <p className="text-[#5A5B57]">Use this page to print the completed internship record.</p>
          </div>
          <PrintNowButton />
        </div>

        <section className="rounded-2xl border border-[#E6E7E3] bg-white p-8 shadow-sm print:border-none print:shadow-none">
          <div className="border-b border-[#E6E7E3] pb-6">
            <p className="text-sm font-medium uppercase tracking-wide text-[#9A9B96]">Dalda Foods Ltd.</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#18190F]">{intern.fullName}</h2>
            <p className="mt-1 text-[#5A5B57]">Completed internship record</p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <PlainSection
              title="Personal information"
              rows={[
                ["Full name", intern.fullName],
                ["Father's name", intern.fatherName],
                ["CNIC", intern.cnicNumber],
                ["Contact number", intern.contactNumber],
                ["Email", intern.email],
                ["City", intern.city],
                ["Address", intern.address],
                ["University", intern.university],
                ["Internship office", intern.officeLocation ?? "-"],
                ["Degree", intern.degree],
                ["Major", intern.major ?? "-"],
                ["Current semester", String(intern.currentSemester)],
                ["Graduation year", String(intern.graduationYear)]
              ]}
            />
            <PlainSection
              title="Internship details"
              rows={[
                ["Department", intern.department?.name ?? "Pending"],
                ["Supervisor name", intern.supervisorName ?? "Pending"],
                ["Supervisor email", intern.supervisorEmail ?? "-"],
                ["Internship type", intern.internshipType ? intern.internshipType.replaceAll("_", " ") : "-"],
                ["Duration", `${intern.durationWeeks} weeks`],
                ["Joining date", format(intern.joiningDate, "PPP")],
                ["End date", format(intern.endDate, "PPP")],
                ["Status", intern.status === "TERMINATED" ? "Intern left" : intern.status.replaceAll("_", " ")],
                ["Reference", intern.reference ?? "-"],
                ["Application channel", intern.applicationSource ?? intern.referralSource ?? "-"],
                ["Known Dalda employee", intern.knownEmployee ?? "-"]
              ]}
            />
            <PlainSection
              title="Office use"
              rows={[
                ["Test score", intern.testScore?.toString() ?? "-"],
                ["Test date", intern.testDate ? format(intern.testDate, "PPP") : "-"],
                ["Extra notes", intern.extraNotes ?? "-"],
                ["Comments", intern.comments ?? "-"],
                ["Added by", intern.addedBy?.name ?? "HR Officer"]
              ]}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-[#E6E7E3] p-6">
            <h3 className="text-lg font-semibold text-[#18190F]">Documents</h3>
            <div className="mt-4 space-y-4">
              {documents.map((document) => (
                <div key={document.label} className="rounded-xl border border-[#E6E7E3] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#18190F]">{document.label}</p>
                      <p className="mt-1 text-sm text-[#5A5B57]">
                        {document.value?.originalFilename ?? document.value?.publicId ?? "Not uploaded"}
                      </p>
                      {document.value?.uploadedAt ? (
                        <p className="mt-1 text-xs text-[#9A9B96]">
                          Uploaded {format(new Date(document.value.uploadedAt), "PPP")}
                        </p>
                      ) : null}
                    </div>
                    {document.value?.secureUrl ? (
                      <Link
                        className="print:hidden rounded-md border border-[#1F6B2E] px-3 py-2 text-sm font-medium text-[#1F6B2E]"
                        href={`/api/documents/download?url=${encodeURIComponent(document.value.secureUrl)}&filename=${encodeURIComponent(document.value.originalFilename ?? `${document.label.toLowerCase()}.pdf`)}`}
                      >
                        Download file
                      </Link>
                    ) : null}
                  </div>
                  {document.value?.secureUrl ? (
                    <p className="mt-3 break-all text-xs text-[#5A5B57]">{document.value.secureUrl}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#E6E7E3] p-6">
            <h3 className="text-lg font-semibold text-[#18190F]">Extension history</h3>
            <div className="mt-4 space-y-3 text-sm text-[#5A5B57]">
              {intern.extensionLogs.length ? (
                intern.extensionLogs.map((log: any) => (
                  <div key={log.id} className="rounded-xl border border-[#E6E7E3] p-4">
                    <p className="font-medium text-[#18190F]">
                      {format(log.previousEndDate, "PPP")} to {format(log.newEndDate, "PPP")}
                    </p>
                    <p className="mt-1">{log.reason ?? "No reason provided"}</p>
                    <p className="mt-1 text-xs text-[#9A9B96]">
                      Updated by {log.extendedBy?.name ?? "HR"} on {format(log.createdAt, "PPP")}
                    </p>
                  </div>
                ))
              ) : (
                <p>No extensions recorded.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function PlainSection({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <div className="rounded-2xl border border-[#E6E7E3] p-6">
      <h3 className="text-lg font-semibold text-[#18190F]">{title}</h3>
      <div className="mt-4 space-y-2 text-sm text-[#5A5B57]">
        {rows.map(([label, value]) => (
          <PlainRow key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  );
}

function PlainRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 border-b border-[#E6E7E3] py-2 last:border-none">
      <span className="font-medium text-[#18190F]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
