"use client";

import { useRef, useEffect } from "react";
import type { Message } from "ai";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { LiveFeedIndicator } from "./LiveFeedIndicator";
import { Send, Loader2, Bot, User, Zap, Settings } from "lucide-react";

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
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const visibleMessages = messages.filter(
    (m) => m.role === "user" || (m.role === "assistant" && m.content)
  );

  return (
    <div className="flex flex-col h-full border-r bg-background">
      <div className="px-5 py-4 border-b bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            Kill the Dashboard
          </h2>
          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              title="Configure API keys"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-10">
          AI-generated analytics from your questions
        </p>
      </div>

      <ScrollArea className="flex-1 py-4 scrollbar-thin" ref={scrollRef}>
        {visibleMessages.length === 0 && (
          <div className="pt-2">
            <SuggestedQuestions onSelect={onSuggestedQuestion} />
          </div>
        )}

        <div className="space-y-4 px-4">
          {visibleMessages.map((m) => (
            <div key={m.id} className="flex gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-to-br from-primary/20 to-primary/5"
                }`}
              >
                {m.role === "user" ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {m.role === "user" ? "You" : "Agent"}
                </p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                Analyzing your data...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <LiveFeedIndicator
        isActive={liveFeed.isActive}
        totalOrders={liveFeed.totalOrders}
        recentOrders={liveFeed.recentOrders}
        ordersPerSecond={liveFeed.ordersPerSecond}
        onToggle={liveFeed.toggle}
      />

      <form onSubmit={onSubmit} className="p-4 border-t bg-muted/30">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Ask about your data..."
            className="flex-1 rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-lg bg-primary text-primary-foreground px-3 py-2.5 hover:bg-primary/90 disabled:opacity-40 transition-all shadow-sm hover:shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
