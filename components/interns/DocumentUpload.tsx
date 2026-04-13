import { CloudinaryUpload } from "@/components/shared/CloudinaryUpload";

export function DocumentUpload({
  folder,
  label,
  inputName
}: {
  folder: string;
  label: string;
  inputName: string;
}) {
  return <CloudinaryUpload folder={folder} inputName={inputName} label={label} />;
}
