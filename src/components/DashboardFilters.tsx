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
    <div className="flex flex-wrap gap-3">
      <div className="min-w-[180px]">
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Asset</label>
        <Select value={selectedAsset} onValueChange={onAssetChange}>
          <SelectTrigger>
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
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Site</label>
        <Select value={selectedSite} onValueChange={onSiteChange}>
          <SelectTrigger>
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
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Month</label>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger>
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
