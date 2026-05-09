"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartWidget as ChartWidgetType } from "@/lib/schema";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const DEFAULT_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
];

const CHART_TYPES = ["line", "bar", "area", "pie"] as const;
type ChartType = typeof CHART_TYPES[number];

const TYPE_LABELS: Record<ChartType, string> = {
  line: "Line",
  bar: "Bar",
  area: "Area",
  pie: "Pie",
};

interface ChartWidgetProps {
  widget: ChartWidgetType;
  onDrilldown?: (question: string) => void;
}

export function ChartWidget({ widget, onDrilldown }: ChartWidgetProps) {
  const { title, data, xKey, yKeys, colors } = widget;
  const [chartType, setChartType] = useState<ChartType>(widget.chartType);
  const palette = colors?.length ? colors : DEFAULT_COLORS;
  const isMultiSeries = yKeys.length > 1;

  const handleClick = (entry: Record<string, unknown>) => {
    if (!onDrilldown || !entry) return;
    const label = entry[xKey] || entry.name || "";
    onDrilldown(`Tell me more about ${label}`);
  };

  const renderChart = () => {
    const effectiveType = chartType === "pie" && isMultiSeries ? "bar" : chartType;

    switch (effectiveType) {
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {yKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={palette[i % palette.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6, onClick: (e: unknown) => { const p = e as Record<string, unknown>; if (p?.payload) handleClick(p.payload as Record<string, unknown>); } }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {yKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={palette[i % palette.length]}
                radius={[4, 4, 0, 0]}
                cursor="pointer"
                onClick={(entry: Record<string, unknown>) => handleClick(entry)}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={yKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              cursor="pointer"
              onClick={(entry: Record<string, unknown>) => handleClick(entry)}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
          </PieChart>
        );

      case "area":
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {yKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={palette[i % palette.length]}
                fill={palette[i % palette.length]}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        );
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-muted">
            {CHART_TYPES.map((t) => {
              const disabled = t === "pie" && isMultiSeries;
              const active = chartType === t;
              return (
                <button
                  key={t}
                  onClick={() => !disabled && setChartType(t)}
                  disabled={disabled}
                  title={disabled ? "Pie charts only support a single data series" : TYPE_LABELS[t]}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : disabled
                      ? "text-muted-foreground/30 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {TYPE_LABELS[t]}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
