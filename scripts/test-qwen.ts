import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.NVIDIA_API_KEY;
const baseURL = process.env.NVIDIA_BASE_URL;

if (!apiKey) {
  console.error("Missing NVIDIA_API_KEY in .env.local");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

async function main() {
  console.log("Testing NVIDIA/Qwen Thinking API (Streaming)...");
  try {
    const completion = await openai.chat.completions.create({
      model: "qwen/qwen3-next-80b-a3b-thinking",
      messages: [{ role: "user", content: "hi i want to study cs at bs level suggest me a career path " }],
      temperature: 0.6,
      top_p: 0.7,
      max_tokens: 4096,
      stream: true
    });

    console.log("\n--- Response ---");
    for await (const chunk of completion) {
      // @ts-ignore - reasoning_content is a custom delta field
      const reasoning = chunk.choices[0]?.delta?.reasoning_content;
      if (reasoning) {
        process.stdout.write(`[THINKING] ${reasoning}`);
      }
      const content = chunk.choices[0]?.delta?.content || '';
      process.stdout.write(content);
    }
    console.log("\n----------------\n");
    console.log("Test complete!");
  } catch (error: any) {
    console.error("Error testing API:", error.message);
  }
}

main();
