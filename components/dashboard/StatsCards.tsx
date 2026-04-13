import { FileCheck2, Hourglass, LayoutGrid, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatsCardsProps = {
  stats: {
    total: number;
    active: number;
    completingSoon: number;
    completed: number;
  };
};

const cards = [
  { key: "total", label: "Total interns", icon: Users, accent: "border-dalda-red text-dalda-red" },
  { key: "active", label: "Active", icon: LayoutGrid, accent: "border-dalda-green text-dalda-green" },
  { key: "completingSoon", label: "Completing soon", icon: Hourglass, accent: "border-dalda-gold text-dalda-gold" },
  { key: "completed", label: "Completed", icon: FileCheck2, accent: "border-dalda-gray-400 text-dalda-gray-400" }
] as const;

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];

        return (
          <Card key={card.key} className={`border-t-2 ${card.accent}`}>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-dalda-gray-400">{card.label}</p>
                <p className="mt-2 text-3xl font-semibold text-dalda-gray-900">{value}</p>
              </div>
              <div className={`rounded-full bg-dalda-off-white p-3 ${card.accent.split(" ")[1]}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
