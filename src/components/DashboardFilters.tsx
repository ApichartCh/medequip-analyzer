import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  assets: string[];
  sites: string[];
  months: string[];
  selectedAsset: string;
  selectedSite: string;
  selectedMonth: string;
  onAssetChange: (v: string) => void;
  onSiteChange: (v: string) => void;
  onMonthChange: (v: string) => void;
}

export function DashboardFilters({
  assets,
  sites,
  months,
  selectedAsset,
  selectedSite,
  selectedMonth,
  onAssetChange,
  onSiteChange,
  onMonthChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl bg-card border border-border shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground mr-2">
        <Filter className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
      </div>
      <div className="min-w-[180px]">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Asset</label>
        <Select value={selectedAsset} onValueChange={onAssetChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All Assets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Assets</SelectItem>
            {assets.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[180px]">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Site</label>
        <Select value={selectedSite} onValueChange={onSiteChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All Sites" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Sites</SelectItem>
            {sites.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[180px]">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Month</label>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Months</SelectItem>
            {months.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
