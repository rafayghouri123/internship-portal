import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InternProfileProps = {
  intern: {
    fullName: string;
    fatherName: string;
    cnicNumber: string;
    contactNumber: string;
    email: string;
    city: string;
    address: string;
    university: string;
    officeLocation?: string | null;
    degree: string;
    major?: string | null;
    currentSemester: number;
    graduationYear: number;
    durationWeeks: number;
    internshipType?: string | null;
    applicationSource?: string | null;
    referralSource?: string | null;
    knownEmployee?: string | null;
    comments?: string | null;
    reference?: string | null;
    testScore?: number | null;
    testDate?: Date | null;
    joiningDate: Date;
    endDate: Date;
    extraNotes?: string | null;
    department?: { name: string } | null;
    supervisorName?: string | null;
    supervisorEmail?: string | null;
    extensionLogs: Array<{
      id: string;
      previousEndDate: Date;
      newEndDate: Date;
      reason?: string | null;
      createdAt: Date;
      extendedBy: { name: string | null };
    }>;
  };
};

export function InternProfile({ intern }: InternProfileProps) {
  return (
    <div className="space-y-6">
      <InfoCard
        title="Personal information"
        rows={[
          ["Full name", intern.fullName],
          ["Father's name", intern.fatherName],
          ["CNIC", intern.cnicNumber],
          ["Contact", intern.contactNumber],
          ["Email", intern.email],
          ["City", intern.city],
          ["Address", intern.address],
          ["University", intern.university],
          ["Internship office", intern.officeLocation ?? "-"],
          ["Degree", intern.degree],
          ["Major", intern.major ?? "-"],
          ["Semester", String(intern.currentSemester)],
          ["Graduation year", String(intern.graduationYear)]
        ]}
      />
      <InfoCard
        title="Internship details"
        rows={[
          ["Department", intern.department?.name ?? "Pending"],
          ["Supervisor", intern.supervisorName ?? "Pending"],
          ["Supervisor email", intern.supervisorEmail ?? "-"],
          ["Internship type", intern.internshipType ? intern.internshipType.replaceAll("_", " ") : "-"],
          ["Duration", `${intern.durationWeeks} weeks`],
          ["Application channel", intern.applicationSource ?? intern.referralSource ?? "-"],
          ["Known Dalda employee", intern.knownEmployee ?? "-"],
          ["Reference", intern.reference ?? "-"],
          ["Test score", intern.testScore?.toString() ?? "-"],
          ["Test date", intern.testDate ? format(intern.testDate, "PPP") : "-"],
          ["Joining date", format(intern.joiningDate, "PPP")],
          ["End date", format(intern.endDate, "PPP")],
          ["Comments", intern.comments ?? "-"],
          ["Extra notes", intern.extraNotes ?? "-"]
        ]}
      />
      <Card>
        <CardHeader>
          <CardTitle>Extension history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="mt-1 h-3 w-3 rounded-full bg-dalda-green" />
            <div>
              <p className="font-medium text-dalda-gray-900">Original end date</p>
              <p className="text-sm text-dalda-gray-600">{format(intern.endDate, "PPP")}</p>
            </div>
          </div>
          {intern.extensionLogs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <div className="mt-1 h-3 w-3 rounded-full bg-dalda-red" />
              <div>
                <p className="font-medium text-dalda-gray-900">
                  {format(log.previousEndDate, "PPP")} to {format(log.newEndDate, "PPP")}
                </p>
                <p className="text-sm text-dalda-gray-600">
                  {log.reason ?? "No reason provided"} | {log.extendedBy.name ?? "HR"} | {format(log.createdAt, "PPP")}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoCard({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <p className="field-label">{label}</p>
            <p className="mt-1 text-sm text-dalda-gray-900">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
