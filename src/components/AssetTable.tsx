import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProcessedAsset } from "@/lib/types";

interface AssetTableProps {
  data: ProcessedAsset[];
}

function statusVariant(status: ProcessedAsset["utilization_status"]) {
  if (status === "Underutilized") return "secondary";
  if (status === "Optimal") return "default";
  return "destructive";
}

export function AssetTable({ data }: AssetTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-card-foreground">Asset Detail</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              {["Asset", "Capacity/yr", "Demand", "Gap", "Util %", "Status"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left font-medium whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.asset_name} className="border-t border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-2.5 font-medium text-card-foreground">{row.asset_name}</td>
                <td className="px-4 py-2.5">{row.capacity_per_year.toLocaleString()}</td>
                <td className="px-4 py-2.5">{row.target_cases.toLocaleString()}</td>
                <td className={`px-4 py-2.5 font-semibold ${row.gap > 0 ? "text-destructive" : "text-success"}`}>
                  {row.gap.toLocaleString()}
                </td>
                <td className="px-4 py-2.5">{row.utilization_pct}%</td>
                <td className="px-4 py-2.5">
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
