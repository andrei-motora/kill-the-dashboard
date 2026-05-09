"use client";

import { Globe, Calendar } from "lucide-react";
import type { EventsWidget as EventsWidgetType } from "@/lib/schema";

export function EventsWidget({ widget }: { widget: EventsWidgetType }) {
  return (
    <div className="rounded-xl border bg-card col-span-2">
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <h3 className="font-semibold text-sm">{widget.title}</h3>
        </div>

        {widget.correlationInsight && (
          <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-blue-500/40 pl-3 italic">
            {widget.correlationInsight}
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {widget.events.map((event, i) => (
            <div key={i} className="rounded-lg bg-muted/40 p-3.5 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold leading-tight">{event.title}</p>
                {event.date && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 mt-0.5 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    {event.date}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{event.description}</p>
              {event.relevance && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  → {event.relevance}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
