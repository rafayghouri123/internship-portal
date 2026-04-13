import { notFound } from "next/navigation";
import { CompleteDialog } from "@/components/interns/CompleteDialog";
import { getInternById } from "@/lib/data";

export default async function CompleteInternPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const intern: any = await getInternById(id);

  if (!intern) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-dalda-gray-900">Complete internship</h2>
      <p className="text-dalda-gray-600">Finalize documents and close the internship record for {intern.fullName}.</p>
      <CompleteDialog internId={intern.id} />
    </div>
  );
}
