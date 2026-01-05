import { getOpenRouter, defaultModel, type ModelId } from "./openrouter";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export type Message = ChatCompletionMessageParam;

export interface ChatOptions {
  model?: ModelId;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

// Simple chat completion
export async function chat(
  messages: Message[],
  options: ChatOptions = {}
) {
  const {
    model = defaultModel,
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const response = await getOpenRouter().chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });

  return response.choices[0]?.message?.content ?? "";
}

// Streaming chat completion
export async function chatStream(
  messages: Message[],
  options: Omit<ChatOptions, "stream"> = {}
) {
  const {
    model = defaultModel,
    temperature = 0.7,
    maxTokens = 4096,
  } = options;

  const stream = await getOpenRouter().chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
    stream: true,
  });

  return stream;
}

// Simple text generation helper
export async function generate(
  prompt: string,
  options: ChatOptions = {}
) {
  return chat([{ role: "user", content: prompt }], options);
}
