import { NextRequest } from "next/server";
import { isConfigured, getTavilyKey, getProvider, saveConfig } from "@/lib/config";

export async function GET() {
  return Response.json({
    configured: isConfigured(),
    provider: getProvider(),
    hasTavily: !!getTavilyKey(),
  });
}

export async function POST(req: NextRequest) {
  const { provider, apiKey, tavilyKey } = await req.json();
  const update: Record<string, string> = {};
  if (provider) update.provider = provider;
  if (apiKey) {
    update[provider === "openai" ? "openaiKey" : "anthropicKey"] = apiKey;
  }
  if (tavilyKey) update.tavilyKey = tavilyKey;
  saveConfig(update);
  return Response.json({ ok: true });
}
