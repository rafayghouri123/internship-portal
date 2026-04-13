import { notFound } from "next/navigation";
import { ExtensionDialog } from "@/components/interns/ExtensionDialog";
import { getInternById } from "@/lib/data";

export default async function ExtendInternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern: any = await getInternById(id);

  if (!intern) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-dalda-gray-900">Extend internship</h2>
      <p className="text-dalda-gray-600">Record a new end date and maintain the audit trail for {intern.fullName}.</p>
      <ExtensionDialog currentEndDate={intern.endDate} internId={intern.id} />
    </div>
  );
}
