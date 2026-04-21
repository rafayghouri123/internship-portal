"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenCheck, Building2, FileBarChart2, LayoutDashboard, Leaf, Link2, Settings, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Test Links", href: "/test-links", icon: Link2 },
  { label: "Test Results", href: "/dashboard/test-results", icon: FileBarChart2 },
  { label: "Question Bank", href: "/question-bank", icon: BookOpenCheck },
  { label: "Interns", href: "/interns", icon: Users },
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-60 flex-col border-r border-white/10 bg-dalda-green text-white md:flex">
      <div className="border-b border-white/10 bg-dalda-green-dark px-6 py-5">
        <div className="flex items-center gap-2 text-xl font-bold text-white">
          <Leaf className="h-5 w-5" />
          <span>Dalda Foods</span>
        </div>
        <p className="mt-1 text-xs font-normal text-white/60">Internship Portal</p>
      </div>
      <nav className="flex-1 px-3 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border-l-2 border-transparent px-4 py-3 text-sm hover:bg-white/10",
                    active && "border-white bg-white/10 font-medium text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
