import fs from "fs";
import path from "path";

interface KeysConfig {
  provider?: string;
  openaiKey?: string;
  anthropicKey?: string;
  tavilyKey?: string;
}

const KEYS_FILE = path.join(process.cwd(), "data", "keys.json");

function readFile(): KeysConfig {
  try {
    if (fs.existsSync(KEYS_FILE)) {
      return JSON.parse(fs.readFileSync(KEYS_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

export function saveConfig(update: Partial<KeysConfig>): void {
  const existing = readFile();
  const merged = { ...existing, ...update };
  const dir = path.dirname(KEYS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(KEYS_FILE, JSON.stringify(merged, null, 2));
}

export function getProvider(): string {
  const c = readFile();
  return c.provider || process.env.AI_PROVIDER || "anthropic";
}

export function getAIKey(): string | undefined {
  const c = readFile();
  const provider = getProvider();
  if (provider === "openai") return c.openaiKey || process.env.OPENAI_API_KEY;
  return c.anthropicKey || process.env.ANTHROPIC_API_KEY;
}

export function getTavilyKey(): string | undefined {
  const c = readFile();
  return c.tavilyKey || process.env.TAVILY_API_KEY;
}

export function isConfigured(): boolean {
  return !!getAIKey();
}
