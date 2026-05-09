"use client";

import { useChat } from "ai/react";
import { useCallback, useMemo, useEffect, useState } from "react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { DashboardCanvas } from "@/components/dashboard/DashboardCanvas";
import { SetupModal } from "@/components/SetupModal";
import { useLiveFeed } from "@/lib/use-live-feed";
import type { DashboardLayout } from "@/lib/schema";

export default function Home() {
  const { messages, input, setInput, append, handleSubmit, isLoading } =
    useChat({ api: "/api/chat" });

  const liveFeed = useLiveFeed(3000);

  const [setupDone, setSetupDone] = useState<boolean | null>(null); // null = loading
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetch("/api/setup")
      .then((r) => r.json())
      .then((data) => setSetupDone(data.configured))
      .catch(() => setSetupDone(true)); // fail open
  }, []);

  const dashboardLayout = useMemo<DashboardLayout | null>(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role !== "assistant") continue;

      const parts = msg.toolInvocations;
      if (!parts) continue;

      for (let j = parts.length - 1; j >= 0; j--) {
        const part = parts[j];
        if (
          part.toolName === "renderDashboard" &&
          part.state === "result" &&
          part.result
        ) {
          return part.result as DashboardLayout;
        }
      }
    }
    return null;
  }, [messages]);

  const handleSuggestedQuestion = useCallback(
    (question: string) => {
      append({ role: "user", content: question });
    },
    [append]
  );

  const handleDrilldown = useCallback(
    (question: string) => {
      append({ role: "user", content: question });
    },
    [append]
  );

  const handleInputChange = useCallback(
    (value: string) => setInput(value),
    [setInput]
  );

  return (
    <>
      {(setupDone === false || showSettings) && (
        <SetupModal onComplete={() => { setSetupDone(true); setShowSettings(false); }} />
      )}

      <div className="flex h-screen">
        <div className="w-[380px] flex-shrink-0">
          <ChatPanel
            messages={messages}
            input={input}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onSuggestedQuestion={handleSuggestedQuestion}
            liveFeed={liveFeed}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>
        <div className="flex-1 overflow-hidden bg-muted/30">
          <DashboardCanvas
            layout={dashboardLayout}
            isLoading={isLoading}
            onDrilldown={handleDrilldown}
            onSuggestedQuestion={handleSuggestedQuestion}
          />
        </div>
      </div>
    </>
  );
}
