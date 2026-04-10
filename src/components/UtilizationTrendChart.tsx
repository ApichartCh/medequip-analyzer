import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { MonthlyUtilization } from "@/lib/types";

interface Props {
  data: MonthlyUtilization[];
}

const COLORS = [
  "hsl(214,84%,46%)",
  "hsl(152,60%,40%)",
  "hsl(0,72%,51%)",
  "hsl(38,92%,50%)",
  "hsl(270,60%,50%)",
  "hsl(180,60%,40%)",
  "hsl(330,60%,50%)",
  "hsl(60,70%,45%)",
];

export function UtilizationTrendChart({ data }: Props) {
  // Get unique months sorted and unique assets
  const months = [...new Set(data.map((d) => d.month))].sort();
  const assets = [...new Set(data.map((d) => d.asset_name))];

  // Pivot: { month, asset1: pct, asset2: pct, ... }
  const chartData = months.map((month) => {
    const row: Record<string, string | number> = { month };
    assets.forEach((asset) => {
      const entry = data.find((d) => d.month === month && d.asset_name === asset);
      if (entry) row[asset] = entry.utilization_pct;
    });
    return row;
  });

  return (
    <Card className="p-5">
      <h3 className="font-semibold text-card-foreground mb-4">Monthly Utilization Trend</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend />
          {assets.map((asset, i) => (
            <Line
              key={asset}
              type="monotone"
              dataKey={asset}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
