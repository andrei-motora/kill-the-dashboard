"use client";

import { GlobeIcon, ArrowRightIcon } from "../icons";
import type { EventsWidget as EventsWidgetType } from "@/lib/schema";

export function EventsWidget({ widget }: { widget: EventsWidgetType }) {
  return (
    <section className="events-panel">
      <header className="events-head">
        <div className="events-title">
          <span className="events-icon">
            <GlobeIcon size={14} style={{ color: "#38bdf8" }} />
          </span>
          <h3>{widget.title}</h3>
          <span className="events-count mono">{widget.events.length}</span>
        </div>
      </header>

      {widget.correlationInsight && (
        <p className="events-corr">{widget.correlationInsight}</p>
      )}

      <div className="events-grid">
        {widget.events.map((event, i) => (
          <article key={i} className="event-card">
            <div className="event-top">
              <span className="event-date mono">{event.date}</span>
              <span className="mono" style={{ fontSize: 10, color: "var(--muted-2)", letterSpacing: ".12em" }}>
                0{i + 1}
              </span>
            </div>
            <h4 className="event-title-text">{event.title}</h4>
            <p className="event-body">{event.description}</p>
            <div className="event-rel">
              <ArrowRightIcon size={12} style={{ color: "#38bdf8", flexShrink: 0, marginTop: 1 }} />
              <span>{event.relevance}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
