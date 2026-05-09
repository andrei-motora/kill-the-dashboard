import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import { getProvider, getAIKey } from "./config";

export function getModel() {
  const provider = getProvider();
  const key = getAIKey();

  if (provider === "openai") {
    const openai = createOpenAI({ apiKey: key });
    return openai("gpt-4o");
  }

  const anthropic = createAnthropic({ apiKey: key });
  return anthropic("claude-sonnet-4-20250514");
}
