export interface ThinkingStep {
  id: string;
  label: string;
  status: "active" | "done";
}

interface ToolInvocation {
  toolCallId: string;
  toolName: string;
  state: string;
  args?: Record<string, unknown>;
  result?: unknown;
}

function sqlToLabel(sql: string): string {
  const s = sql.toLowerCase();

  if (/cancel|refund/.test(s)) return "Looking at cancellations and refunds...";
  if (/region|city|lat|lng|geography/.test(s)) return "Checking performance across regions...";
  if (/customer/.test(s) && /top|order by.*desc|rank/.test(s)) return "Finding your top customers...";
  if (/customer/.test(s)) return "Pulling customer data...";
  if (/category/.test(s) && /sum|count|avg/.test(s)) return "Breaking down sales by category...";
  if (/trend|order_date|week|month|day/.test(s) && /revenue|total|sum/.test(s))
    return "Checking how revenue has been trending...";
  if (/order_date|week|month|day/.test(s)) return "Analyzing trends over time...";
  if (/discount/.test(s)) return "Looking at discount patterns...";
  if (/count\s*\(/.test(s) && /status/.test(s)) return "Counting orders by status...";
  if (/sum\s*\(\s*total/.test(s)) return "Adding up the revenue numbers...";
  if (/compare|previous|last.*week|vs/.test(s)) return "Comparing to the previous period...";
  if (/avg|average/.test(s)) return "Calculating averages...";
  if (/group\s+by/.test(s)) return "Breaking down the data...";

  return "Querying your database...";
}

export function extractThinkingSteps(
  messages: Array<{ role: string; toolInvocations?: ToolInvocation[] }>
): ThinkingStep[] {
  const steps: ThinkingStep[] = [];

  for (const msg of messages) {
    if (msg.role !== "assistant" || !msg.toolInvocations) continue;

    for (const inv of msg.toolInvocations) {
      let label: string;

      if (inv.toolName === "executeSql") {
        const query = (inv.args?.query as string) ?? "";
        label = sqlToLabel(query);
      } else if (inv.toolName === "searchWorldEvents") {
        const summary = (inv.args?.anomalySummary as string) ?? "";
        label = summary
          ? `Searching for events related to: ${summary.toLowerCase()}`
          : "Searching for world events that might explain this...";
      } else if (inv.toolName === "renderDashboard") {
        label = "Assembling your dashboard...";
      } else {
        label = "Working on it...";
      }

      steps.push({
        id: inv.toolCallId,
        label,
        status: inv.state === "result" ? "done" : "active",
      });
    }
  }

  return steps;
}
