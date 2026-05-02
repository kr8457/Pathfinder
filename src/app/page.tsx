"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, TrendingUp, DollarSign, GraduationCap, Briefcase, UserCircle, Award, Star } from "lucide-react";

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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10 max-w-6xl mx-auto mt-24 mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-xs font-bold uppercase tracking-widest mb-8 text-brand">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          The Future of Pakistani Student Success
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          BEYOND THE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-brand-dark to-brand">
            LIMITS.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-12 font-medium">
          Stop paying consultancy fees. PathFinder AI uses <span className="text-white">NVIDIA DeepSeek</span> & <span className="text-white">Gemini RAG</span> to match you with elite universities and global internships.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
          <Link 
            href="/chat"
            className="flex-1 h-16 rounded-2xl bg-brand text-black font-black text-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)]"
          >
            University Search
            <ArrowRight size={20} />
          </Link>
          <Link 
            href="/internships"
            className="flex-1 h-16 rounded-2xl bg-card border border-border text-white font-black text-lg flex items-center justify-center gap-2 hover:bg-border/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Find Internships
            <Briefcase size={20} />
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mb-32 z-10">
        <div className="group bg-card/50 border border-border rounded-3xl p-8 hover:border-brand/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6">
            <GraduationCap size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-3">University RAG</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Our AI analyzes thousands of university programs across Europe and Canada to find your perfect fit.
          </p>
          <Link href="/chat" className="text-brand font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>

        <div className="group bg-card/50 border border-border rounded-3xl p-8 hover:border-brand/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6">
            <Briefcase size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-3">Internship Hub</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Direct access to internships in Berlin, Tokyo, and London. No middlemen, just direct matching.
          </p>
          <Link href="/internships" className="text-brand font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Browse Roles <ArrowRight size={16} />
          </Link>
        </div>

        <div className="group bg-card/50 border border-border rounded-3xl p-8 hover:border-brand/30 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand mb-6">
            <UserCircle size={24} />
          </div>
          <h3 className="text-2xl font-bold mb-3">Career Strategy</h3>
          <p className="text-gray-400 leading-relaxed mb-6">
            Get a personalized roadmap from our AI consultant for post-graduation success abroad.
          </p>
          <Link href="/consultant" className="text-brand font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
            Start Strategy <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-border bg-card/30 backdrop-blur-sm z-10 py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="flex flex-col items-center text-center">
            <h3 className="text-6xl font-black mb-2 text-brand">101%</h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Growth in Migration</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <h3 className="text-6xl font-black mb-2 text-white">PKR 0</h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Consultancy Fees</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <h3 className="text-6xl font-black mb-2 text-brand">$530M</h3>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Total Fees Saved</p>
          </div>

        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-6xl mx-auto px-6 py-24 z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-4">Pakistani Students Who Made It</h2>
          <p className="text-gray-400">Real stories, real success. Verified through PathFinder AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Ahmed Raza", city: "Lahore → Berlin",
              quote: "I never thought free education in Germany was possible for me. PathFinder matched me with TU Berlin's CS program and DAAD covered everything.",
              uni: "TU Berlin", field: "Computer Science", year: "2024"
            },
            {
              name: "Sara Malik", city: "Karachi → Toronto",
              quote: "The visa roadmap feature literally saved me — I had no idea about the GIC requirement before. Got my study permit in 6 weeks!",
              uni: "University of Toronto", field: "Data Science", year: "2024"
            },
            {
              name: "Hassan Siddiqui", city: "Islamabad → Rome",
              quote: "Erasmus Mundus scholarship, free tuition in Italy, and €1000/month stipend. PathFinder found me the Chevening alternative I didn't know existed.",
              uni: "La Sapienza", field: "Architecture", year: "2025"
            },
          ].map((story) => (
            <div key={story.name} className="bg-card border border-border rounded-3xl p-6 hover:border-brand/30 transition-all">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-brand fill-brand" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{story.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black font-black text-sm">
                  {story.name[0]}
                </div>
                <div>
                  <p className="font-bold text-sm">{story.name}</p>
                  <p className="text-xs text-gray-500">{story.city} · {story.uni} · {story.year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
