import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import type { ProcessedAsset } from "@/lib/types";

interface Props {
  data: ProcessedAsset[];
  overrides: Record<string, number>;
  onOverrideChange: (assetName: string, count: number) => void;
  onReset: () => void;
}

export function SimulationPanel({ data, overrides, onOverrideChange, onReset }: Props) {
  const hasOverrides = Object.keys(overrides).length > 0;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          Equipment Simulation
        </h3>
        {hasOverrides && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Adjust equipment count per asset to simulate capacity and gap changes.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((asset) => {
          const current = overrides[asset.asset_name] ?? asset.equipment_count;
          return (
            <div key={asset.asset_name} className="p-3 rounded-lg border border-border bg-muted/30 space-y-2">
              <p className="text-sm font-medium text-card-foreground">{asset.asset_name}</p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">Equip. Count</label>
                <Input
                  type="number"
                  min={1}
                  value={current}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) onOverrideChange(asset.asset_name, val);
                  }}
                  className="h-8 w-20 text-sm"
                />
                <span className="text-xs text-muted-foreground">
                  (orig: {asset.equipment_count})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
