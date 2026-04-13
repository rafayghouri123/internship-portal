"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { extendEndDate } from "@/actions/extensions";
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
import { Textarea } from "@/components/ui/textarea";

export function ExtensionDialog({ internId, currentEndDate }: { internId: string; currentEndDate: Date }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Extend end date</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Extend internship</DialogTitle>
          <DialogDescription>Current end date: {format(currentEndDate, "PPP")}</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            startTransition(async () => {
              try {
                await extendEndDate(internId, {
                  newEndDate: new Date(String(formData.get("newEndDate"))),
                  reason: String(formData.get("reason") || "")
                });
                toast.success("Internship extended successfully");
                setOpen(false);
                router.refresh();
              } catch {
                toast.error("Unable to extend internship");
              }
            });
          }}
        >
          <div>
            <Label htmlFor="newEndDate">New end date</Label>
            <Input id="newEndDate" name="newEndDate" required type="date" />
          </div>
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea id="reason" name="reason" />
          </div>
          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              Confirm extension
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
