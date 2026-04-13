"use client";

import Link from "next/link";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintInternButton({ internId }: { internId: string }) {
  return (
    <Button asChild className="w-full" variant="secondary">
      <Link href={`/interns/${internId}/print`} target="_blank">
        <Printer className="mr-2 h-4 w-4" />
        Print record
      </Link>
    </Button>
  );
}
