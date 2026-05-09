"use client";

import { useState } from "react";
import { KeyRound, Zap } from "lucide-react";

interface SetupModalProps {
  initialProvider?: string;
  onComplete: () => void;
}

export function SetupModal({ initialProvider = "anthropic", onComplete }: SetupModalProps) {
  const [provider, setProvider] = useState(initialProvider);
  const [apiKey, setApiKey] = useState("");
  const [tavilyKey, setTavilyKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!apiKey.trim()) {
      setError("An AI API key is required to use the app.");
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

  const providerLinks: Record<string, string> = {
    anthropic: "console.anthropic.com → API Keys",
    openai: "platform.openai.com/api-keys",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-background rounded-2xl border shadow-2xl p-8 space-y-6 mx-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Kill the Dashboard</h2>
            <p className="text-sm text-muted-foreground">Configure your API keys to get started</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Provider selector */}
          <div>
            <label className="text-sm font-semibold mb-2 block">AI Provider</label>
            <div className="grid grid-cols-2 gap-2">
              {(["anthropic", "openai"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setProvider(p)}
                  className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                    provider === p
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "hover:bg-muted border-border"
                  }`}
                >
                  {p === "anthropic" ? "Anthropic (Claude)" : "OpenAI (GPT-4o)"}
                </button>
              ))}
            </div>
          </div>

          {/* AI API key */}
          <div>
            <label className="text-sm font-semibold mb-1.5 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5" />
              {provider === "anthropic" ? "Anthropic" : "OpenAI"} API Key
              <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder={provider === "anthropic" ? "sk-ant-api03-..." : "sk-proj-..."}
              className="w-full rounded-lg border bg-muted/30 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Get it from: <span className="font-medium">{providerLinks[provider]}</span>
            </p>
          </div>

          {/* Tavily key */}
          <div>
            <label className="text-sm font-semibold mb-1.5 block">
              Tavily API Key{" "}
              <span className="text-xs font-normal text-muted-foreground">
                — optional, enables world events correlation
              </span>
            </label>
            <input
              type="password"
              value={tavilyKey}
              onChange={(e) => setTavilyKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              placeholder="tvly-..."
              className="w-full rounded-lg border bg-muted/30 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1.5">
              Get it from: <span className="font-medium">app.tavily.com</span> — free tier, 1,000 searches/month
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !apiKey.trim()}
          className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-semibold text-sm hover:bg-primary/90 disabled:opacity-40 transition-all shadow-sm"
        >
          {saving ? "Saving..." : "Start Using the App →"}
        </button>

        <p className="text-xs text-center text-muted-foreground">
          Keys are stored locally in <code className="bg-muted px-1 rounded">data/keys.json</code> — never sent anywhere else.
        </p>
      </div>
    </div>
  );
}
