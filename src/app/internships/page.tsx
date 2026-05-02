"use client";

import { useState, useEffect } from "react";
import { matchInternships, Internship } from "@/lib/rag";
import { Briefcase, MapPin, Calendar, DollarSign, ExternalLink, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadInternships() {
      setLoading(true);
      try {
        // Initially load some internships using a generic query
        const results = await matchInternships({ field: searchQuery || "software engineering" }, 9);
        setInternships(results);
      } catch (error) {
        console.error("Failed to load internships:", error);
      } finally {
        setLoading(false);
      }
    }
    loadInternships();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await matchInternships({ field: searchQuery }, 9);
      setInternships(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Internship Hub</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Discover high-impact internships across Europe, North America, and Asia. 
            Directly matched with your Pakistani student profile.
          </p>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by field (e.g. AI, Finance, Mechanical)..."
              className="w-full h-14 bg-card border border-border rounded-2xl pl-12 pr-4 text-white outline-none focus:border-brand/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          </form>
          <button className="h-14 px-6 bg-card border border-border rounded-2xl flex items-center gap-2 hover:bg-border/50 transition-colors">
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-card/50 border border-border rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <div 
                key={internship.id}
                className="group bg-card border border-border rounded-3xl p-6 hover:border-brand/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand/5 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
                    <Briefcase size={24} />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider">
                    {internship.duration}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-1 group-hover:text-brand transition-colors">
                  {internship.role}
                </h3>
                <p className="text-gray-400 font-medium mb-4">{internship.company}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} className="text-brand" />
                    {internship.location}, {internship.country}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <DollarSign size={14} className="text-brand" />
                    {internship.stipend > 0 ? `${internship.stipend} ${internship.currency}/mo` : "Unpaid / Credit"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={14} className="text-brand" />
                    Deadline: {internship.deadline}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {internship.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-border/50 text-[10px] text-gray-400 uppercase font-bold">
                      {tag}
                    </span>
                  ))}
                </div>

                <a 
                  href={internship.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-border/50 hover:bg-brand hover:text-black flex items-center justify-center gap-2 font-bold transition-all group/btn"
                >
                  Apply Now
                  <ExternalLink size={16} className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && internships.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-500 text-lg">No internships found for this search. Try a different field!</p>
          </div>
        )}
      </div>
    </main>
  );
}
