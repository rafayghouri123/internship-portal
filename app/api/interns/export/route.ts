import Papa from "papaparse";
import { getInterns, mapInternToExportRow } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const interns: any[] = await getInterns({
    q: searchParams.get("q") ?? undefined,
    status: searchParams.get("status") ?? undefined
  });

  const csv = Papa.unparse(interns.map((intern: any) => mapInternToExportRow(intern)));

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="dalda-interns-export.csv"'
    }
  });
}
