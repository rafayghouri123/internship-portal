import { Label } from "@/components/ui/label";

const criteria = [
  ["punctuality", "Punctuality"],
  ["technicalSkills", "Technical skills"],
  ["communication", "Communication"],
  ["teamwork", "Teamwork"],
  ["initiative", "Initiative"]
] as const;

export function EvaluationForm() {
  return (
    <div className="grid gap-4">
      {criteria.map(([name, label]) => (
        <div key={name}>
          <Label htmlFor={name}>{label}</Label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <label
                key={value}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-dalda-gray-100 bg-white text-sm text-dalda-gray-900 hover:border-dalda-green"
              >
                <input className="sr-only" defaultChecked={value === 4} name={name} type="radio" value={value} />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
