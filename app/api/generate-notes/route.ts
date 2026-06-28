import { NOTES_SYSTEM_PROMPT, buildNotesUserPrompt } from "@/lib/prompts";
import { streamChat } from "@/lib/ollama";

export async function POST(request: Request) {
  let body: { transcript?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const transcript = body.transcript?.trim();
  if (!transcript) {
    return Response.json({ error: "Please record some speech first." }, { status: 400 });
  }

  try {
    const readable = await streamChat([
      { role: "system", content: NOTES_SYSTEM_PROMPT },
      { role: "user", content: buildNotesUserPrompt(transcript) },
    ]);

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (ollamaError) {
    const message =
      ollamaError instanceof Error ? ollamaError.message : "Unknown error";

    const isConnectionError =
      message.includes("ECONNREFUSED") || message.includes("fetch failed");

    if (isConnectionError) {
      return Response.json(
        {
          error:
            "Cannot connect to Ollama. Make sure Ollama is running (ollama serve) and the mistral model is pulled (ollama pull mistral).",
        },
        { status: 503 }
      );
    }

    return Response.json(
      { error: "Note generation failed. Please try again." },
      { status: 500 }
    );
  }
}
