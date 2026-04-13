import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getDaysRemaining } from "@/lib/data";

type ExpiryAlertProps = {
  interns: Array<{
    id: string;
    fullName: string;
    department?: { name: string } | null;
    endDate: Date;
  }>;
};

export function ExpiryAlert({ interns }: ExpiryAlertProps) {
  if (!interns.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-dalda-gold bg-dalda-gold-light p-4">
      <div className="flex items-center gap-2 text-dalda-gray-900">
        <AlertTriangle className="h-5 w-5 text-dalda-gold" />
        <h2 className="text-lg font-semibold">Internships ending within 7 days</h2>
      </div>
      <div className="mt-4 space-y-3">
        {interns.map((intern) => (
          <div
            key={intern.id}
            className="flex flex-col gap-2 rounded-lg border border-dalda-gold/30 bg-white/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-dalda-gray-900">{intern.fullName}</p>
              <p className="text-sm text-dalda-gray-600">
                {intern.department?.name ?? "Department pending"} • {getDaysRemaining(intern.endDate)} days remaining
              </p>
            </div>
            <Link className="text-sm font-medium text-dalda-red" href={`/interns/${intern.id}`}>
              View intern →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
