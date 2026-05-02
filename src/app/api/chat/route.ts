import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are PathFinder AI, a highly efficient placement advisor for Pakistani students.
Your goal is to extract the student's profile and show results as FAST as possible.

CRITICAL RULES:
1. If the user mentions a field (e.g., CS) and a destination (e.g., Germany), you MUST output the <profile> block IMMEDIATELY.
2. Do NOT ask for IELTS, Budget, or Degree if they haven't provided it yet—only ask for them IF you have absolutely no idea what they want.
3. Your response should be EXTREMELY short (max 2 sentences): "Excellent choice! Finding programs for you..." followed by the <profile> block.
4. DO NOT explain your reasoning. Just output the response and the tag.
5. You MUST wrap the JSON profile in <profile>...</profile> tags. This is the only way the app can trigger the research phase.

Required JSON fields:
{
  "field": "string",
  "budget": "string (optional, default: 'unknown')",
  "destinations": ["string"],
  "ielts": number (optional),
  "degree": "string (optional, default: 'Masters')"
}

Example:
User: "I want to study AI in Germany."
Assistant: "Great! Finding AI programs in Germany for you... <profile>{\"field\":\"AI\",\"destinations\":[\"Germany\"],\"degree\":\"Masters\"}</profile>"`;

    if (!process.env.NVIDIA_API_KEY) {
      console.error("NVIDIA_API_KEY is missing in environment variables");
      return new Response("AI configuration missing", { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: "qwen/qwen3-next-80b-a3b-thinking",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.6,
      top_p: 0.7,
      max_tokens: 4096,
    });

    // Create a standard ReadableStream from the OpenAI response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            // Only include the final content, skip internal reasoning to keep responses short
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
    
    // Return a standard streaming response
    return new Response(stream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked"
      },
    });
  } catch (error: any) {
    console.error("Chat API Error:", error.message || error);
    return new Response(JSON.stringify({ error: error.message || "Error processing request" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
