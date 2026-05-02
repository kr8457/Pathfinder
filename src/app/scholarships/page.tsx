"use client";

import { useState } from "react";
import { ExternalLink, Award, Calendar, Globe, BookOpen, Search, Filter } from "lucide-react";
import scholarshipsData from "@/data/scholarships.json";

const ALL_COUNTRIES = ["All", "Germany", "Europe (Multiple)", "Turkey", "Italy", "Canada", "United Kingdom"];
const ALL_DEGREES = ["All", "Bachelors", "Masters", "PhD"];

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedDegree, setSelectedDegree] = useState("All");

  const filtered = scholarshipsData.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === "All" || s.country === selectedCountry;
    const matchesDegree = selectedDegree === "All" || s.degree.includes(selectedDegree);
    return matchesSearch && matchesCountry && matchesDegree;
  });

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-4">
            <Award size={14} /> Free Money Awaits
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Scholarship Finder</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Curated scholarships for Pakistani students going abroad. From DAAD to Chevening — find your funding.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scholarships..."
              className="w-full h-12 bg-card border border-border rounded-2xl pl-12 pr-4 text-white outline-none focus:border-brand/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          </div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="h-12 bg-card border border-border rounded-2xl px-4 text-white outline-none focus:border-brand/50 transition-all"
          >
            {ALL_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="h-12 bg-card border border-border rounded-2xl px-4 text-white outline-none focus:border-brand/50 transition-all"
          >
            {ALL_DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <p className="text-gray-500 text-sm mb-6">{filtered.length} scholarships found</p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="group bg-card border border-border rounded-3xl p-6 hover:border-brand/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand/5 flex flex-col"
            >
              {/* Top gradient bar */}
              <div className={`h-1 w-full rounded-full bg-gradient-to-r ${s.color} mb-6`} />

              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand shrink-0">
                  <Award size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-black uppercase">
                  {s.amount}
                </span>
              </div>

              <h3 className="text-xl font-black mb-1 group-hover:text-brand transition-colors">{s.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-4">{s.provider}</p>

              <p className="text-gray-300 text-sm leading-relaxed mb-5 flex-1">{s.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <Globe size={14} className="text-brand" />
                  {s.country}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <BookOpen size={14} className="text-brand" />
                  {s.degree.join(", ")}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar size={14} className="text-brand" />
                  {s.deadline}
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Award size={14} className="text-brand" />
                  IELTS: {s.ieltsMin === 0 ? "Not Required" : `${s.ieltsMin}+`}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {s.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md bg-border/50 text-[10px] text-gray-400 uppercase font-bold">
                    {tag}
                  </span>
                ))}
              </div>

              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 rounded-xl bg-brand text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all group/btn"
              >
                Apply Now
                <ExternalLink size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
              </a>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No scholarships match your filters. Try adjusting them!</p>
          </div>
        )}
      </div>
    </main>
  );
}
