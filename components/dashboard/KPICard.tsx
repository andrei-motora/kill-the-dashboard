"use client";

import type { KPIWidget } from "@/lib/schema";
import { TrendUpIcon, TrendDownIcon } from "../icons";

export function KPICard({ widget }: { widget: KPIWidget }) {
  const { title, value, delta, deltaLabel, sentiment } = widget;
  const isNeg = sentiment === "negative";

  return (
    <div className="kpi-card">
      <div className="kpi-head">
        <span className="smallcaps" style={{ color: "var(--muted)" }}>{title}</span>
      </div>
      <div className="kpi-value mono">{value}</div>
      {delta !== undefined && (
        <div className="kpi-foot">
          <span className={`kpi-badge ${isNeg ? "kpi-badge-neg" : "kpi-badge-pos"}`}>
            {isNeg ? (
              <TrendDownIcon size={11} style={{ color: "#ef4444" }} />
            ) : (
              <TrendUpIcon size={11} style={{ color: "#22c55e" }} />
            )}
            <span className="mono">
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </span>
          </span>
          {deltaLabel && (
            <span style={{ color: "var(--muted-2)", fontSize: 11 }}>{deltaLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
