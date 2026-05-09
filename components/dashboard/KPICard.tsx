"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { KPIWidget } from "@/lib/schema";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export function KPICard({ widget }: { widget: KPIWidget }) {
  const { title, value, delta, deltaLabel, sentiment } = widget;

  const sentimentColor =
    sentiment === "positive"
      ? "success"
      : sentiment === "negative"
        ? "danger"
        : "secondary";

  const TrendIcon =
    sentiment === "positive"
      ? TrendingUp
      : sentiment === "negative"
        ? TrendingDown
        : Minus;

  return (
    <Card className="hover:shadow-md transition-all hover:-translate-y-0.5">
      <CardContent className="p-5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
        <p className="text-3xl font-bold tracking-tight mb-1">{value}</p>
        {delta !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={sentimentColor as "success" | "danger" | "secondary"} className="text-xs font-semibold">
              <TrendIcon className="w-3 h-3 mr-1" />
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </Badge>
            {deltaLabel && (
              <span className="text-xs text-muted-foreground">{deltaLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
