import { tool } from "ai";
import { z } from "zod";
import { getDb } from "./db";
import { DashboardLayoutSchema } from "./schema";

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
    "Include 2-4 KPI cards first, then 1-3 charts, an insights paragraph, and suggested follow-up questions.",
  parameters: DashboardLayoutSchema,
  execute: async (layout) => {
    return layout;
  },
});
