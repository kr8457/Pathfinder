"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Briefcase, MapPin, DollarSign, ExternalLink, Loader2, Plane } from "lucide-react";
import type { University, Internship, StudentProfile } from "@/lib/rag";

export default function ResultsPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);

  const steps = [
    "Analyzing your profile...",
    "Querying vector database...",
    "Ranking university matches...",
    "Finding internship opportunities...",
    "Finalizing recommendations..."
  ];

  useEffect(() => {
    // Simulate complex loading steps for effect
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep((s) => (s < steps.length - 1 ? s + 1 : s));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading, steps.length]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const profileStr = localStorage.getItem("pathfinder_profile");
        if (!profileStr) {
          window.location.href = "/chat";
          return;
        }

        const p = JSON.parse(profileStr);
        setProfile(p);

        const [uniRes, intRes] = await Promise.all([
          fetch("/api/match-universities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
          }),
          fetch("/api/match-internships", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(p),
          })
        ]);

        const uniData = await uniRes.json();
        const intData = await intRes.json();

        setUniversities(uniData.universities || []);
        setInternships(intData.internships || []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setTimeout(() => setLoading(false), 1000); // Wait for steps to finish
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-6">
            <Loader2 size={32} className="animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-6">Finding Your Path...</h2>
          
          <div className="w-full space-y-3">
            {steps.map((step, idx) => (
              <div 
                key={step} 
                className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                  idx < loadingStep ? "text-brand" : 
                  idx === loadingStep ? "text-white" : "text-gray-600"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  idx < loadingStep ? "bg-brand" : 
                  idx === loadingStep ? "bg-white animate-pulse" : "bg-gray-600"
                }`} />
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 pt-24">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="font-bold">Your Results</div>
          </div>
          <div className="flex items-center gap-3">
            {profile?.field && (
              <div className="hidden md:flex text-sm font-medium text-brand px-3 py-1 bg-brand/10 rounded-full">
                Matched for: {profile.field}
              </div>
            )}
            <Link 
              href="/visa-roadmap"
              className="flex items-center gap-2 text-sm font-bold bg-brand text-black px-4 py-2 rounded-lg hover:bg-brand-dark transition-all shadow-lg shadow-brand/20"
            >
              <Plane size={16} />
              Visa Roadmap
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 mt-6">
        
        {/* Universities Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-brand/10 text-brand flex items-center justify-center">
              <GraduationCap size={24} />
            </div>
            <h2 className="text-3xl font-bold">Top Universities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni, i) => (
              <div key={uni.id} className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-brand/30 transition-colors relative overflow-hidden group">
                {/* Match indicator */}
                <div className="absolute top-0 right-0 bg-brand text-black text-xs font-bold px-3 py-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Match {i + 1}
                </div>

                <h3 className="text-xl font-bold mb-2 pr-16">{uni.name}</h3>
                
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                  <MapPin size={14} />
                  {uni.city}, {uni.country}
                </div>

                <div className="space-y-3 mb-6 flex-1 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-brand" />
                    <span>Tuition: {uni.tuitionPerYear === 0 || uni.tuition_per_year === 0 ? "Free / Fully Funded" : `${uni.tuitionPerYear || uni.tuition_per_year} ${uni.currency}/yr`}</span>
                  </div>
                  <p className="line-clamp-3">{uni.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {uni.tags.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-1 bg-background border border-border rounded text-xs text-gray-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <a 
                  href={uni.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2 rounded bg-border hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                >
                  View University <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Internships Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded bg-brand/10 text-brand flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <h2 className="text-3xl font-bold">Recommended Internships</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((intern, i) => (
              <div key={intern.id} className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-brand/30 transition-colors relative overflow-hidden group">
                {/* Match indicator */}
                <div className="absolute top-0 right-0 bg-brand text-black text-xs font-bold px-3 py-1 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  Match {i + 1}
                </div>

                <div className="text-xs text-brand font-bold mb-1 uppercase tracking-wider">{intern.company}</div>
                <h3 className="text-xl font-bold mb-2 pr-16 leading-tight">{intern.role}</h3>
                
                <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                  <MapPin size={14} />
                  {intern.location}
                </div>

                <div className="space-y-3 mb-6 flex-1 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-brand" />
                    <span>Stipend: {intern.stipend} {intern.currency} / mo</span>
                  </div>
                  <p className="line-clamp-3">{intern.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {intern.tags.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-1 bg-background border border-border rounded text-xs text-gray-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <a 
                  href={intern.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2 rounded bg-brand text-black hover:bg-brand-dark transition-colors flex items-center justify-center gap-2 text-sm font-bold"
                >
                  Apply Now <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
