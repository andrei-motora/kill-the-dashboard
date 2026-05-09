"use client";

import type { DashboardLayout } from "@/lib/schema";
import { KPICard } from "./KPICard";
import { ChartWidget } from "./ChartWidget";
import { BarChart3, Sparkles, TrendingUp, PieChart, Activity } from "lucide-react";

interface DashboardCanvasProps {
  layout: DashboardLayout | null;
  isLoading: boolean;
  onDrilldown: (question: string) => void;
  onSuggestedQuestion: (question: string) => void;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card animate-pulse">
      <div className="p-5 space-y-3">
        <div className="h-3.5 bg-muted rounded w-2/5" />
        <div className="h-9 bg-muted rounded w-3/5" />
        <div className="h-5 bg-muted rounded-full w-1/3" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="rounded-xl border bg-card animate-pulse">
      <div className="p-6 space-y-4">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-[280px] bg-muted/60 rounded-lg" />
      </div>
    </div>
  );
}

export function DashboardCanvas({
  layout,
  isLoading,
  onDrilldown,
  onSuggestedQuestion,
}: DashboardCanvasProps) {
  if (!layout && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center rotate-12">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="absolute -bottom-1 -left-3 w-7 h-7 rounded-lg bg-gradient-to-br from-primary/25 to-primary/5 flex items-center justify-center -rotate-12">
            <PieChart className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-3 tracking-tight">No pre-built dashboards here</h2>
        <p className="text-muted-foreground max-w-lg leading-relaxed">
          Ask a question and the AI agent will query your data, pick the right visualizations,
          and generate a complete dashboard — KPIs, charts, and insights, all in seconds.
        </p>
        <div className="flex items-center gap-1.5 mt-6 text-xs text-muted-foreground/70">
          <Activity className="w-3.5 h-3.5" />
          <span>10,000+ orders across 12 months ready to explore</span>
        </div>
      </div>
    );
  }

  if (isLoading && !layout) {
    return (
      <div className="p-6 space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded bg-primary/20 animate-pulse" />
          <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="h-20 bg-muted/40 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!layout) return null;

  const kpis = layout.widgets.filter((w) => w.type === "kpi");
  const charts = layout.widgets.filter((w) => w.type === "chart");

  return (
    <div className="p-6 space-y-6 overflow-auto h-full scrollbar-thin">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">{layout.title}</h1>
      </div>

      {kpis.length > 0 && (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${Math.min(kpis.length, 4)}, 1fr)` }}
        >
          {kpis.map((w, i) => (
            <KPICard key={i} widget={w} />
          ))}
        </div>
      )}

      {charts.length > 0 && (
        <div className={`grid gap-4 ${charts.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {charts.map((w, i) => (
            <ChartWidget key={i} widget={w} onDrilldown={onDrilldown} />
          ))}
        </div>
      )}

      {layout.insights && (
        <div className="rounded-xl border bg-gradient-to-r from-primary/5 to-transparent p-5">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-primary mb-1.5 uppercase tracking-wider">Insights</p>
              <p className="text-sm leading-relaxed">{layout.insights}</p>
            </div>
          </div>
        </div>
      )}

      {layout.suggestedQuestions.length > 0 && (
        <div className="space-y-3 pb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Drill deeper</p>
          <div className="flex flex-wrap gap-2">
            {layout.suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => onSuggestedQuestion(q)}
                className="px-4 py-2 text-sm rounded-full border hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
