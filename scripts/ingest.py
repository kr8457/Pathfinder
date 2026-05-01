import os
import json
import time
import math
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai

# Load environment variables
load_dotenv(dotenv_path=".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
GEMINI_KEY = os.getenv("GOOGLE_GENERATIVE_AI_API_KEY")

if not all([SUPABASE_URL, SUPABASE_KEY, GEMINI_KEY]):
    print("Error: Missing environment variables in .env.local")
    exit(1)

# Initialize clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
genai.configure(api_key=GEMINI_KEY)

def get_embedding(text, retry_count=0):
    MAX_RETRIES = 5
    BASE_DELAY = 2
    
    try:
        # Using Gemini Embedding Model
        result = genai.embed_content(
            model="models/gemini-embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        error_msg = str(e)
        # Check for Rate Limit (429)
        if "429" in error_msg or "Resource has been exhausted" in error_msg:
            if retry_count < MAX_RETRIES:
                delay = BASE_DELAY * (2 ** retry_count)
                print(f"Rate limit hit. Retrying in {delay}s... (Attempt {retry_count+1}/{MAX_RETRIES})")
                time.sleep(delay)
                return get_embedding(text, retry_count + 1)
        
        print(f"Error generating embedding: {e}")
        raise e

def ingest_universities():
    print("\n--- Ingesting Universities ---")
    file_path = "src/data/universities.json"
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for i, uni in enumerate(data):
        name = uni.get("name")
        uid = uni.get("id")
        
        if not name or not uid:
            print(f"Skipping index {i}: Missing name or id")
            continue

        print(f"[{i+1}/{len(data)}] Processing: {name}")
        
        text_to_embed = f"{name} in {uni.get('city')}, {uni.get('country')}. Fields: {', '.join(uni.get('fields', []))}. Description: {uni.get('description')}"
        
        try:
            embedding = get_embedding(text_to_embed)
            
            # Upsert to Supabase
            result = supabase.table("universities").upsert({
                "id": uid,
                "name": name,
                "country": uni.get("country"),
                "city": uni.get("city"),
                "tuition_per_year": uni.get("tuitionPerYear"),
                "currency": uni.get("currency"),
                "ielts_min": uni.get("ieltsMin"),
                "fields": uni.get("fields"),
                "programs": uni.get("programs"),
                "ranking": uni.get("ranking"),
                "acceptance_rate": uni.get("acceptanceRate"),
                "deadline": uni.get("deadline"),
                "website": uni.get("website"),
                "scholarships": uni.get("scholarships"),
                "description": uni.get("description"),
                "tags": uni.get("tags"),
                "embedding": embedding
            }).execute()
            
            # 15 RPM limit = 1 request every 4 seconds
            time.sleep(4.1) 
            
        except Exception as e:
            print(f"Failed to process {name}: {e}")

def ingest_internships():
    print("\n--- Ingesting Internships ---")
    file_path = "src/data/internships.json"
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    for i, intern in enumerate(data):
        company = intern.get("company")
        uid = intern.get("id")
        
        if not company or not uid:
            print(f"Skipping index {i}: Missing company or id")
            continue

        print(f"[{i+1}/{len(data)}] Processing: {company} - {intern.get('role')}")
        
        text_to_embed = f"{intern.get('role')} at {company} in {intern.get('location')}. Skills: {', '.join(intern.get('skills', []))}. Description: {intern.get('description')}"
        
        try:
            embedding = get_embedding(text_to_embed)
            
            supabase.table("internships").upsert({
                "id": uid,
                "company": company,
                "role": intern.get("role"),
                "location": intern.get("location"),
                "country": intern.get("country"),
                "duration": intern.get("duration"),
                "stipend": intern.get("stipend"),
                "currency": intern.get("currency"),
                "fields": intern.get("fields"),
                "skills": intern.get("skills"),
                "deadline": intern.get("deadline"),
                "website": intern.get("website"),
                "description": intern.get("description"),
                "tags": intern.get("tags"),
                "embedding": embedding
            }).execute()
            
            time.sleep(4.1)
            
        except Exception as e:
            print(f"Failed to process {company}: {e}")

if __name__ == "__main__":
    ingest_universities()
    ingest_internships()
    print("\nAll data ingested successfully!")
