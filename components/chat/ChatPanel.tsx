"use client";

import { useRef, useEffect } from "react";
import type { Message } from "ai";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { LiveFeedIndicator } from "./LiveFeedIndicator";
import {
  LogoMark, SettingsIcon, ChevronLeftIcon, SendIcon,
  ShieldBotIcon, UserDotIcon,
} from "../icons";

interface LiveFeed {
  isActive: boolean;
  totalOrders: number;
  recentOrders: Array<{
    id: string;
    category: string;
    region: string;
    city: string;
    total: number;
    status: string;
  }>;
  ordersPerSecond: number;
  toggle: () => void;
}

interface ChatPanelProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSuggestedQuestion: (question: string) => void;
  liveFeed: LiveFeed;
  onOpenSettings?: () => void;
  onCollapse?: () => void;
}

export function ChatPanel({
  messages,
  input,
  isLoading,
  onInputChange,
  onSubmit,
  onSuggestedQuestion,
  liveFeed,
  onOpenSettings,
  onCollapse,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMessages = messages.filter(
    (m) => m.role === "user" || (m.role === "assistant" && m.content)
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages.length, isLoading]);

  return (
    <aside className="chat-panel">
      {/* Header */}
      <header className="chat-head">
        <div className="brand">
          <LogoMark size={30} />
          <div>
            <div className="brand-name">Kill the Dashboard</div>
            <div className="brand-sub">
              <span className="brand-pulse" />
              AI-generated analytics
            </div>
          </div>
        </div>
        <div className="chat-head-actions">
          {onOpenSettings && (
            <button className="icon-btn" title="Settings" onClick={onOpenSettings}>
              <SettingsIcon size={15} />
            </button>
          )}
          {onCollapse && (
            <button className="icon-btn" title="Collapse sidebar" onClick={onCollapse}>
              <ChevronLeftIcon size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="chat-body thin-scroll" ref={scrollRef}>
        {visibleMessages.length === 0 && !isLoading ? (
          <SuggestedQuestions onSelect={onSuggestedQuestion} />
        ) : (
          <div className="msg-list">
            {visibleMessages.map((m) => (
              <div key={m.id} className={`msg ${m.role === "user" ? "msg-user" : "msg-agent"}`}>
                {m.role === "user" ? (
                  <>
                    <div className="msg-bubble msg-bubble-user">{m.content}</div>
                    <div className="avatar avatar-user">
                      <UserDotIcon size={14} style={{ color: "#f8fafc" }} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="avatar avatar-agent">
                      <ShieldBotIcon size={14} style={{ color: "#38bdf8" }} />
                    </div>
                    <div className="msg-bubble msg-bubble-agent">{m.content}</div>
                  </>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="msg msg-agent">
                <div className="avatar avatar-agent">
                  <ShieldBotIcon size={14} style={{ color: "#38bdf8" }} />
                </div>
                <div className="msg-bubble msg-bubble-agent thinking">
                  <span className="dots">
                    <i style={{ animationDelay: "0s" }} />
                    <i style={{ animationDelay: ".15s" }} />
                    <i style={{ animationDelay: ".3s" }} />
                  </span>
                  <span style={{ color: "var(--muted)" }}>Analyzing your data…</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live feed */}
      <LiveFeedIndicator
        isActive={liveFeed.isActive}
        totalOrders={liveFeed.totalOrders}
        recentOrders={liveFeed.recentOrders}
        ordersPerSecond={liveFeed.ordersPerSecond}
        onToggle={liveFeed.toggle}
      />

      {/* Input */}
      <form className="chat-input" onSubmit={onSubmit}>
        <div className="chat-input-wrap">
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask about your data…"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-btn"
            disabled={isLoading || !input.trim()}
            title="Send"
          >
            <SendIcon size={14} style={{ color: "#0b0f19" }} />
          </button>
        </div>
      </form>
    </aside>
  );
}
