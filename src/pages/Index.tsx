import { useState, useEffect, useCallback, useMemo } from "react";
import { Activity, Trash2, Loader2, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CsvUploader } from "@/components/CsvUploader";
import { KpiCards } from "@/components/KpiCards";
import { AssetTable } from "@/components/AssetTable";
import { DemandCapacityChart } from "@/components/DemandCapacityChart";
import { AIInsights } from "@/components/AIInsights";
import { DashboardFilters } from "@/components/DashboardFilters";
import { UtilizationTrendChart } from "@/components/UtilizationTrendChart";
import { SimulationPanel } from "@/components/SimulationPanel";
import {
  mergeAndProcess,
  extractMonthlyUtilization,
  getUtilizationStatus,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "@/lib/processing";
import type { ProcessedAsset, TargetDemand, ActualUtilization, MonthlyUtilization } from "@/lib/types";

const TARGET_COLS = ["asset_name", "team", "target_cases"];
const ACTUAL_COLS = [
  "asset_name", "site", "month", "utilization_pct",
  "usage_count", "operation_hr", "cycle_time", "equipment_count",
];
const MONTHLY_KEY = "medequip_monthly_data";

export default function Index() {
  const [targets, setTargets] = useState<TargetDemand[] | null>(null);
  const [actuals, setActuals] = useState<ActualUtilization[] | null>(null);
  const [processed, setProcessed] = useState<ProcessedAsset[]>([]);
  const [monthly, setMonthly] = useState<MonthlyUtilization[]>([]);
  const [loading, setLoading] = useState(false);
  const [equipOverrides, setEquipOverrides] = useState<Record<string, number>>({});

  const [filterAsset, setFilterAsset] = useState("__all__");
  const [filterSite, setFilterSite] = useState("__all__");
  const [filterMonth, setFilterMonth] = useState("__all__");

  useEffect(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.length > 0) setProcessed(saved);
    const savedMonthly = localStorage.getItem(MONTHLY_KEY);
    if (savedMonthly) {
      try { setMonthly(JSON.parse(savedMonthly)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!targets || !actuals) return;
    setLoading(true);
    const timer = setTimeout(() => {
      const result = mergeAndProcess(targets, actuals);
      const monthlyData = extractMonthlyUtilization(actuals);
      setProcessed(result);
      setMonthly(monthlyData);
      saveToLocalStorage(result);
      localStorage.setItem(MONTHLY_KEY, JSON.stringify(monthlyData));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [targets, actuals]);

  const handleClear = useCallback(() => {
    setTargets(null);
    setActuals(null);
    setProcessed([]);
    setMonthly([]);
    setEquipOverrides({});
    setFilterAsset("__all__");
    setFilterSite("__all__");
    setFilterMonth("__all__");
    clearLocalStorage();
    localStorage.removeItem(MONTHLY_KEY);
  }, []);

  const simulatedProcessed = useMemo(() => {
    if (Object.keys(equipOverrides).length === 0) return processed;
    return processed.map((asset) => {
      const override = equipOverrides[asset.asset_name];
      if (override === undefined || override === asset.equipment_count) return asset;
      const capacity_per_year = Math.round(
        (asset.operation_hr * 60 / asset.cycle_time) * 365 * override
      );
      const gap = asset.target_cases - capacity_per_year;
      return {
        ...asset,
        equipment_count: override,
        capacity_per_year,
        gap,
        utilization_status: getUtilizationStatus(asset.utilization_pct),
      };
    });
  }, [processed, equipOverrides]);

  const allAssets = useMemo(() => [...new Set(simulatedProcessed.map((d) => d.asset_name))].sort(), [simulatedProcessed]);
  const allSites = useMemo(() => [...new Set(simulatedProcessed.map((d) => d.site))].sort(), [simulatedProcessed]);
  const allMonths = useMemo(() => [...new Set(monthly.map((d) => d.month))].sort(), [monthly]);

  const filteredProcessed = useMemo(() => {
    let data = simulatedProcessed;
    if (filterAsset !== "__all__") data = data.filter((d) => d.asset_name === filterAsset);
    if (filterSite !== "__all__") data = data.filter((d) => d.site === filterSite);
    return data;
  }, [simulatedProcessed, filterAsset, filterSite]);

  const filteredMonthly = useMemo(() => {
    let data = monthly;
    if (filterAsset !== "__all__") data = data.filter((d) => d.asset_name === filterAsset);
    if (filterSite !== "__all__") data = data.filter((d) => d.site === filterSite);
    if (filterMonth !== "__all__") data = data.filter((d) => d.month === filterMonth);
    return data;
  }, [monthly, filterAsset, filterSite, filterMonth]);

  const hasDashboard = simulatedProcessed.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-card-foreground leading-tight tracking-tight">
                MedEquip Analytics
              </h1>
              <p className="text-xs text-muted-foreground">Hospital Equipment Utilization Dashboard</p>
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

      <main className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        {!hasDashboard && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-1">Upload Data</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Import your target demand and actual utilization CSV files to generate the dashboard.
            </p>
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

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground font-medium">Processing data…</span>
          </div>
        )}

        {hasDashboard && !loading && (
          <>
            <DashboardFilters
              assets={allAssets}
              sites={allSites}
              months={allMonths}
              selectedAsset={filterAsset}
              selectedSite={filterSite}
              selectedMonth={filterMonth}
              onAssetChange={setFilterAsset}
              onSiteChange={setFilterSite}
              onMonthChange={setFilterMonth}
            />
            <KpiCards data={filteredProcessed} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DemandCapacityChart data={filteredProcessed} />
              <AssetTable data={filteredProcessed} />
            </div>
            <SimulationPanel
              data={processed}
              overrides={equipOverrides}
              onOverrideChange={(name, count) =>
                setEquipOverrides((prev) => ({ ...prev, [name]: count }))
              }
              onReset={() => setEquipOverrides({})}
            />
            <UtilizationTrendChart data={filteredMonthly} />
            <AIInsights data={filteredProcessed} />
          </>
        )}
      </main>
    </div>
  );
}
