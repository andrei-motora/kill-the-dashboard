"use client";

import { DatabaseIcon } from "../icons";

interface LiveOrder {
  id: string;
  category: string;
  region: string;
  city: string;
  total: number;
  status: string;
}

interface LiveFeedIndicatorProps {
  isActive: boolean;
  totalOrders: number;
  recentOrders: LiveOrder[];
  ordersPerSecond: number;
  onToggle: () => void;
}

export function LiveFeedIndicator({
  isActive,
  totalOrders,
  recentOrders,
  ordersPerSecond,
  onToggle,
}: LiveFeedIndicatorProps) {
  return (
    <div className="live-feed">
      <div className="live-feed-row">
        <div className="live-feed-meta">
          <DatabaseIcon size={13} style={{ color: "#64748b" }} />
          <span className="mono" style={{ fontSize: 11.5, color: "var(--muted)" }}>
            {totalOrders.toLocaleString()} orders
          </span>
          {isActive && (
            <span style={{ color: "var(--muted-2)", fontSize: 11 }}>
              · <span style={{ color: "var(--accent-2)" }}>{ordersPerSecond}</span>/tick
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`feed-toggle ${isActive ? "feed-toggle-on" : ""}`}
        >
          <span className={`feed-dot ${isActive ? "feed-dot-on" : ""}`} />
          {isActive ? "Live" : "Start Feed"}
        </button>
      </div>
      {isActive && recentOrders.length > 0 && (
        <div className="live-feed-rows">
          {recentOrders.slice(0, 4).map((order, i) => (
            <div
              key={order.id + i}
              className="feed-row"
              style={{ opacity: 1 - i * 0.18, animationDelay: `${i * 60}ms` }}
            >
              <span className="mono" style={{ color: "var(--muted-2)", fontSize: 10 }}>
                {order.id.slice(0, 10)}
              </span>
              <span style={{ color: "var(--text-2)", flex: 1, marginLeft: 10 }}>
                {order.category} · <span style={{ color: "var(--muted)" }}>{order.city}</span>
              </span>
              <span className="mono" style={{ color: "var(--text)", fontWeight: 600 }}>
                ${order.total.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
