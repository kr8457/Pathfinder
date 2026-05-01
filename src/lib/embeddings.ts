import { GoogleGenerativeAI } from "@google/generative-ai";

const MOCK_VECTOR_SIZE = 3072;

/**
 * Generate a real embedding from Gemini text-embedding-004.
 * Falls back to a deterministic mock vector if API key is missing or request fails.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_GENERATIVE_AI_API_KEY not set. Using mock embedding.");
    return generateMockEmbedding(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("Embedding API error, using mock:", error);
    return generateMockEmbedding(text);
  }
}

/**
 * Deterministic mock embedding based on character codes.
 * Ensures the same text always produces the same vector for consistency.
 */
function generateMockEmbedding(text: string): number[] {
  const vector = new Array(MOCK_VECTOR_SIZE).fill(0);
  for (let i = 0; i < text.length; i++) {
    const idx = (text.charCodeAt(i) * (i + 1)) % MOCK_VECTOR_SIZE;
    vector[idx] = (vector[idx] + text.charCodeAt(i) / 127) % 1;
  }
  // Normalize to unit vector
  const magnitude = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vector.map((v) => v / magnitude);
}
