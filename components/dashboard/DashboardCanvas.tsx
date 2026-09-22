"use client";

import { useState, useEffect, useRef } from "react";
import type { DashboardLayout } from "@/lib/schema";
import type { ThinkingStep } from "@/lib/thinking-steps";
import { KPICard } from "./KPICard";
import { ChartWidget } from "./ChartWidget";
import { EventsWidget } from "./EventsWidget";
import { GlobeWidget } from "./GlobeWidget";
import { ThinkingView } from "./ThinkingView";
import { LogoMark, SparklesIcon, ArrowRightIcon } from "../icons";

interface DashboardCanvasProps {
  layout: DashboardLayout | null;
  isLoading: boolean;
  thinkingSteps: ThinkingStep[];
  onDrilldown: (question: string) => void;
  onSuggestedQuestion: (question: string) => void;
}

function CanvasEmpty() {
  return (
    <div className="canvas-empty">
      <div className="canvas-empty-watermark">
        <LogoMark size={420} glow={false} />
      </div>
      <div className="canvas-empty-content">
        <div className="canvas-empty-pill">
          <span className="brand-pulse" />
          <span className="smallcaps" style={{ color: "var(--accent-2)" }}>Ready</span>
          <span style={{ color: "var(--muted-2)", fontSize: 11 }}>
            · 10,000+ orders · May 2025 — Apr 2026
          </span>
        </div>
        <h1 className="canvas-empty-title">No pre-built dashboards here.</h1>
        <p className="canvas-empty-sub">
          The agent queries your data, picks the right visualizations, and assembles a dashboard
          on demand — every time. Ask a question on the left to start.
        </p>
        <div className="canvas-empty-features">
          <span className="feat-pill"><span className="feat-num mono">01</span> SQL queries on demand</span>
          <span className="feat-pill"><span className="feat-num mono">02</span> KPI cards &amp; charts</span>
          <span className="feat-pill"><span className="feat-num mono">03</span> Live data feed</span>
          <span className="feat-pill"><span className="feat-num mono">04</span> External signals</span>
        </div>
      </div>
    </div>
  );
}

function CanvasLoading() {
  return (
    <div className="canvas-loading">
      <div className="cl-titlebar">
        <span className="skel" style={{ width: 22, height: 22, borderRadius: 6 }} />
        <span className="skel" style={{ width: 280, height: 18 }} />
        <span style={{ flex: 1 }} />
        <span className="skel" style={{ width: 130, height: 14 }} />
      </div>
      <div className="cl-tools">
        <span className="cl-tool"><span className="cl-pulse" />executeSql · querying</span>
        <span className="cl-tool"><span className="cl-pulse" />executeSql · breakdown</span>
        <span className="cl-tool"><span className="cl-pulse" />searchWorldEvents</span>
        <span className="cl-tool"><span className="cl-pulse" />renderDashboard</span>
      </div>
      <div className="cl-grid-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="kpi-card" style={{ paddingTop: 16 }}>
            <span className="skel" style={{ width: 90, height: 11, marginBottom: 14 }} />
            <span className="skel" style={{ width: 130, height: 28, marginBottom: 12 }} />
            <span className="skel" style={{ width: 90, height: 18, borderRadius: 999 }} />
          </div>
        ))}
      </div>
      <div className="cl-grid-2">
        {[0, 1].map((i) => (
          <div key={i} className="chart-card">
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span className="skel" style={{ width: 160, height: 14 }} />
              <span className="skel" style={{ width: 160, height: 26, borderRadius: 8 }} />
            </div>
            <span className="skel" style={{ width: "100%", height: 240, borderRadius: 10 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardCanvas({
  layout,
  isLoading,
  thinkingSteps,
  onDrilldown,
  onSuggestedQuestion,
}: DashboardCanvasProps) {
  const [phase, setPhase] = useState<"empty" | "thinking" | "fade-out" | "dashboard">("empty");
  const wasThinkingRef = useRef(false);

  useEffect(() => {
    if (isLoading && !layout) {
      setPhase("thinking");
      wasThinkingRef.current = true;
    } else if (layout) {
      if (wasThinkingRef.current) {
        wasThinkingRef.current = false;
        setPhase("fade-out");
        const timer = setTimeout(() => setPhase("dashboard"), 300);
        return () => clearTimeout(timer);
      } else {
        setPhase("dashboard");
      }
    } else if (!layout && !isLoading) {
      setPhase("empty");
      wasThinkingRef.current = false;
    }
  }, [layout, isLoading]);

  if (phase === "empty") {
    return (
      <div className="canvas-wrap thin-scroll app-bg">
        <CanvasEmpty />
      </div>
    );
  }

  if (phase === "thinking" || phase === "fade-out") {
    return (
      <div className={`canvas-wrap thin-scroll app-bg ${phase === "fade-out" ? "canvas-fade-out" : ""}`}>
        <ThinkingView steps={thinkingSteps} />
      </div>
    );
  }

  if (!layout) return null;

  const kpis = layout.widgets.filter((w) => w.type === "kpi");
  const charts = layout.widgets.filter((w) => w.type === "chart");
  const maps = layout.widgets.filter((w) => w.type === "map");
  const events = layout.widgets.filter((w) => w.type === "events");

  return (
    <div className="canvas-wrap thin-scroll app-bg">
      <div className="canvas-dashboard canvas-fade-in">
        {/* Title */}
        <div className="canvas-titlebar">
          <div className="canvas-titlebar-left">
            <span className="canvas-title-icon">
              <SparklesIcon size={15} style={{ color: "#38bdf8" }} />
            </span>
            <h1 className="canvas-title">{layout.title}</h1>
          </div>
        </div>

        {/* KPIs */}
        {kpis.length > 0 && (
          <div className="kpi-grid" style={{
            gridTemplateColumns: `repeat(${Math.min(kpis.length, 4)}, 1fr)`,
          }}>
            {kpis.map((w, i) => (
              w.type === "kpi" && <KPICard key={i} widget={w} />
            ))}
          </div>
        )}

        {/* Charts */}
        {charts.length > 0 && (
          <div className="chart-grid" style={{
            gridTemplateColumns: charts.length === 1 ? "1fr" : "1fr 1fr",
          }}>
            {charts.map((w, i) => (
              w.type === "chart" && <ChartWidget key={i} widget={w} onDrilldown={onDrilldown} />
            ))}
          </div>
        )}

        {/* Globe maps */}
        {maps.map((w, i) =>
          w.type === "map" ? <GlobeWidget key={i} widget={w} /> : null
        )}

        {/* Events */}
        {events.map((w, i) =>
          w.type === "events" ? <EventsWidget key={i} widget={w} /> : null
        )}

        {/* Insights */}
        {layout.insights && (
          <div className="insight">
            <div className="insight-tag">
              <SparklesIcon size={12} style={{ color: "#38bdf8" }} />
              <span className="smallcaps" style={{ color: "var(--accent-2)" }}>Insight</span>
            </div>
            <p className="insight-text">{layout.insights}</p>
          </div>
        )}

        {/* Drill deeper */}
        {layout.suggestedQuestions.length > 0 && (
          <div className="drill">
            <div className="smallcaps" style={{ color: "var(--muted)" }}>Drill deeper</div>
            <div className="drill-chips">
              {layout.suggestedQuestions.map((q, i) => (
                <button key={i} className="drill-chip" onClick={() => onSuggestedQuestion(q)}>
                  <span>{q}</span>
                  <ArrowRightIcon size={13} style={{ color: "#38bdf8" }} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
