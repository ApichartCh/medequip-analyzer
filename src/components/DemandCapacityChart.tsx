import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import type { ProcessedAsset } from "@/lib/types";

interface Props {
  data: ProcessedAsset[];
}

export function DemandCapacityChart({ data }: Props) {
  const chartData = data.map((d) => ({
    name: d.asset_name,
    Demand: d.target_cases,
    Capacity: d.capacity_per_year,
    gap: d.gap,
  }));

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-card-foreground mb-4">Demand vs Capacity</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} barGap={4}>
          <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={70} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
          <Tooltip formatter={(v: number) => v.toLocaleString()} />
          <Legend />
          <Bar dataKey="Demand" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.gap > 0 ? "hsl(0,72%,51%)" : "hsl(152,60%,40%)"} />
            ))}
          </Bar>
          <Bar dataKey="Capacity" fill="hsl(214,84%,46%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
