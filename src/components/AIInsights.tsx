import { useState } from "react";
import { Sparkles, Loader2, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProcessedAsset, AIInsight } from "@/lib/types";
import { generateAIInsights } from "@/lib/processing";

interface Props {
  data: ProcessedAsset[];
}

const riskIcon = {
  High: <AlertTriangle className="h-4 w-4 text-destructive" />,
  Medium: <Info className="h-4 w-4 text-warning" />,
  Low: <CheckCircle className="h-4 w-4 text-success" />,
};

const riskBadge = {
  High: "destructive" as const,
  Medium: "secondary" as const,
  Low: "default" as const,
};

export function AIInsights({ data }: Props) {
  const [insights, setInsights] = useState<AIInsight[] | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    // Simulate async AI call
    await new Promise((r) => setTimeout(r, 1200));
    setInsights(generateAIInsights(data));
    setLoading(false);
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Insights
        </h3>
        <Button onClick={generate} disabled={loading} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Sparkles className="h-4 w-4 mr-1" />}
          {loading ? "Analyzing…" : "Generate Insights"}
        </Button>
      </div>

      {!insights && !loading && (
        <p className="text-sm text-muted-foreground">Click "Generate Insights" to analyze equipment data.</p>
      )}

      {insights && (
        <div className="space-y-3">
          {insights.map((insight) => (
            <div
              key={insight.asset_name}
              className="p-4 rounded-lg border border-border bg-muted/30"
            >
              <div className="flex items-center gap-2 mb-2">
                {riskIcon[insight.risk_level]}
                <span className="font-medium text-card-foreground">{insight.asset_name}</span>
                <Badge variant={riskBadge[insight.risk_level]}>{insight.risk_level} Risk</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                <strong className="text-card-foreground">Issue:</strong> {insight.problem}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong className="text-card-foreground">Recommendation:</strong> {insight.recommendation}
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
