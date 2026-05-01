-- Clean slate
DROP FUNCTION IF EXISTS match_universities(vector, int, text);
DROP FUNCTION IF EXISTS match_internships(vector, int, text);
DROP TABLE IF EXISTS universities;
DROP TABLE IF EXISTS internships;

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Universities table
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  tuition_per_year NUMERIC,
  currency TEXT,
  ielts_min NUMERIC,
  fields TEXT[],
  programs TEXT[],
  ranking INTEGER,
  acceptance_rate NUMERIC,
  deadline TEXT,
  website TEXT,
  scholarships TEXT[],
  description TEXT,
  tags TEXT[],
  embedding vector(3072),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  country TEXT NOT NULL,
  duration TEXT,
  stipend NUMERIC,
  currency TEXT,
  fields TEXT[],
  skills TEXT[],
  deadline TEXT,
  website TEXT,
  description TEXT,
  tags TEXT[],
  embedding vector(3072),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RPC function: match_universities
CREATE OR REPLACE FUNCTION match_universities(
  query_embedding vector(3072),
  match_count INT DEFAULT 5,
  filter_country TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  country TEXT,
  city TEXT,
  tuition_per_year NUMERIC,
  currency TEXT,
  ielts_min NUMERIC,
  fields TEXT[],
  programs TEXT[],
  ranking INTEGER,
  acceptance_rate NUMERIC,
  deadline TEXT,
  website TEXT,
  scholarships TEXT[],
  description TEXT,
  tags TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.name,
    u.country,
    u.city,
    u.tuition_per_year,
    u.currency,
    u.ielts_min,
    u.fields,
    u.programs,
    u.ranking,
    u.acceptance_rate,
    u.deadline,
    u.website,
    u.scholarships,
    u.description,
    u.tags,
    1 - (u.embedding <=> query_embedding) AS similarity
  FROM universities u
  WHERE
    (filter_country IS NULL OR u.country ILIKE filter_country)
    AND u.embedding IS NOT NULL
  ORDER BY u.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- RPC function: match_internships
CREATE OR REPLACE FUNCTION match_internships(
  query_embedding vector(3072),
  match_count INT DEFAULT 5,
  filter_country TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  company TEXT,
  role TEXT,
  location TEXT,
  country TEXT,
  duration TEXT,
  stipend NUMERIC,
  currency TEXT,
  fields TEXT[],
  skills TEXT[],
  deadline TEXT,
  website TEXT,
  description TEXT,
  tags TEXT[],
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    i.id,
    i.company,
    i.role,
    i.location,
    i.country,
    i.duration,
    i.stipend,
    i.currency,
    i.fields,
    i.skills,
    i.deadline,
    i.website,
    i.description,
    i.tags,
    1 - (i.embedding <=> query_embedding) AS similarity
  FROM internships i
  WHERE
    (filter_country IS NULL OR i.country ILIKE filter_country)
    AND i.embedding IS NOT NULL
  ORDER BY i.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
