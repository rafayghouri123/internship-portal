import { Skeleton } from "@/components/ui/skeleton";

export default function InternsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-[460px] rounded-xl" />
    </div>
  );
}
