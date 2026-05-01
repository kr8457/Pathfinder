import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
  console.error("Missing environment variables. Please check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiKey);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getEmbedding(text: string, retryCount = 0): Promise<number[]> {
  const MAX_RETRIES = 5;
  const BASE_DELAY = 2000; // 2 seconds

  try {
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error: any) {
    // Check for 429 (Too Many Requests)
    if (error?.status === 429 || error?.message?.includes("429") || error?.message?.includes("Too Many Requests")) {
      if (retryCount < MAX_RETRIES) {
        const delay = BASE_DELAY * Math.pow(2, retryCount);
        console.warn(`Rate limit hit (429). Retrying in ${delay / 1000}s... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await sleep(delay);
        return getEmbedding(text, retryCount + 1);
      }
    }
    
    console.error("Error generating embedding:", error);
    throw error;
  }
}

async function ingestUniversities() {
  console.log("Ingesting universities...");
  const dataPath = path.resolve(process.cwd(), "src/data/universities.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  for (const uni of data) {
    if (!uni.name || !uni.id) {
      console.warn(`Skipping invalid entry: ${JSON.stringify(uni)}`);
      continue;
    }

    const textToEmbed = `${uni.name} in ${uni.city}, ${uni.country}. Fields: ${uni.fields?.join(", ") || ""}. Programs: ${uni.programs?.join(", ") || ""}. Tags: ${uni.tags?.join(", ") || ""}. Description: ${uni.description || ""}`;
    
    console.log(`[Processing] Uni: ${uni.name} (ID: ${uni.id})`);
    
    try {
      const embedding = await getEmbedding(textToEmbed);

      const { error } = await supabase.from("universities").upsert({
        id: uni.id,
        name: uni.name,
        country: uni.country,
        city: uni.city,
        tuition_per_year: uni.tuitionPerYear,
        currency: uni.currency,
        ielts_min: uni.ieltsMin,
        fields: uni.fields,
        programs: uni.programs,
        ranking: uni.ranking,
        acceptance_rate: uni.acceptanceRate,
        deadline: uni.deadline,
        website: uni.website,
        scholarships: uni.scholarships,
        description: uni.description,
        tags: uni.tags,
        embedding
      });

      if (error) {
        console.error(`Failed to upsert ${uni.name}:`, error.message);
      }
      
      // Wait 4 seconds between requests to stay under 15 RPM limit
      await sleep(4000);
    } catch (err) {
      console.error(`Skipping ${uni.name} due to repeated errors.`);
    }
  }
  console.log("Universities ingested successfully.\n");
}

async function ingestInternships() {
  console.log("Ingesting internships...");
  const dataPath = path.resolve(process.cwd(), "src/data/internships.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  for (const intern of data) {
    if (!intern.company || !intern.id) {
      console.warn(`Skipping invalid entry: ${JSON.stringify(intern)}`);
      continue;
    }

    const textToEmbed = `${intern.role} at ${intern.company} in ${intern.location}, ${intern.country}. Fields: ${intern.fields?.join(", ") || ""}. Skills: ${intern.skills?.join(", ") || ""}. Tags: ${intern.tags?.join(", ") || ""}. Description: ${intern.description || ""}`;
    
    console.log(`[Processing] Internship: ${intern.company} - ${intern.role} (ID: ${intern.id})`);
    
    try {
      const embedding = await getEmbedding(textToEmbed);

      const { error } = await supabase.from("internships").upsert({
        id: intern.id,
        company: intern.company,
        role: intern.role,
        location: intern.location,
        country: intern.country,
        duration: intern.duration,
        stipend: intern.stipend,
        currency: intern.currency,
        fields: intern.fields,
        skills: intern.skills,
        deadline: intern.deadline,
        website: intern.website,
        description: intern.description,
        tags: intern.tags,
        embedding
      });

      if (error) {
        console.error(`Failed to upsert ${intern.company}:`, error.message);
      }

      // Wait 4 seconds between requests
      await sleep(4000);
    } catch (err) {
      console.error(`Skipping ${intern.company} due to repeated errors.`);
    }
  }
  console.log("Internships ingested successfully.\n");
}

async function main() {
  try {
    await ingestUniversities();
    await ingestInternships();
    console.log("Ingestion complete!");
  } catch (error) {
    console.error("Ingestion failed:", error);
  }
}

main();
