import { z } from "zod";

export const KPIWidgetSchema = z.object({
  type: z.literal("kpi"),
  title: z.string().describe("Short label for the metric"),
  value: z.union([z.string(), z.number()]).describe("The main metric value, formatted as string if currency"),
  delta: z.number().optional().describe("Percentage change vs comparison period"),
  deltaLabel: z.string().optional().describe("e.g. 'vs last week'"),
  sentiment: z.enum(["positive", "negative", "neutral"]).optional(),
});

const ChartDataPoint = z.record(z.union([z.string(), z.number(), z.null()]));

export const ChartWidgetSchema = z.object({
  type: z.literal("chart"),
  chartType: z.enum(["line", "bar", "pie", "area"]).describe("Pick the best chart type for the data"),
  title: z.string(),
  data: z.array(ChartDataPoint).describe("Array of data point objects, each with keys matching xKey and yKeys"),
  xKey: z.string().describe("Key in data objects for the x-axis"),
  yKeys: z.array(z.string()).describe("Keys in data objects for y-axis values"),
  colors: z.array(z.string()).optional().describe("Hex colors for each yKey"),
});

export const MapWidgetSchema = z.object({
  type: z.literal("map"),
  title: z.string(),
  markers: z.array(
    z.object({
      lat: z.number(),
      lng: z.number(),
      label: z.string(),
      value: z.number(),
    })
  ),
});

export const EventsWidgetSchema = z.object({
  type: z.literal("events"),
  title: z.string(),
  correlationInsight: z.string().describe("1-2 sentences explaining how these events connect to the business anomaly"),
  events: z.array(
    z.object({
      date: z.string().describe("Date or date range of the event, e.g. 'Apr 2026' or 'Q1 2026'"),
      title: z.string().describe("Short headline for the event"),
      description: z.string().describe("2-3 sentence summary of the event"),
      relevance: z.string().describe("1 sentence explaining why this event matters to the metric"),
    })
  ).max(5),
});

export const WidgetSchema = z.discriminatedUnion("type", [
  KPIWidgetSchema,
  ChartWidgetSchema,
  MapWidgetSchema,
  EventsWidgetSchema,
]);

export const DashboardLayoutSchema = z.object({
  title: z.string().describe("Dashboard title summarizing what's shown"),
  insights: z.string().describe("2-3 sentence narrative explaining the key findings, citing specific numbers"),
  widgets: z.array(WidgetSchema).describe("2-6 widgets: start with KPI cards, then charts"),
  suggestedQuestions: z.array(z.string()).max(4).describe("Follow-up questions to drill deeper"),
});

export type DashboardLayout = z.infer<typeof DashboardLayoutSchema>;
export type Widget = z.infer<typeof WidgetSchema>;
export type KPIWidget = z.infer<typeof KPIWidgetSchema>;
export type ChartWidget = z.infer<typeof ChartWidgetSchema>;
export type MapWidget = z.infer<typeof MapWidgetSchema>;
export type EventsWidget = z.infer<typeof EventsWidgetSchema>;
