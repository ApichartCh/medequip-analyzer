import { Target, Gauge, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ProcessedAsset } from "@/lib/types";

interface KpiCardsProps {
  data: ProcessedAsset[];
}

export function KpiCards({ data }: KpiCardsProps) {
  const totalDemand = data.reduce((s, d) => s + d.target_cases, 0);
  const totalCapacity = data.reduce((s, d) => s + d.capacity_per_year, 0);
  const totalGap = totalDemand - totalCapacity;
  const avgUtil = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.utilization_pct, 0) / data.length)
    : 0;

  const cards = [
    {
      label: "Total Demand",
      value: totalDemand.toLocaleString(),
      subtitle: `${data.length} assets tracked`,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10",
      borderColor: "border-l-primary",
    },
    {
      label: "Total Capacity",
      value: totalCapacity.toLocaleString(),
      subtitle: "cases / year",
      icon: Gauge,
      color: "text-success",
      bg: "bg-success/10",
      borderColor: "border-l-success",
    },
    {
      label: "Capacity Gap",
      value: totalGap.toLocaleString(),
      subtitle: totalGap > 0 ? "demand exceeds capacity" : "capacity meets demand",
      icon: totalGap > 0 ? TrendingDown : TrendingUp,
      color: totalGap > 0 ? "text-destructive" : "text-success",
      bg: totalGap > 0 ? "bg-destructive/10" : "bg-success/10",
      borderColor: totalGap > 0 ? "border-l-destructive" : "border-l-success",
    },
    {
      label: "Avg Utilization",
      value: `${avgUtil}%`,
      subtitle: avgUtil > 70 ? "Overloaded" : avgUtil >= 50 ? "Optimal" : "Underutilized",
      icon: Activity,
      color: avgUtil > 70 ? "text-destructive" : avgUtil >= 50 ? "text-success" : "text-warning",
      bg: avgUtil > 70 ? "bg-destructive/10" : avgUtil >= 50 ? "bg-success/10" : "bg-warning/10",
      borderColor: avgUtil > 70 ? "border-l-destructive" : avgUtil >= 50 ? "border-l-success" : "border-l-warning",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          className={`p-5 flex items-start gap-4 border-l-4 ${c.borderColor} hover:shadow-md transition-shadow`}
        >
          <div className={`p-3 rounded-xl ${c.bg} shrink-0`}>
            <c.icon className={`h-6 w-6 ${c.color}`} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className={`text-2xl font-bold tracking-tight ${c.color} mt-0.5`}>{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.subtitle}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
