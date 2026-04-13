import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>HR account settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="field-label">Name</p>
          <p className="mt-1 text-sm text-dalda-gray-900">{session?.user?.name ?? "HR Officer"}</p>
        </div>
        <div>
          <p className="field-label">Email</p>
          <p className="mt-1 text-sm text-dalda-gray-900">{session?.user?.email ?? "hr@daldafoods.com"}</p>
        </div>
        <div>
          <p className="field-label">Role</p>
          <p className="mt-1 text-sm text-dalda-gray-900">{session?.user?.role ?? "HR"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
