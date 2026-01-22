import { createServerFn } from "@tanstack/react-start";
import { getOpenRouter, defaultModel } from "./index";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
}

export const chat = createServerFn({ method: "POST" })
  .validator((data: unknown): ChatRequest => {
    const req = data as ChatRequest;
    if (!req.messages || !Array.isArray(req.messages)) {
      throw new Error("Messages array is required");
    }
    return req;
  })
  .handler(async ({ data }) => {
    const { messages, model = defaultModel } = data;

    const response = await getOpenRouter().chat.completions.create({
      model,
      messages,
      stream: false,
    });

    return {
      content: response.choices[0]?.message?.content || "",
    };
  });

// Streaming version - returns chunks
export const chatStream = createServerFn({ method: "POST" })
  .validator((data: unknown): ChatRequest => {
    const req = data as ChatRequest;
    if (!req.messages || !Array.isArray(req.messages)) {
      throw new Error("Messages array is required");
    }
    return req;
  })
  .handler(async ({ data }) => {
    const { messages, model = defaultModel } = data;

    const stream = await getOpenRouter().chat.completions.create({
      model,
      messages,
      stream: true,
    });

    // Collect all chunks for non-streaming response
    let fullContent = "";
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullContent += content;
      }
    }

    return { content: fullContent };
  });
