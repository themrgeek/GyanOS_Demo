import { MBTI_ANALYSIS_SYSTEM_PROMPT, buildMbtiAnalysisPrompt } from "@/lib/prompts";
import { streamChat } from "@/lib/ollama";

interface MbtiRequestBody {
  mbtiType?: string;
  dimensions?: {
    EI: { label: string; percentage: number };
    SN: { label: string; percentage: number };
    TF: { label: string; percentage: number };
    JP: { label: string; percentage: number };
  };
}

export async function POST(request: Request) {
  let body: MbtiRequestBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.mbtiType || !body.dimensions) {
    return Response.json({ error: "MBTI type and dimension scores are required." }, { status: 400 });
  }

  try {
    const readable = await streamChat([
      { role: "system", content: MBTI_ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: buildMbtiAnalysisPrompt(body.mbtiType, body.dimensions) },
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
      { error: "Personality analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
