import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage({
  searchParams
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dalda-off-white px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(31,107,46,0.18),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(200,16,46,0.1),_transparent_26%),linear-gradient(135deg,_#f7fbf7_0%,_#eef6ef_48%,_#fff8f8_100%)]" />
      <div className="absolute left-0 top-0 h-56 w-56 -translate-x-1/3 -translate-y-1/3 rounded-full bg-dalda-green/14 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 translate-y-1/3 rounded-full bg-dalda-red/8 blur-3xl" />

      <Card className="relative w-full max-w-5xl overflow-hidden border-dalda-gray-100 bg-white/95 shadow-[0_30px_80px_-40px_rgba(24,25,15,0.35)] backdrop-blur">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden bg-[linear-gradient(160deg,_#1F6B2E_0%,_#1A5C28_52%,_#C8102E_100%)] p-10 text-white md:flex md:flex-col md:justify-between">
            <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]">
              Dalda Foods
            </div>
            <div className="space-y-5">
              <img
                alt="Dalda logo"
                className="h-20 w-auto rounded-2xl bg-white px-4 py-3 shadow-lg"
                src="/dalda-logo.jfif"
              />
              <div className="space-y-3">
                <h1 className="max-w-sm text-4xl font-semibold leading-tight text-white">
                  Internship portal
                </h1>
                <p className="max-w-md text-sm leading-6 text-white/80">
                  Manage interns, documents, completion records, and department workflows in a single Dalda-branded HR space.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-white/85">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                HR access
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                Secure files
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-4">
                Fast review
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-8 flex items-center gap-4 md:hidden">
              <img
                alt="Dalda logo"
                className="h-16 w-auto rounded-2xl border border-dalda-gray-100 bg-white px-3 py-2 shadow-sm"
                src="/dalda-logo.jfif"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-dalda-green">Dalda Foods</p>
                <h1 className="text-2xl font-semibold text-dalda-gray-900">Internship portal</h1>
              </div>
            </div>

            <CardHeader className="px-0 pb-6 pt-0 text-left">
              <div className="hidden md:block">
                <img
                  alt="Dalda logo"
                  className="mb-6 h-16 w-auto rounded-2xl border border-dalda-gray-100 bg-white px-3 py-2 shadow-sm"
                  src="/dalda-logo.jfif"
                />
              </div>
              <CardTitle className="text-3xl text-dalda-green">Welcome back</CardTitle>
              <CardDescription className="text-base text-dalda-gray-600">
                Sign in to the Internship portal using your HR account.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0 pb-0">
          <form
            action={async (formData) => {
              "use server";

              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/dashboard"
                });
              } catch (error) {
                if (error instanceof AuthError) {
                  redirect(`/login?error=${error.type}`);
                }
                throw error;
              }
            }}
            className="space-y-5"
          >
            <div>
              <Label htmlFor="email" className="text-dalda-gray-900">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                required
                type="email"
                className="mt-2 border-dalda-gray-100 bg-white focus-visible:ring-dalda-green"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-dalda-gray-900">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                required
                type="password"
                className="mt-2 border-dalda-gray-100 bg-white focus-visible:ring-dalda-green"
              />
            </div>
            {searchParams.error ? (
              <p className="rounded-xl border border-dalda-red/15 bg-dalda-red-light px-4 py-3 text-sm text-dalda-red">
                Wrong credentials. Please try again.
              </p>
            ) : null}
            <Button className="h-11 w-full bg-dalda-green text-white hover:bg-dalda-green-dark" type="submit">
              Sign in
            </Button>
            <p className="text-center text-xs text-dalda-gray-400">
              Dalda Foods HR access for internship records and document handling.
            </p>
          </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </main>
  );
}
