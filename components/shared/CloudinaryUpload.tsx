"use client";

import { useState } from "react";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

type UploadResult = {
  publicId: string;
  secureUrl: string;
  uploadedAt: string;
  originalFilename?: string;
  bytes?: number;
};

type CloudinaryUploadProps = {
  folder: string;
  label: string;
  inputName: string;
};

export function CloudinaryUpload({ folder, label, inputName }: CloudinaryUploadProps) {
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(file: File | undefined) {
    if (!file) {
      return;
    }

    try {
      setError(null);
      setResult(null);
      const signatureResponse = await fetch("/api/cloudinary/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder })
      });

      const signatureData = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(signatureData?.error || "Unable to get upload signature");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? "");
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("signature", signatureData.signature);
      formData.append("folder", folder);
      formData.append("resource_type", "raw");

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload`,
        {
          method: "POST",
          body: formData
        }
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData?.error?.message || "Upload failed");
      }

      if (!uploadData.public_id || !uploadData.secure_url) {
        throw new Error("Upload response was incomplete");
      }

      setResult({
        publicId: uploadData.public_id,
        secureUrl: uploadData.secure_url,
        uploadedAt: new Date().toISOString(),
        originalFilename: file.name,
        bytes: file.size
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Upload could not be completed. You can save the record and upload later.";
      setError(message);
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-dalda-green-muted bg-dalda-green-light/40 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white p-2 text-dalda-green">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-dalda-gray-900">{label}</p>
          <p className="text-sm text-dalda-gray-600">PDF only, maximum 5MB. Only the Cloudinary URL and metadata are saved.</p>
        </div>
        <Button type="button" variant="secondary" asChild>
          <label className="cursor-pointer">
            Browse
            <input
              accept="application/pdf"
              className="hidden"
              type="file"
              onChange={(event) => handleChange(event.target.files?.[0])}
            />
          </label>
        </Button>
      </div>
      {result ? (
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-white px-3 py-2 text-sm text-dalda-green">
          <CheckCircle2 className="h-4 w-4" />
          <FileText className="h-4 w-4" />
          <span>{result.originalFilename}</span>
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm text-dalda-red">{error}</p> : null}
      <input type="hidden" name={inputName} value={result ? JSON.stringify(result) : ""} />
    </div>
  );
}
