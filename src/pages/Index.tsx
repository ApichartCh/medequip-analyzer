import { useState, useEffect, useCallback } from "react";
import { Activity, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CsvUploader } from "@/components/CsvUploader";
import { KpiCards } from "@/components/KpiCards";
import { AssetTable } from "@/components/AssetTable";
import { DemandCapacityChart } from "@/components/DemandCapacityChart";
import { AIInsights } from "@/components/AIInsights";
import {
  mergeAndProcess,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "@/lib/processing";
import type { ProcessedAsset, TargetDemand, ActualUtilization } from "@/lib/types";

const TARGET_COLS = ["asset_name", "team", "target_cases"];
const ACTUAL_COLS = [
  "asset_name",
  "site",
  "month",
  "utilization_pct",
  "usage_count",
  "operation_hr",
  "cycle_time",
  "equipment_count",
];

export default function Index() {
  const [targets, setTargets] = useState<TargetDemand[] | null>(null);
  const [actuals, setActuals] = useState<ActualUtilization[] | null>(null);
  const [processed, setProcessed] = useState<ProcessedAsset[]>([]);
  const [loading, setLoading] = useState(false);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.length > 0) {
      setProcessed(saved);
    }
  }, []);

  // Process when both files are uploaded
  useEffect(() => {
    if (!targets || !actuals) return;
    setLoading(true);
    const timer = setTimeout(() => {
      const result = mergeAndProcess(targets, actuals);
      setProcessed(result);
      saveToLocalStorage(result);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [targets, actuals]);

  const handleClear = useCallback(() => {
    setTargets(null);
    setActuals(null);
    setProcessed([]);
    clearLocalStorage();
  }, []);

  const hasDashboard = processed.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground leading-tight">
                MedEquip Analytics
              </h1>
              <p className="text-xs text-muted-foreground">Equipment Utilization Dashboard</p>
            </div>
          </div>
          {hasDashboard && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear Data
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        {!hasDashboard && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Upload Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CsvUploader
                label="Target Demand"
                description="Columns: asset_name, team, target_cases"
                requiredColumns={TARGET_COLS}
                onParsed={(d) => setTargets(d as unknown as TargetDemand[])}
              />
              <CsvUploader
                label="Actual Utilization"
                description="Columns: asset_name, site, month, utilization_pct, usage_count, operation_hr, cycle_time, equipment_count"
                requiredColumns={ACTUAL_COLS}
                onParsed={(d) => setActuals(d as unknown as ActualUtilization[])}
              />
            </div>
          </section>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Processing data…</span>
          </div>
        )}

        {/* Dashboard */}
        {hasDashboard && !loading && (
          <>
            <KpiCards data={processed} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DemandCapacityChart data={processed} />
              <AssetTable data={processed} />
            </div>
            <AIInsights data={processed} />
          </>
        )}
      </main>
    </div>
  );
}
