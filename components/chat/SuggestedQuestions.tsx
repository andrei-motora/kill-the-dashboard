"use client";

import { TrendUpIcon, SearchIcon, LayersIcon, GlobeIcon, FilterIcon, ChevronRightIcon } from "../icons";

const QUESTIONS = [
  { icon: "trend",  text: "Why did revenue drop last week?",                  hint: "best demo" },
  { icon: "search", text: "Show me my top 5 customers by spend",              hint: null },
  { icon: "layers", text: "How are sales trending by category this quarter?", hint: null },
  { icon: "globe",  text: "Which region is growing the fastest?",             hint: null },
  { icon: "filter", text: "What's the cancellation rate trend?",              hint: null },
];

const ICON_MAP: Record<string, React.FC<{ size?: number }>> = {
  trend: TrendUpIcon,
  search: SearchIcon,
  layers: LayersIcon,
  globe: GlobeIcon,
  filter: FilterIcon,
};

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="chat-empty">
      <div className="chat-empty-head">
        <span className="smallcaps" style={{ color: "#38bdf8" }}>Try asking</span>
        <span style={{ color: "var(--muted-2)", fontSize: 11 }}>· {QUESTIONS.length} prompts</span>
      </div>
      <div className="sq-list">
        {QUESTIONS.map((q, i) => {
          const Icon = ICON_MAP[q.icon] || SearchIcon;
          return (
            <button key={i} className="sq-chip" onClick={() => onSelect(q.text)}>
              <span className="sq-icon">
                <Icon size={14} />
              </span>
              <span className="sq-text">{q.text}</span>
              {q.hint && <span className="sq-hint">{q.hint}</span>}
              <ChevronRightIcon size={14} style={{ color: "#475985" }} className="sq-arrow" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
