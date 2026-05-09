"use client";

import { useState } from "react";
import type { ChartWidget as ChartWidgetType } from "@/lib/schema";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CHART_COLORS = [
  "#0ea5e9", "#1e3a5f", "#38bdf8", "#475985", "#0369a1",
  "#7dd3fc", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
];

const CHART_TYPES = ["Line", "Bar", "Area", "Pie"] as const;
type ChartType = typeof CHART_TYPES[number];

interface ChartWidgetProps {
  widget: ChartWidgetType;
  onDrilldown?: (question: string) => void;
}

export function ChartWidget({ widget, onDrilldown }: ChartWidgetProps) {
  const { title, data, xKey, yKeys, colors } = widget;
  const [chartType, setChartType] = useState<ChartType>(
    (widget.chartType.charAt(0).toUpperCase() + widget.chartType.slice(1)) as ChartType
  );
  const palette = colors?.length ? colors : CHART_COLORS;
  const isMultiSeries = yKeys.length > 1;

  const handleClick = (entry: Record<string, unknown>) => {
    if (!onDrilldown || !entry) return;
    const label = entry[xKey] || entry.name || "";
    onDrilldown(`Tell me more about ${label}`);
  };

  const effectiveType = chartType === "Pie" && isMultiSeries ? "Bar" : chartType;

  const renderChart = () => {
    const tooltipStyle = {
      contentStyle: {
        background: "rgba(12, 18, 32, 0.96)",
        border: "1px solid #1e3a5f",
        borderRadius: 8,
        fontSize: 11,
        color: "#cbd5e1",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      },
      labelStyle: { color: "#94a3b8", fontSize: 10 },
    };

    switch (effectiveType) {
      case "Line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(36, 49, 84, 0.55)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#64748b" }} stroke="transparent" />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} stroke="transparent" />
            <Tooltip {...tooltipStyle} />
            {yKeys.map((key, i) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={palette[i % palette.length]}
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: "#0e1420", stroke: palette[i % palette.length], strokeWidth: 2 }}
                activeDot={{ r: 4.5, onClick: (e: unknown) => { const p = e as Record<string, unknown>; if (p?.payload) handleClick(p.payload as Record<string, unknown>); } }}
              />
            ))}
          </LineChart>
        );

      case "Bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(36, 49, 84, 0.55)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#64748b" }} stroke="transparent" />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} stroke="transparent" />
            <Tooltip {...tooltipStyle} />
            {yKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={palette[i % palette.length]}
                radius={[3, 3, 0, 0]}
                cursor="pointer"
                onClick={(entry: Record<string, unknown>) => handleClick(entry)}
              />
            ))}
          </BarChart>
        );

      case "Pie":
        return (
          <PieChart>
            <Tooltip {...tooltipStyle} />
            <Pie
              data={data}
              dataKey={yKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={62}
              stroke="#0e1420"
              strokeWidth={2}
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

      case "Area":
        return (
          <AreaChart data={data}>
            <defs>
              {yKeys.map((key, i) => (
                <linearGradient key={key} id={`area-g-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={palette[i % palette.length]} stopOpacity={0.55} />
                  <stop offset="100%" stopColor={palette[i % palette.length]} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(36, 49, 84, 0.55)" />
            <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#64748b" }} stroke="transparent" />
            <YAxis tick={{ fontSize: 10, fill: "#64748b" }} stroke="transparent" />
            <Tooltip {...tooltipStyle} />
            {yKeys.map((key, i) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={palette[i % palette.length]}
                strokeWidth={2}
                fill={`url(#area-g-${key})`}
              />
            ))}
          </AreaChart>
        );
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-head">
        <div>
          <div className="chart-title">{title}</div>
        </div>
        <div className="chart-switch">
          {CHART_TYPES.map((t) => {
            const disabled = t === "Pie" && isMultiSeries;
            const active = chartType === t;
            return (
              <button
                key={t}
                className={`cs-btn ${active ? "cs-active" : ""} ${disabled ? "cs-disabled" : ""}`}
                disabled={disabled}
                title={disabled ? "Pie supports a single series" : t}
                onClick={() => !disabled && setChartType(t)}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ margin: "0 -4px" }}>
        <div style={{ height: 260, width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-foot">
        {yKeys.map((k, i) => (
          <span key={k} className="legend-item">
            <span className="legend-dot" style={{ background: palette[i % palette.length] }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
