import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import type { ProcessedAsset } from "@/lib/types";

interface AssetTableProps {
  data: ProcessedAsset[];
}

function statusVariant(status: ProcessedAsset["utilization_status"]) {
  if (status === "Underutilized") return "secondary";
  if (status === "Optimal") return "success";
  return "destructive";
}

function UtilizationBar({ pct }: { pct: number }) {
  const clamped = Math.min(100, Math.max(0, pct));
  const color =
    pct > 70 ? "bg-destructive" : pct >= 50 ? "bg-success" : "bg-warning";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${clamped}%` }} />
      </div>
      <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
    </div>
  );
}

export function AssetTable({ data }: AssetTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-card-foreground">Asset Detail</h3>
        <span className="ml-auto text-xs text-muted-foreground">{data.length} assets</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/60">
              {["Asset", "Site", "Capacity/yr", "Demand", "Gap", "Utilization", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={row.asset_name} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{row.asset_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{row.site}</td>
                <td className="px-4 py-3 tabular-nums">{row.capacity_per_year.toLocaleString()}</td>
                <td className="px-4 py-3 tabular-nums">{row.target_cases.toLocaleString()}</td>
                <td className={`px-4 py-3 font-semibold tabular-nums ${row.gap > 0 ? "text-destructive" : "text-success"}`}>
                  {row.gap > 0 ? "+" : ""}{row.gap.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <UtilizationBar pct={row.utilization_pct} />
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant(row.utilization_status)}>{row.utilization_status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
