"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, TrendingUp, DollarSign } from "lucide-react";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Store the initial query in session storage so the chat page can pick it up
    sessionStorage.setItem("pathfinder_initial_query", query);
    router.push("/chat");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="w-full p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-black font-bold">
            PF
          </div>
          <span className="text-xl font-bold tracking-tight">PathFinder AI</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 max-w-5xl mx-auto mt-12 mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border/50 border border-border text-sm mb-8 text-gray-300">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          Powered by Gemini AI & Vector Search
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Your Bridge to <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-dark">
            Global Opportunities
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
          Stop paying consultancy fees. Our AI extracts your profile and instantly matches you with the best universities and internships abroad.
        </p>

        {/* Real Search Input */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-xl flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="I want to study Computer Science in Germany..."
              className="h-14 w-full bg-card border border-border rounded-lg px-4 text-white placeholder-gray-500 outline-none focus:border-brand/50 transition-colors shadow-2xl shadow-brand/5"
            />
          </div>
          <button 
            type="submit"
            className="h-14 px-8 rounded-lg bg-brand hover:bg-brand-dark text-black font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_30px_rgba(0,255,102,0.5)]"
          >
            Find Matches
            <ArrowRight size={18} />
          </button>
        </form>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-card/30 backdrop-blur-sm z-10 mt-auto py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-4 text-brand">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-4xl font-black mb-2">101%</h3>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Pakistan-Canada Growth</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-4 text-brand">
              <DollarSign size={24} />
            </div>
            <h3 className="text-4xl font-black mb-2">PKR 0</h3>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Consultancy Cost</p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border hover:border-brand/30 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mb-4 text-brand">
              <Globe size={24} />
            </div>
            <h3 className="text-4xl font-black mb-2">$530M</h3>
            <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">Agency Fees Bypassed</p>
          </div>

        </div>
      </section>
    </main>
  );
}
