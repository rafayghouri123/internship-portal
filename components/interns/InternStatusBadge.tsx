import { InternStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

type InternStatusBadgeProps = {
  status: InternStatus | string;
  large?: boolean;
};

export function InternStatusBadge({ status, large = false }: InternStatusBadgeProps) {
  const normalized = status as InternStatus;
  const variant =
    normalized === InternStatus.ACTIVE
      ? "success"
      : normalized === InternStatus.EXTENDED
        ? "warning"
        : normalized === InternStatus.TERMINATED
          ? "danger"
          : "default";
  const label = normalized === InternStatus.TERMINATED ? "Intern left" : normalized.replaceAll("_", " ");

  return (
    <Badge className={large ? "px-4 py-2 text-sm" : undefined} variant={variant}>
      {label}
    </Badge>
  );
}
