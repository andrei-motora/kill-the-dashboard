"use client";

import { Radio, Database } from "lucide-react";

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
    <div className="border-t px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            {totalOrders.toLocaleString()} orders
          </span>
        </div>
        <button
          onClick={onToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isActive
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isActive ? "bg-emerald-500" : "bg-muted-foreground/40"
              }`}
            />
          </span>
          {isActive ? "Live" : "Start Feed"}
        </button>
      </div>

      {isActive && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <Radio className="w-3 h-3" />
            <span>{ordersPerSecond} orders/tick incoming</span>
          </div>
          {recentOrders.length > 0 && (
            <div className="space-y-1 max-h-[120px] overflow-hidden">
              {recentOrders.slice(0, 4).map((order, i) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded bg-muted/50"
                  style={{ opacity: 1 - i * 0.2 }}
                >
                  <span className="text-muted-foreground">
                    {order.category} · {order.city}
                  </span>
                  <span className="font-medium">
                    ${order.total.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
