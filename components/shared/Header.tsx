import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await auth();
  const name = session?.user?.name ?? "HR Officer";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-dalda-gray-100 bg-white px-4 py-4 sm:px-6">
      <div>
        <p className="text-sm text-dalda-gray-400">Dalda Foods Ltd.</p>
        <h1 className="text-lg font-semibold text-dalda-gray-900">HR Internship Management Portal</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-full bg-dalda-gray-50 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-dalda-red-light text-sm font-semibold text-dalda-red">
            {initials}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-medium text-dalda-gray-900">{name}</p>
            <p className="text-dalda-gray-400">{session?.user?.role ?? "HR"}</p>
          </div>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
