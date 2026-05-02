import OpenAI from "openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL,
    });

    const { messages } = await req.json();

    const systemPrompt = `You are PathFinder AI, a highly efficient placement advisor for Pakistani students.
Your goal is to extract a student profile and then trigger program search only after the profile is complete enough.

CRITICAL RULES:
1. If the user mentions both a field (e.g., CS) and a destination (e.g., Germany), you MUST output the <profile> block immediately.
2. If the user gives only a field or only a destination, ask a single clarifying question to collect the missing detail.
3. If the user asks a general question without enough profile data, do NOT search yet. Ask for field and destination first.
4. Do NOT ask for IELTS, budget, or degree unless you need one of them to complete the profile after field and destination are known.
5. Your response should be short when asking for clarification, and short when creating a profile.
6. DO NOT explain your reasoning. Just answer clearly or ask for the missing info.
7. You MUST wrap the JSON profile in <profile>...</profile> tags. This is the only way the app can trigger the research phase.

Required JSON fields:
{
  "field": "string",
  "budget": "string (optional, default: 'unknown')",
  "destinations": ["string"],
  "ielts": number (optional),
  "degree": "string (optional, default: 'Masters')"
}

Examples:
User: "I want to study AI in Germany."
Assistant: "Great! Finding AI programs in Germany for you... <profile>{\"field\":\"AI\",\"destinations\":[\"Germany\"],\"degree\":\"Masters\"}</profile>"

User: "I want to study in Germany."
Assistant: "Which field are you interested in?"

User: "I want to study AI." 
Assistant: "Which destination or country would you like?"`;

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
