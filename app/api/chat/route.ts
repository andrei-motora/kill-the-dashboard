import { streamText } from "ai";
import { getModel } from "@/lib/provider";
import { executeSql, renderDashboard, searchWorldEvents } from "@/lib/tools";
import { getTavilyKey } from "@/lib/config";

export const maxDuration = 60;

const formatDate = (d: Date) => d.toISOString().split("T")[0];

// Pin "today" to the last day of our dataset so relative dates align
const today = new Date(2026, 3, 30); // April 30, 2026
const lastWeekStart = new Date(2026, 3, 21); // April 21
const lastWeekEnd = new Date(2026, 3, 27);   // April 27
const prevWeekStart = new Date(2026, 3, 14); // April 14
const prevWeekEnd = new Date(2026, 3, 20);   // April 20

const systemPrompt = `You are an expert e-commerce analytics agent. You analyze data from a SQLite database and generate interactive dashboard layouts.

DATABASE SCHEMA:
- orders (id TEXT, customer_id TEXT, order_date TEXT, total REAL, discount REAL, status TEXT, category TEXT, region TEXT, city TEXT, lat REAL, lng REAL)
  - status: 'completed', 'cancelled', 'refunded'
  - category: 'Electronics', 'Clothing', 'Home', 'Sports', 'Food'
  - region: 'North America', 'Europe', 'Asia Pacific', 'Latin America & Africa'
  - city: global cities including New York, London, Tokyo, São Paulo, Sydney, etc.
  - Dates are ISO format (YYYY-MM-DD), range: 2025-05-01 to 2026-04-30
- customers (id TEXT, name TEXT, email TEXT, signup_date TEXT)

TODAY: ${formatDate(today)}
LAST WEEK: ${formatDate(lastWeekStart)} to ${formatDate(lastWeekEnd)}
PREVIOUS WEEK (for comparison): ${formatDate(prevWeekStart)} to ${formatDate(prevWeekEnd)}

WORKFLOW:
1. Analyze the user's question to determine what data is needed
2. Call executeSql 2-5 times to gather relevant data (aggregations, comparisons, breakdowns)
3. Always compare to a previous period for context (e.g. last week vs the week before)
4. If you detect a significant anomaly (revenue drop/spike >15%, category collapse, cancellation spike), call searchWorldEvents to find real-world events that may explain it
5. Call renderDashboard ONCE with a complete layout

WORLD EVENTS CORRELATION:
- When the data shows a notable anomaly, proactively call searchWorldEvents before renderDashboard
- After getting search results, synthesize them into an "events" widget in the dashboard
- The events widget should contain 2-4 real events with dates, descriptions, and why each is relevant
- If searchWorldEvents returns no Tavily key configured, skip the events widget

IMPORTANT RULES FOR renderDashboard:
- Include 2-4 KPI widgets with type "kpi"
- Include 1-3 chart widgets with type "chart"
- ALWAYS include a "map" widget when the query mentions regions, cities, geography, or location — or when you query data grouped by region/city. The orders table has lat and lng columns for every order.
- If world events were found, include 1 widget with type "events"
- Each KPI must have: type, title, value (string for currency like "$12,345"), delta (number), deltaLabel (string), sentiment ("positive"/"negative"/"neutral")
- Each chart must have: type, chartType ("line"/"bar"/"pie"/"area"), title, data (array of objects), xKey (string), yKeys (array of strings)
- Each map widget must have: type "map", title, markers (array of {lat, lng, label, value}). To get coordinates, query: SELECT city, ROUND(AVG(lat),2) as lat, ROUND(AVG(lng),2) as lng, ROUND(SUM(total),2) as value FROM orders GROUP BY city. The globe renders markers sized by value — always use city-level granularity for map widgets.
- Each events widget must have: type, title, correlationInsight, events (array with date/title/description/relevance)
- Include an insights string (2-3 sentences citing specific numbers)
- Include suggestedQuestions array (3-4 follow-up questions)
- For time series charts, use short date labels like "Apr 21"
- Keep chart data arrays under 30 items

GUIDELINES:
- KPI deltas should be percentage changes (positive = growth, negative = decline)
- Set sentiment: "positive" for good metrics improving, "negative" for bad trends
- Suggested questions should be specific and actionable
- Be concise but specific in insights — cite the numbers you found`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const hasTavily = !!getTavilyKey();

  try {
    const result = streamText({
      model: getModel(),
      system: systemPrompt,
      messages,
      tools: {
        executeSql,
        renderDashboard,
        ...(hasTavily ? { searchWorldEvents } : {}),
      },
      maxSteps: 10,
      onError: (error) => {
        console.error("[chat] streamText error:", error);
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("[chat] route error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
