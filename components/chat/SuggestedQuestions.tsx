"use client";

import { MessageSquare } from "lucide-react";

const INITIAL_QUESTIONS = [
  "Why did revenue drop last week?",
  "Show me my top 5 customers by spend",
  "How are sales trending by category this quarter?",
  "Which region is growing the fastest?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-3 px-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Try asking</span>
      </div>
      <div className="space-y-1.5">
        {INITIAL_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="w-full text-left px-3 py-2.5 text-sm rounded-lg border hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer group"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
