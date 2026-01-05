import OpenAI from "openai";

// Lazy-loaded OpenRouter client
let _openrouter: OpenAI | null = null;

export function getOpenRouter(): OpenAI {
  if (!_openrouter) {
    _openrouter = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
  return _openrouter;
}

// Popular models available on OpenRouter
export const models = {
  // Anthropic
  claude4Opus: "anthropic/claude-opus-4",
  claude4Sonnet: "anthropic/claude-sonnet-4",
  claudeHaiku: "anthropic/claude-3.5-haiku",
  // OpenAI
  gpt4o: "openai/gpt-4o",
  gpt4oMini: "openai/gpt-4o-mini",
  o1: "openai/o1",
  o1Mini: "openai/o1-mini",
  // Google
  gemini2Flash: "google/gemini-2.0-flash-001",
  geminiPro: "google/gemini-pro-1.5",
  // Open source
  llama33: "meta-llama/llama-3.3-70b-instruct",
  deepseekChat: "deepseek/deepseek-chat",
  qwen25: "qwen/qwen-2.5-72b-instruct",
} as const;

export type ModelId = (typeof models)[keyof typeof models];

// Default model for general use
export const defaultModel = models.claude4Sonnet;
