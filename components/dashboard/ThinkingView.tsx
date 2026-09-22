"use client";

import type { ThinkingStep } from "@/lib/thinking-steps";
import { SparklesIcon, CheckIcon } from "../icons";

interface ThinkingViewProps {
  steps: ThinkingStep[];
}

export function ThinkingView({ steps }: ThinkingViewProps) {
  return (
    <div className="thinking-view">
      <div className="thinking-header">
        <div className="thinking-icon">
          <SparklesIcon size={18} style={{ color: "#38bdf8" }} />
        </div>
        <div>
          <h2 className="thinking-title">Analyzing your data</h2>
          <p className="thinking-sub">The agent is querying and building your dashboard</p>
        </div>
      </div>

      <div className="thinking-steps">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={`thinking-pill ${step.status === "done" ? "thinking-pill-done" : "thinking-pill-active"}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="thinking-pill-indicator">
              {step.status === "done" ? (
                <CheckIcon size={12} />
              ) : (
                <span className="thinking-pill-pulse" />
              )}
            </div>
            <span className="thinking-pill-label">{step.label}</span>
          </div>
        ))}

        {steps.length > 0 && steps[steps.length - 1]?.status !== "done" && (
          <div className="thinking-cursor" />
        )}
      </div>
    </div>
  );
}
