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
  console.log("Testing NVIDIA/DeepSeek API...");
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-flash",
      messages: [{ role: "user", content: "Hello! This is a test. Reply with 'Success' if you receive this." }],
      temperature: 0.7,
      max_tokens: 100,
      stream: false
    });

    const content = completion.choices[0]?.message?.content || 'No response';
    console.log("\n--- Response ---");
    console.log(content);
    console.log("----------------\n");
    console.log("Test successful!");
  } catch (error: any) {
    console.error("Error testing API:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

main();
