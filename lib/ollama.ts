const OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_MODEL = "mistral";

interface OllamaChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaStreamChunk {
  message?: { content: string };
  done: boolean;
}

export async function streamChat(
  messages: OllamaChatMessage[]
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error (${response.status}): ${errorText}`);
  }

  const ollamaBody = response.body;
  if (!ollamaBody) {
    throw new Error("No response body from Ollama");
  }

  const reader = ollamaBody.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();

      if (done) {
        controller.close();
        return;
      }

      const text = decoder.decode(value, { stream: true });
      const lines = text.split("\n").filter(Boolean);

      for (const line of lines) {
        try {
          const chunk: OllamaStreamChunk = JSON.parse(line);
          if (chunk.message?.content) {
            controller.enqueue(encoder.encode(chunk.message.content));
          }
          if (chunk.done) {
            controller.close();
            return;
          }
        } catch {
          // partial JSON line — skip
        }
      }
    },
  });
}
