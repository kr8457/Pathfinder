import OpenAI from "openai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL,
    });

    const { messages } = await req.json();

    const systemPrompt = `You are the PathFinder AI Career Consultant, an expert in global job markets, higher education, and career strategy for international students.
Your goal is to provide deep, strategic career advice. 

When a student asks for advice:
1. Analyze their field and goals.
2. Provide a 3-step "Success Roadmap".
3. Suggest specific skills they should learn.
4. Mention top companies or sectors they should target.

Always structure your response with clear headings and a professional, encouraging tone.
Format the roadmap clearly so it looks good in a web UI.`;

    const response = await openai.chat.completions.create({
      model: "qwen/qwen3-next-80b-a3b-thinking",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.6,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) controller.enqueue(encoder.encode(content));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
    
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
