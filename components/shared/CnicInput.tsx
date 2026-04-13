"use client";

import { useState, useTransition } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { checkCnicExists } from "@/actions/interns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CnicInputProps = {
  defaultValue?: string;
  name?: string;
};

export function CnicInput({ defaultValue, name = "cnicNumber" }: CnicInputProps) {
  const [status, setStatus] = useState<"idle" | "checking" | "ok" | "duplicate">("idle");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      <Input
        name={name}
        defaultValue={defaultValue}
        placeholder="42101-1234567-8"
        onBlur={(event) => {
          const value = event.currentTarget.value;
          if (!value) {
            setStatus("idle");
            return;
          }

          setStatus("checking");
          startTransition(async () => {
            const exists = await checkCnicExists(value);
            setStatus(exists ? "duplicate" : "ok");
          });
        }}
      />
      <p
        className={cn(
          "flex items-center gap-2 text-xs",
          status === "duplicate" && "text-dalda-red",
          status === "ok" && "text-dalda-green",
          (status === "idle" || status === "checking") && "text-dalda-gray-400"
        )}
      >
        {status === "duplicate" ? <AlertCircle className="h-3.5 w-3.5" /> : null}
        {status === "ok" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
        {status === "duplicate"
          ? "An intern with this CNIC already exists."
          : status === "ok"
            ? "CNIC is available."
            : isPending || status === "checking"
              ? "Checking CNIC..."
              : "Format: XXXXX-XXXXXXX-X"}
      </p>
    </div>
  );
}
