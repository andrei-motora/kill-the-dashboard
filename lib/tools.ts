import { tool } from "ai";
import { z } from "zod";
import { getDb } from "./db";
import { DashboardLayoutSchema } from "./schema";
import { getTavilyKey } from "./config";

export const executeSql = tool({
  description:
    "Execute a read-only SQL query against the e-commerce SQLite database. " +
    "Tables: 'orders' (id, customer_id, order_date, total, discount, status, category, region, city, lat, lng) " +
    "and 'customers' (id, name, email, signup_date). " +
    "Status values: completed, cancelled, refunded. " +
    "Categories: Electronics, Clothing, Home, Sports, Food. " +
    "Regions: North, South, East, West. " +
    "Date range: 2025-05-01 to 2026-04-30. Dates are ISO format strings (YYYY-MM-DD).",
  parameters: z.object({
    query: z.string().describe("A SELECT SQL query. Only SELECT statements are allowed."),
  }),
  execute: async ({ query }) => {
    const trimmed = query.trim().replace(/;$/, "");
    if (!/^SELECT/i.test(trimmed)) {
      return { error: "Only SELECT queries are allowed.", rows: [], rowCount: 0 };
    }

    try {
      const db = getDb();
      const rows = db.prepare(trimmed).all();
      const limited = rows.slice(0, 500);
      return { rows: limited, rowCount: rows.length };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { error: msg, rows: [], rowCount: 0 };
    }
  },
});

export const renderDashboard = tool({
  description:
    "Render a dashboard layout with KPI cards, charts, and insights. " +
    "Call this ONCE after you have gathered all the data you need via executeSql. " +
    "Include 2-4 KPI cards first, then 1-3 charts, an insights paragraph, and suggested follow-up questions. " +
    "If you detected an anomaly and searched for world events, include an 'events' widget with the findings.",
  parameters: DashboardLayoutSchema,
  execute: async (layout) => {
    return layout;
  },
});

export const searchWorldEvents = tool({
  description:
    "Search for real-world news, economic, or political events that may explain a business anomaly. " +
    "Use this when you detect an unusual pattern — a revenue drop or spike >15%, category collapse, " +
    "or sudden shift in cancellations. Search around the dates of the anomaly. " +
    "After getting results, include an 'events' widget in the dashboard.",
  parameters: z.object({
    query: z.string().describe(
      "Search query describing the anomaly and time period, e.g. " +
      "'electronics consumer demand drop April 2026' or 'supply chain disruption Q1 2026'"
    ),
    anomalySummary: z.string().describe(
      "Brief description of the business anomaly, e.g. 'Electronics revenue dropped 83% week of Apr 21'"
    ),
  }),
  execute: async ({ query, anomalySummary }) => {
    const tavilyKey = getTavilyKey();
    if (!tavilyKey) {
      return {
        results: [],
        answer: null,
        anomalySummary,
        error: "Tavily API key not configured. Add it via the setup screen (gear icon).",
      };
    }

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: tavilyKey,
          query,
          search_depth: "basic",
          max_results: 5,
          include_answer: true,
        }),
      });

      if (!res.ok) {
        return { results: [], answer: null, anomalySummary, error: `Tavily error: ${res.status}` };
      }

      const data = await res.json();
      return {
        results: (data.results ?? []).map((r: Record<string, string>) => ({
          title: r.title,
          url: r.url,
          content: r.content?.slice(0, 400),
          publishedDate: r.published_date ?? "",
        })),
        answer: data.answer ?? null,
        anomalySummary,
      };
    } catch (e: unknown) {
      return { results: [], answer: null, anomalySummary, error: String(e) };
    }
  },
});
