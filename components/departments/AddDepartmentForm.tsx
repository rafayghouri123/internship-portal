"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ZodError } from "zod";
import { createDepartment } from "@/actions/departments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddDepartmentForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError("");

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") || "");

        startTransition(async () => {
          try {
            await createDepartment({ name });
            toast.success("Department added successfully");
            event.currentTarget.reset();
            router.refresh();
          } catch (caughtError) {
            if (caughtError instanceof ZodError) {
              setError(caughtError.issues[0]?.message ?? "Please enter a valid department name.");
              return;
            }

            if (caughtError instanceof Error) {
              setError(caughtError.message);
              return;
            }

            setError("Unable to add the department right now.");
          }
        });
      }}
    >
      <div>
        <Label htmlFor="name">Department name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter a department name"
          className={error ? "mt-2 border-dalda-red focus-visible:ring-dalda-red" : "mt-2"}
        />
      </div>
      {error ? <p className="text-sm text-dalda-red">{error}</p> : null}
      <Button disabled={isPending} type="submit">
        Add department
      </Button>
    </form>
  );
}
