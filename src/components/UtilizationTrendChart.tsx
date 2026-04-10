import { Card } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
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
  const months = [...new Set(data.map((d) => d.month))].sort();
  const assets = [...new Set(data.map((d) => d.asset_name))];

  const chartData = months.map((month) => {
    const row: Record<string, string | number> = { month };
    assets.forEach((asset) => {
      const entry = data.find((d) => d.month === month && d.asset_name === asset);
      if (entry) row[asset] = entry.utilization_pct;
    });
    return row;
  });

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Monthly Utilization Trend</h3>
      </div>
      <div className="p-5">
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
            <ReferenceLine y={70} stroke="hsl(0,72%,51%)" strokeDasharray="4 4" label={{ value: "Overload 70%", fontSize: 10, fill: "hsl(0,72%,51%)" }} />
            <ReferenceLine y={50} stroke="hsl(38,92%,50%)" strokeDasharray="4 4" label={{ value: "Optimal 50%", fontSize: 10, fill: "hsl(38,92%,50%)" }} />
            {assets.map((asset, i) => (
              <Line
                key={asset}
                type="monotone"
                dataKey={asset}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
