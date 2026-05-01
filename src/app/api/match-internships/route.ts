import { NextResponse } from "next/server";
import { matchInternships } from "@/lib/rag";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const profile = await req.json();
    const internships = await matchInternships(profile);
    return NextResponse.json({ internships });
  } catch (error) {
    console.error("Match internships error:", error);
    return NextResponse.json({ error: "Failed to match internships" }, { status: 500 });
  }
}
