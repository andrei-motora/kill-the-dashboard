"use client";

import { useState } from "react";
import { LogoMark, KeyIcon, GlobeIcon, ArrowRightIcon, XIcon, LockIcon } from "./icons";

interface SetupModalProps {
  initialProvider?: string;
  onComplete: () => void;
}

export function SetupModal({ initialProvider = "anthropic", onComplete }: SetupModalProps) {
  const [provider, setProvider] = useState(initialProvider);
  const [apiKey, setApiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const valid = apiKey.trim().length > 8;

  async function handleSave() {
    if (!valid) {
      setError("An API key is required to use the app.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          tavilyKey: tavilyKey.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      onComplete();
    } catch {
      setError("Failed to save keys. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onComplete} aria-label="Close">
          <XIcon size={14} />
        </button>

        <div style={{ marginBottom: 16 }}>
          <LogoMark size={40} />
        </div>

        <h2 className="modal-title">Set up Kill the Dashboard</h2>
        <p className="modal-sub">
          Bring your own key. We don&apos;t store, proxy, or log your prompts —
          everything runs against your API account.
        </p>

        {/* Step 1 — Provider */}
        <div className="modal-step">
          <div className="modal-step-head">
            <span className="step-num">01</span>
            <span className="step-label">Choose your model provider</span>
          </div>
          <div className="provider-grid">
            {(["anthropic", "openai"] as const).map((id) => (
              <button
                key={id}
                type="button"
                className={`provider-card ${provider === id ? "provider-active" : ""}`}
                onClick={() => setProvider(id)}
              >
                <div className="provider-mark">
                  {id === "anthropic" ? (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M5 20 12 5l7 15M8.5 14h7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <circle cx="12" cy="12" r="7" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </div>
                <div className="provider-text">
                  <div className="provider-name">{id === "anthropic" ? "Anthropic" : "OpenAI"}</div>
                  <div className="provider-sub">{id === "anthropic" ? "claude-sonnet-4" : "gpt-4o"}</div>
                </div>
                <div className="provider-radio">
                  <span className={`provider-dot ${provider === id ? "provider-dot-on" : ""}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 — API key */}
        <div className="modal-step">
          <div className="modal-step-head">
            <span className="step-num">02</span>
            <span className="step-label">{provider === "anthropic" ? "Anthropic" : "OpenAI"} API key</span>
            <span className="step-required">required</span>
          </div>
          <div className="key-input">
            <KeyIcon size={14} style={{ color: "#64748b" }} />
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={provider === "anthropic" ? "sk-ant-api03-…" : "sk-proj-…"}
              spellCheck={false}
              autoComplete="off"
            />
            <button type="button" className="key-eye" onClick={() => setShowKey((s) => !s)}>
              {showKey ? "hide" : "show"}
            </button>
          </div>
          <div className="key-hint">
            Get one at <span className="mono">{provider === "anthropic" ? "console.anthropic.com" : "platform.openai.com"}</span>
          </div>
        </div>

        {/* Step 3 — Tavily */}
        <div className="modal-step">
          <div className="modal-step-head">
            <span className="step-num">03</span>
            <span className="step-label">Tavily key</span>
            <span className="step-badge">Enables external signals</span>
          </div>
          <div className="key-input">
            <GlobeIcon size={14} style={{ color: "#64748b" }} />
            <input
              type="password"
              value={tavilyKey}
              onChange={(e) => setTavilyKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="tvly-…"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className="key-hint">Optional · 1,000 searches/mo on the free tier</div>
        </div>

        {error && (
          <p style={{
            fontSize: 12,
            color: "#ef4444",
            background: "rgba(239,68,68,.08)",
            border: "1px solid rgba(239,68,68,.25)",
            borderRadius: 8,
            padding: "8px 12px",
            margin: "0 0 8px",
          }}>
            {error}
          </p>
        )}

        <button
          className={`cta ${valid ? "cta-on" : ""}`}
          disabled={!valid || saving}
          onClick={handleSave}
        >
          <span>{saving ? "Saving…" : "Start using the app"}</span>
          <ArrowRightIcon size={15} style={{ color: valid ? "#0b0f19" : "#475985" }} />
        </button>

        <div className="modal-foot">
          <LockIcon size={11} style={{ color: "#64748b" }} />
          Stored locally in <span className="mono">data/keys.json</span> · never transmitted
        </div>
      </div>
    </div>
  );
}
