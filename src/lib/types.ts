export interface TargetDemand {
  asset_name: string;
  team: string;
  target_cases: number;
}

export interface ActualUtilization {
  asset_name: string;
  site: string;
  month: string;
  utilization_pct: number;
  usage_count: number;
  operation_hr: number;
  cycle_time: number;
  equipment_count: number;
}

export interface ProcessedAsset {
  asset_name: string;
  team: string;
  site: string;
  target_cases: number;
  capacity_per_year: number;
  gap: number;
  utilization_pct: number;
  utilization_status: "Underutilized" | "Optimal" | "Overloaded";
  usage_count: number;
  operation_hr: number;
  cycle_time: number;
  equipment_count: number;
}

export interface MonthlyUtilization {
  asset_name: string;
  site: string;
  month: string;
  utilization_pct: number;
}

export interface AIInsight {
  asset_name: string;
  risk_level: "Low" | "Medium" | "High";
  problem: string;
  recommendation: string;
}
