import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProcessedAsset, AIInsight } from "@/lib/types";
import { generateAIInsights } from "@/lib/processing";

interface Props {
  data: ProcessedAsset[];
}

const riskConfig = {
  High: {
    icon: <AlertTriangle className="h-4 w-4" />,
    variant: "destructive" as const,
    bg: "bg-destructive/10 border-destructive/20",
    iconColor: "text-destructive",
  },
  Medium: {
    icon: <Info className="h-4 w-4" />,
    variant: "warning" as const,
    bg: "bg-warning/10 border-warning/20",
    iconColor: "text-warning",
  },
  Low: {
    icon: <CheckCircle className="h-4 w-4" />,
    variant: "success" as const,
    bg: "bg-success/10 border-success/20",
    iconColor: "text-success",
  },
};

export function AIInsights({ data }: Props) {
  const [insights, setInsights] = useState<AIInsight[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setInsights(generateAIInsights(data));
    setLoading(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">AI Risk Analysis</h3>
        </div>
        <Button onClick={generate} disabled={loading} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing…" : "Generate Insights"}
        </Button>
      </div>

      <div className="p-5">
        {!insights && !loading && (
          <p className="text-sm text-muted-foreground">Click "Generate Insights" to run AI-powered risk analysis on your equipment data.</p>
        )}

        {insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight) => {
              const config = riskConfig[insight.risk_level];
              return (
                <div
                  key={insight.asset_name}
                  className={`p-4 rounded-xl border ${config.bg} space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={config.iconColor}>{config.icon}</span>
                      <span className="font-semibold text-sm text-card-foreground">{insight.asset_name}</span>
                    </div>
                    <Badge variant={config.variant}>{insight.risk_level} Risk</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-card-foreground">Issue: </span>{insight.problem}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-medium text-card-foreground">Action: </span>{insight.recommendation}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
