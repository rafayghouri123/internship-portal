"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { markCompleted } from "@/actions/interns";
import { CloudinaryUpload } from "@/components/shared/CloudinaryUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CompleteDialog({ internId }: { internId: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Mark as completed</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete internship</DialogTitle>
          <DialogDescription>Upload the completion documents and close the internship record.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            startTransition(async () => {
              try {
                await markCompleted(internId, {
                  actualEndDate: new Date(String(formData.get("actualEndDate"))),
                  certificateFile: formData.get("certificateFile")
                    ? JSON.parse(String(formData.get("certificateFile")))
                    : undefined,
                  reportFile: formData.get("reportFile")
                    ? JSON.parse(String(formData.get("reportFile")))
                    : undefined
                });
                toast.success("Intern marked as completed");
                setOpen(false);
              } catch {
                toast.error("Unable to complete internship");
              }
            });
          }}
        >
          <div>
            <Label htmlFor="actualEndDate">Actual end date</Label>
            <Input id="actualEndDate" name="actualEndDate" required type="date" />
          </div>
          <CloudinaryUpload
            folder="dalda-internship/certificates"
            inputName="certificateFile"
            label="Completion certificate"
          />
          <CloudinaryUpload folder="dalda-internship/reports" inputName="reportFile" label="Intern report" />
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Submit completion
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
