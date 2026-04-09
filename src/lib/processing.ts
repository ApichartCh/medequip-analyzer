import type { TargetDemand, ActualUtilization, ProcessedAsset, AIInsight } from "./types";

export function getUtilizationStatus(pct: number): ProcessedAsset["utilization_status"] {
  if (pct < 50) return "Underutilized";
  if (pct <= 70) return "Optimal";
  return "Overloaded";
}

export function mergeAndProcess(
  targets: TargetDemand[],
  actuals: ActualUtilization[]
): ProcessedAsset[] {
  // Group actuals by asset_name (take latest/first entry for simplicity)
  const actualMap = new Map<string, ActualUtilization>();
  actuals.forEach((a) => {
    if (!actualMap.has(a.asset_name)) {
      actualMap.set(a.asset_name, a);
    }
  });

  return targets
    .map((t) => {
      const actual = actualMap.get(t.asset_name);
      if (!actual) return null;

      const capacity_per_year =
        (actual.operation_hr * 60 / actual.cycle_time) * 365 * actual.equipment_count;
      const gap = t.target_cases - capacity_per_year;

      return {
        asset_name: t.asset_name,
        team: t.team,
        site: actual.site,
        target_cases: t.target_cases,
        capacity_per_year: Math.round(capacity_per_year),
        gap: Math.round(gap),
        utilization_pct: actual.utilization_pct,
        utilization_status: getUtilizationStatus(actual.utilization_pct),
        usage_count: actual.usage_count,
        operation_hr: actual.operation_hr,
        cycle_time: actual.cycle_time,
        equipment_count: actual.equipment_count,
      } as ProcessedAsset;
    })
    .filter(Boolean) as ProcessedAsset[];
}

export function generateAIInsights(assets: ProcessedAsset[]): AIInsight[] {
  return assets.map((asset) => {
    let risk_level: AIInsight["risk_level"];
    let problem: string;
    let recommendation: string;

    if (asset.gap > 0 && asset.utilization_pct > 70) {
      risk_level = "High";
      problem = `${asset.asset_name} is overloaded at ${asset.utilization_pct}% utilization with a capacity shortfall of ${asset.gap.toLocaleString()} cases/year.`;
      recommendation = `Consider procuring additional ${asset.asset_name} units or redistributing caseload. Evaluate extending operating hours or reducing cycle time through process optimization.`;
    } else if (asset.gap > 0 && asset.utilization_pct <= 70) {
      risk_level = "Medium";
      problem = `${asset.asset_name} has a demand gap of ${asset.gap.toLocaleString()} cases but is only at ${asset.utilization_pct}% utilization, suggesting scheduling inefficiency.`;
      recommendation = `Optimize scheduling to increase utilization before procuring new equipment. Review workflow bottlenecks and staff allocation patterns.`;
    } else if (asset.utilization_pct < 50) {
      risk_level = "Low";
      problem = `${asset.asset_name} is underutilized at ${asset.utilization_pct}% with surplus capacity of ${Math.abs(asset.gap).toLocaleString()} cases/year.`;
      recommendation = `Consider consolidating ${asset.asset_name} usage across sites or reallocating equipment to higher-demand locations.`;
    } else {
      risk_level = "Low";
      problem = `${asset.asset_name} is operating within optimal parameters with sufficient capacity.`;
      recommendation = `Maintain current operational strategy. Monitor for seasonal demand variations.`;
    }

    return { asset_name: asset.asset_name, risk_level, problem, recommendation };
  });
}

const STORAGE_KEY = "medequip_dashboard_data";

export function saveToLocalStorage(data: ProcessedAsset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFromLocalStorage(): ProcessedAsset[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
