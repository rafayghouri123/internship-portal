"use client";

import { InternshipType } from "@prisma/client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ZodError } from "zod";
import { createIntern } from "@/actions/interns";
import { CloudinaryUpload } from "@/components/shared/CloudinaryUpload";
import { CnicInput } from "@/components/shared/CnicInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applicationChannelOptions, internshipOfficeOptions, universityOptions } from "@/lib/intern-options";
import { cn } from "@/lib/utils";
import { createInternSchema } from "@/lib/validations/intern";

type AddInternFormProps = {
  departments: Array<{ id: string; name: string }>;
};

type FieldErrors = Partial<Record<string, string>>;

const fieldLabels: Record<string, string> = {
  fullName: "Full name",
  fatherName: "Father's name",
  cnicNumber: "CNIC number",
  contactNumber: "Contact number",
  email: "Email",
  city: "City",
  address: "Address",
  university: "University",
  officeLocation: "Internship office",
  degree: "Degree",
  major: "Major",
  currentSemester: "Current semester",
  graduationYear: "Graduation year",
  departmentId: "Department",
  durationWeeks: "Duration (weeks)",
  internshipType: "Internship type",
  applicationSource: "Application channel",
  knownEmployee: "Known Dalda employee",
  comments: "Comments",
  supervisorName: "Supervisor name",
  supervisorEmail: "Supervisor email",
  reference: "Reference",
  testScore: "Test score",
  testDate: "Test date",
  joiningDate: "Joining date",
  endDate: "End date",
  extraNotes: "Extra notes",
  cvFile: "CV upload"
};

export function AddInternForm({ departments }: AddInternFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  return (
    <form
      className="space-y-6"
      method="post"
      onSubmit={(event) => {
        event.preventDefault();
        setFieldErrors({});
        setFormError("");

        const formData = new FormData(event.currentTarget);
        const cvFileRaw = formData.get("cvFile");
        const cvFileValue = typeof cvFileRaw === "string" ? cvFileRaw.trim() : "";

        const payload = {
          fullName: String(formData.get("fullName") || ""),
          fatherName: String(formData.get("fatherName") || ""),
          cnicNumber: String(formData.get("cnicNumber") || ""),
          contactNumber: String(formData.get("contactNumber") || ""),
          email: String(formData.get("email") || ""),
          city: String(formData.get("city") || ""),
          address: String(formData.get("address") || ""),
          university: String(formData.get("university") || ""),
          officeLocation: String(formData.get("officeLocation") || ""),
          degree: String(formData.get("degree") || ""),
          major: String(formData.get("major") || ""),
          currentSemester: Number(formData.get("currentSemester") || 0),
          graduationYear: Number(formData.get("graduationYear") || 0),
          departmentId: String(formData.get("departmentId") || ""),
          durationWeeks: Number(formData.get("durationWeeks") || 0),
          internshipType: String(formData.get("internshipType") || InternshipType.PROJECT_BASED),
          applicationSource: String(formData.get("applicationSource") || ""),
          knownEmployee: String(formData.get("knownEmployee") || ""),
          comments: String(formData.get("comments") || ""),
          supervisorName: String(formData.get("supervisorName") || ""),
          supervisorEmail: String(formData.get("supervisorEmail") || ""),
          reference: String(formData.get("reference") || ""),
          testScore: Number(formData.get("testScore") || 0) || undefined,
          testDate: formData.get("testDate") ? new Date(String(formData.get("testDate"))) : undefined,
          joiningDate: new Date(String(formData.get("joiningDate"))),
          endDate: new Date(String(formData.get("endDate"))),
          extraNotes: String(formData.get("extraNotes") || ""),
          cvFile: cvFileValue ? JSON.parse(cvFileValue) : undefined
        };

        const parsed = createInternSchema.safeParse(payload);

        if (!parsed.success) {
          const nextErrors: FieldErrors = {};

          for (const issue of parsed.error.issues) {
            const field = issue.path[0];
            if (typeof field === "string" && !nextErrors[field]) {
              nextErrors[field] = issue.message;
            }
          }

          setFieldErrors(nextErrors);
          setFormError("Please fix the highlighted fields and try again.");
          return;
        }

        startTransition(async () => {
          try {
            const intern = await createIntern(parsed.data);
            toast.success("Intern record created successfully");
            router.push(`/interns/${intern.id}`);
            router.refresh();
          } catch (error) {
            if (error instanceof ZodError) {

              const nextErrors: FieldErrors = {};

              for (const issue of error.issues) {
                const field = issue.path[0];
                if (typeof field === "string" && !nextErrors[field]) {
                  nextErrors[field] = issue.message;
                }
              }

              setFieldErrors(nextErrors);
              setFormError("Please fix the highlighted fields and try again.");
              return;
            }

            if (error instanceof Error && error.message) {
              if (error.message === "CNIC already exists") {
                setFieldErrors({ cnicNumber: error.message });
                setFormError("Please fix the highlighted fields and try again.");
                return;
              }

              setFormError(error.message);
              toast.error(error.message);
              return;
            }

            setFormError("Unable to save the intern right now. Please try again.");
            toast.error("Unable to save the intern");
          }
        });
      }}
    >
      {formError ? (
        <div className="rounded-xl border border-dalda-red bg-dalda-red-light px-4 py-3 text-sm text-dalda-red">
          <p>{formError}</p>
          {Object.keys(fieldErrors).length ? (
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {Object.entries(fieldErrors).map(([field, message]) => (
                <li key={field}>
                  <span className="font-medium">{fieldLabels[field] ?? field}:</span> {message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      

      <Card>
        <CardHeader>
          <CardTitle>Intern information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field error={fieldErrors.fullName} label="Full name" name="fullName" />
          <Field error={fieldErrors.fatherName} label="Father's name" name="fatherName" />
          <div className={cn(fieldErrors.cnicNumber && "rounded-md border border-dalda-red p-3")}>
            <Label htmlFor="cnicNumber">CNIC number</Label>
            <CnicInput />
            <FieldError message={fieldErrors.cnicNumber} />
          </div>
          <Field
            error={fieldErrors.contactNumber}
            label="Contact number"
            name="contactNumber"
            placeholder="03XXXXXXXXX"
          />
          <Field error={fieldErrors.email} label="Email" name="email" type="email" />
          <Field error={fieldErrors.city} label="City" name="city" />
          <DatalistField
            error={fieldErrors.university}
            label="University"
            name="university"
            options={universityOptions}
          />
          <SelectField
            error={fieldErrors.officeLocation}
            label="Internship office"
            name="officeLocation"
            options={internshipOfficeOptions.map((office) => ({ id: office, name: office }))}
          />
          <Field error={fieldErrors.degree} label="Degree" name="degree" />
          <Field error={fieldErrors.major} label="Major" name="major" />
          <Field error={fieldErrors.currentSemester} label="Current semester" name="currentSemester" type="number" />
          <Field error={fieldErrors.graduationYear} label="Graduation year" name="graduationYear" type="number" />
          <SelectField error={fieldErrors.departmentId} label="Department" name="departmentId" options={departments} />
          <Field error={fieldErrors.durationWeeks} label="Duration (weeks)" name="durationWeeks" type="number" />
          <SelectField
            error={fieldErrors.internshipType}
            label="Internship type"
            name="internshipType"
            options={[
              { id: InternshipType.PROJECT_BASED, name: "Project-based" },
              { id: InternshipType.ONGOING, name: "Ongoing" }
            ]}
          />
          <SelectField
            error={fieldErrors.applicationSource}
            label="Application channel"
            name="applicationSource"
            options={applicationChannelOptions.map((channel) => ({ id: channel, name: channel }))}
          />
          <Field error={fieldErrors.knownEmployee} label="Known Dalda employee" name="knownEmployee" />
          <Field error={fieldErrors.supervisorName} label="Supervisor name" name="supervisorName" />
          <Field error={fieldErrors.supervisorEmail} label="Supervisor email" name="supervisorEmail" type="email" />
          <Field error={fieldErrors.reference} label="Reference" name="reference" />
          <Field error={fieldErrors.testScore} label="Test score" name="testScore" type="number" />
          <Field error={fieldErrors.testDate} label="Test date" name="testDate" type="date" />
          <Field error={fieldErrors.joiningDate} label="Joining date" name="joiningDate" type="date" />
          <Field error={fieldErrors.endDate} label="End date" name="endDate" type="date" />
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              className={cn(fieldErrors.address && "border-dalda-red focus-visible:ring-dalda-red")}
              id="address"
              name="address"
              required
            />
            <FieldError message={fieldErrors.address} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              className={cn(fieldErrors.comments && "border-dalda-red focus-visible:ring-dalda-red")}
              id="comments"
              name="comments"
            />
            <FieldError message={fieldErrors.comments} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="extraNotes">Extra notes</Label>
            <Textarea
              className={cn(fieldErrors.extraNotes && "border-dalda-red focus-visible:ring-dalda-red")}
              id="extraNotes"
              name="extraNotes"
            />
            <FieldError message={fieldErrors.extraNotes} />
          </div>
          <div className="md:col-span-2">
            <CloudinaryUpload folder="dalda-internship/cvs" inputName="cvFile" label="CV upload" />
            <FieldError message={fieldErrors.cvFile} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled={isPending} size="lg" type="submit">
          Save intern record
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  error
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        className={cn(error && "border-dalda-red focus-visible:ring-dalda-red")}
        id={name}
        name={name}
        placeholder={placeholder}
        required={type !== "date"}
        type={type}
      />
      <FieldError message={error} />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error
}: {
  label: string;
  name: string;
  options: Array<{ id: string; name: string }>;
  error?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-dalda-gray-100 bg-white px-3 py-2 text-sm text-dalda-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalda-green",
          error && "border-dalda-red focus-visible:ring-dalda-red"
        )}
        id={name}
        name={name}
        required
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <FieldError message={error} />
    </div>
  );
}

function DatalistField({
  label,
  name,
  options,
  error
}: {
  label: string;
  name: string;
  options: readonly string[];
  error?: string;
}) {
  const listId = `${name}-options`;

  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        className={cn(error && "border-dalda-red focus-visible:ring-dalda-red")}
        id={name}
        list={listId}
        name={name}
        required
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option} value={option} />
        ))}
      </datalist>
      <FieldError message={error} />
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs text-dalda-red">{message}</p>;
}
