import { streamText } from "ai";
import { google } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `You are PathFinder AI, a helpful and friendly placement advisor for Pakistani students looking to study and intern abroad.
Your goal is to extract the student's profile information through conversation.
Ask questions to determine:
- Field of study (e.g., Computer Science, Engineering, Business)
- Budget or tuition expectations (e.g., free, <$5000, scholarships only)
- Desired destinations (e.g., Germany, Italy, Turkey, Canada, UK)
- IELTS score (if any)
- Degree level (e.g., Bachelors, Masters)

Be conversational. If the user provides all or most of the required information (Field, Budget, and Destination) in their first message, you should output the <profile> block IMMEDIATELY. 
Only ask questions if critical information is missing. You do NOT need all details (like IELTS) before showing initial results.

Once you have enough information to make a recommendation, you MUST output a JSON block wrapped in <profile>...</profile> tags. 
DO NOT output the profile tag until you are ready to show results.

Example output when ready:
Great! I have enough information. Let me find the best options for you.
<profile>
{
  "field": "Computer Science",
  "budget": "Free tuition or scholarships",
  "destinations": ["Germany", "Italy"],
  "ielts": 6.5,
  "degree": "Masters"
}
</profile>`;

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables");
      return new Response("AI configuration missing", { status: 500 });
    }

    const result = streamText({
      model: google("gemini-flash-lite-latest"),
      messages,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error("Chat API Error:", error.message || error);
    return new Response(JSON.stringify({ error: error.message || "Error processing request" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
