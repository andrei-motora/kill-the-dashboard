"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface LiveOrder {
  id: string;
  category: string;
  region: string;
  city: string;
  total: number;
  status: string;
}

interface LiveFeedState {
  isActive: boolean;
  totalOrders: number;
  recentOrders: LiveOrder[];
  ordersPerSecond: number;
}

export function useLiveFeed(intervalMs = 3000) {
  const [state, setState] = useState<LiveFeedState>({
    isActive: false,
    totalOrders: 0,
    recentOrders: [],
    ordersPerSecond: 0,
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const insertCountRef = useRef(0);
  const rateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchInitialCount = useCallback(async () => {
    try {
      const res = await fetch("/api/live-feed");
      const data = await res.json();
      setState((s) => ({ ...s, totalOrders: data.totalOrders }));
    } catch {}
  }, []);

  const tick = useCallback(async () => {
    try {
      const res = await fetch("/api/live-feed", { method: "POST" });
      const data = await res.json();
      insertCountRef.current += data.inserted;
      setState((s) => ({
        ...s,
        totalOrders: data.totalOrders,
        recentOrders: [...data.orders, ...s.recentOrders].slice(0, 8),
      }));
    } catch {}
  }, []);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setState((s) => ({ ...s, isActive: true }));
    tick();
    intervalRef.current = setInterval(tick, intervalMs);
    rateIntervalRef.current = setInterval(() => {
      setState((s) => ({
        ...s,
        ordersPerSecond: Math.round((insertCountRef.current / intervalMs) * 1000 * 10) / 10,
      }));
      insertCountRef.current = 0;
    }, intervalMs);
  }, [tick, intervalMs]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (rateIntervalRef.current) {
      clearInterval(rateIntervalRef.current);
      rateIntervalRef.current = null;
    }
    setState((s) => ({ ...s, isActive: false, ordersPerSecond: 0 }));
  }, []);

  const toggle = useCallback(() => {
    if (state.isActive) stop();
    else start();
  }, [state.isActive, start, stop]);

  useEffect(() => {
    fetchInitialCount();
    return () => {
      stop();
    };
  }, [fetchInitialCount, stop]);

  return { ...state, toggle, start, stop };
}
