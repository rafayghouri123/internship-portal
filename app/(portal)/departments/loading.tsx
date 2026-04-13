import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsLoading() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Skeleton className="h-[520px] rounded-xl" />
      <Skeleton className="h-[520px] rounded-xl" />
    </div>
  );
}
