import { NextResponse } from "next/server";
import { matchUniversities } from "@/lib/rag";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const profile = await req.json();
    const universities = await matchUniversities(profile);
    return NextResponse.json({ universities });
  } catch (error) {
    console.error("Match universities error:", error);
    return NextResponse.json({ error: "Failed to match universities" }, { status: 500 });
  }
}
