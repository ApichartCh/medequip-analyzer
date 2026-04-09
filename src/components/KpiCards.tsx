import { Target, Gauge, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ProcessedAsset } from "@/lib/types";

interface KpiCardsProps {
  data: ProcessedAsset[];
}

export function KpiCards({ data }: KpiCardsProps) {
  const totalDemand = data.reduce((s, d) => s + d.target_cases, 0);
  const totalCapacity = data.reduce((s, d) => s + d.capacity_per_year, 0);
  const totalGap = totalDemand - totalCapacity;

  const cards = [
    {
      label: "Total Demand",
      value: totalDemand.toLocaleString(),
      icon: Target,
      color: "text-primary" as const,
      bg: "bg-primary/10" as const,
    },
    {
      label: "Total Capacity",
      value: totalCapacity.toLocaleString(),
      icon: Gauge,
      color: "text-success" as const,
      bg: "bg-success/10" as const,
    },
    {
      label: "Total Gap",
      value: totalGap.toLocaleString(),
      icon: TrendingDown,
      color: totalGap > 0 ? ("text-destructive" as const) : ("text-success" as const),
      bg: totalGap > 0 ? ("bg-destructive/10" as const) : ("bg-success/10" as const),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <Card key={c.label} className="p-5 flex items-center gap-4">
          <div className={`p-3 rounded-lg ${c.bg}`}>
            <c.icon className={`h-6 w-6 ${c.color}`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
