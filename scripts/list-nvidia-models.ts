import OpenAI from 'openai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const apiKey = process.env.NVIDIA_API_KEY;
const baseURL = process.env.NVIDIA_BASE_URL;

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

async function main() {
  try {
    const models = await openai.models.list();
    console.log("Available Models:");
    models.data.forEach(model => console.log(`- ${model.id}`));
  } catch (error: any) {
    console.error("Error listing models:", error.message);
  }
}

main();
