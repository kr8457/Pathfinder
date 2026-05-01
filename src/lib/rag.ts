import { supabase } from "./supabase";
import { generateEmbedding } from "./embeddings";
import universitiesData from "@/data/universities.json";
import internshipsData from "@/data/internships.json";

export interface StudentProfile {
  field?: string;
  budget?: string;
  destinations?: string[];
  ielts?: number;
  degree?: string;
  interests?: string[];
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  tuitionPerYear?: number;
  tuition_per_year?: number;
  currency: string;
  ieltsMin?: number;
  ielts_min?: number;
  fields: string[];
  programs: string[];
  ranking: number;
  acceptanceRate?: number;
  acceptance_rate?: number;
  deadline: string;
  website: string;
  scholarships: string[];
  description: string;
  tags: string[];
  similarity?: number;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  location: string;
  country: string;
  duration: string;
  stipend: number;
  currency: string;
  fields: string[];
  skills: string[];
  deadline: string;
  website: string;
  description: string;
  tags: string[];
  similarity?: number;
}

/**
 * Build a search query string from the student profile.
 */
function buildUniversityQuery(profile: StudentProfile): string {
  const parts = [
    profile.field && `student studying ${profile.field}`,
    profile.budget && `budget ${profile.budget}`,
    profile.destinations?.length && `wants to study in ${profile.destinations.join(" or ")}`,
    profile.ielts && `IELTS score ${profile.ielts}`,
    profile.degree && `${profile.degree} program`,
  ].filter(Boolean);

  return parts.join(", ") || "computer science engineering university abroad";
}

function buildInternshipQuery(profile: StudentProfile): string {
  const parts = [
    profile.field && `internship in ${profile.field}`,
    profile.destinations?.length && `in ${profile.destinations.join(" or ")}`,
    profile.interests?.length && `interests: ${profile.interests.join(", ")}`,
  ].filter(Boolean);

  return parts.join(", ") || "software engineering internship abroad";
}

/**
 * Local fallback: filter + score universities against profile
 */
function localMatchUniversities(profile: StudentProfile, count = 3): University[] {
  let results = [...universitiesData] as University[];

  // Filter by destinations if specified
  if (profile.destinations && profile.destinations.length > 0) {
    const dests = profile.destinations.map((d) => d.toLowerCase());
    const filtered = results.filter((u) =>
      dests.some(
        (d) =>
          u.country.toLowerCase().includes(d) ||
          u.city.toLowerCase().includes(d)
      )
    );
    if (filtered.length >= count) results = filtered;
  }

  // Score by field match
  if (profile.field) {
    const field = profile.field.toLowerCase();
    results = results.map((u) => ({
      ...u,
      similarity: u.fields.some((f) => f.toLowerCase().includes(field)) ? 0.9 : 0.5,
    }));
    results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  }

  return results.slice(0, count);
}

/**
 * Local fallback: filter + score internships against profile
 */
function localMatchInternships(profile: StudentProfile, count = 3): Internship[] {
  let results = [...internshipsData] as Internship[];

  // Filter by destinations if specified
  if (profile.destinations && profile.destinations.length > 0) {
    const dests = profile.destinations.map((d) => d.toLowerCase());
    const filtered = results.filter((i) =>
      dests.some(
        (d) =>
          i.country.toLowerCase().includes(d) ||
          i.location.toLowerCase().includes(d)
      )
    );
    if (filtered.length >= count) results = filtered;
  }

  // Score by field match
  if (profile.field) {
    const field = profile.field.toLowerCase();
    results = results.map((i) => ({
      ...i,
      similarity: i.fields.some((f) => f.toLowerCase().includes(field)) ? 0.9 : 0.5,
    }));
    results.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
  }

  return results.slice(0, count);
}

/**
 * Match universities using Supabase pgvector, falls back to local JSON.
 */
export async function matchUniversities(
  profile: StudentProfile,
  count = 3
): Promise<University[]> {
  if (!supabase) {
    console.log("Supabase not configured, using local fallback for universities.");
    return localMatchUniversities(profile, count);
  }

  try {
    const query = buildUniversityQuery(profile);
    const embedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc("match_universities", {
      query_embedding: embedding,
      match_count: count,
      filter_country: null,
    });

    if (error || !data || data.length === 0) {
      console.warn("Supabase RPC failed or empty, using local fallback:", error?.message);
      return localMatchUniversities(profile, count);
    }

    return data as University[];
  } catch (err) {
    console.error("matchUniversities error, using local fallback:", err);
    return localMatchUniversities(profile, count);
  }
}

/**
 * Match internships using Supabase pgvector, falls back to local JSON.
 */
export async function matchInternships(
  profile: StudentProfile,
  count = 3
): Promise<Internship[]> {
  if (!supabase) {
    console.log("Supabase not configured, using local fallback for internships.");
    return localMatchInternships(profile, count);
  }

  try {
    const query = buildInternshipQuery(profile);
    const embedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc("match_internships", {
      query_embedding: embedding,
      match_count: count,
      filter_country: null,
    });

    if (error || !data || data.length === 0) {
      console.warn("Supabase RPC failed or empty, using local fallback:", error?.message);
      return localMatchInternships(profile, count);
    }

    return data as Internship[];
  } catch (err) {
    console.error("matchInternships error, using local fallback:", err);
    return localMatchInternships(profile, count);
  }
}
