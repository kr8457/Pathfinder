"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User, GraduationCap, Globe, DollarSign, BookOpen,
  CheckCircle, ChevronRight, Briefcase, Save
} from "lucide-react";

const FIELDS_OF_STUDY = [
  "Computer Science", "Electrical Engineering", "Mechanical Engineering",
  "Business Administration", "Data Science & AI", "Medicine & Pharmacy",
  "Architecture", "Law", "Economics", "Mathematics", "Biology",
  "Chemistry", "Psychology", "Media & Communications", "Accounting & Finance"
];

const DESTINATIONS = [
  "Germany", "Canada", "UK", "Italy", "Turkey", "France",
  "Netherlands", "Sweden", "Norway", "Denmark", "Australia", "Japan"
];

const DEGREE_LEVELS = ["Bachelor's", "Master's", "PhD", "Diploma / Short Course"];

const BUDGET_OPTIONS = [
  { label: "Free / Fully Funded", value: "free" },
  { label: "Under $3,000/yr", value: "under $3000" },
  { label: "Under $8,000/yr", value: "under $8000" },
  { label: "Under $15,000/yr", value: "under $15000" },
  { label: "No Budget Limit", value: "any" },
];

interface StudentProfile {
  name: string;
  email: string;
  field: string;
  degree: string;
  destinations: string[];
  budget: string;
  ielts: string;
  interests: string;
  experience: string;
}

const defaultProfile: StudentProfile = {
  name: "", email: "", field: "", degree: "",
  destinations: [], budget: "", ielts: "", interests: "", experience: ""
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [saved, setSaved] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("pathfinder_student_profile");
    if (stored) {
      try { setProfile(JSON.parse(stored)); } catch {}
    }
  }, []);

  const toggleDestination = (dest: string) => {
    setProfile(prev => ({
      ...prev,
      destinations: prev.destinations.includes(dest)
        ? prev.destinations.filter(d => d !== dest)
        : [...prev.destinations, dest]
    }));
  };

  const handleSave = () => {
    // Also update the pathfinder_profile used by results page
    const ragProfile = {
      field: profile.field,
      budget: profile.budget,
      destinations: profile.destinations,
      ielts: profile.ielts ? parseFloat(profile.ielts) : undefined,
      degree: profile.degree,
    };
    localStorage.setItem("pathfinder_student_profile", JSON.stringify(profile));
    localStorage.setItem("pathfinder_profile", JSON.stringify(ragProfile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFindMatches = () => {
    handleSave();
    router.push("/results");
  };

  const steps = ["Personal", "Academic", "Destinations", "Financial"];

  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand mx-auto mb-4">
            <User size={32} />
          </div>
          <h1 className="text-4xl font-black mb-2">My Student Profile</h1>
          <p className="text-gray-400">Fill in your details once. We'll use them to instantly find the best opportunities for you.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((step, idx) => (
            <button
              key={step}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeStep === idx
                  ? "bg-brand text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                  : "bg-card border border-border text-gray-400 hover:text-white"
              }`}
            >
              {idx + 1}. {step}
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">

          {/* Step 0: Personal Info */}
          {activeStep === 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <User className="text-brand" size={24} /> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Ahmed Khan"
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                    placeholder="ahmed@example.com"
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">Brief Background / Experience</label>
                <textarea
                  value={profile.experience}
                  onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                  placeholder="e.g., Final year BSCS student at FAST NUCES, worked at a local startup..."
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-brand/50 transition-all resize-none"
                />
              </div>
              <button
                onClick={() => setActiveStep(1)}
                className="w-full h-12 rounded-xl bg-brand text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 1: Academic */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GraduationCap className="text-brand" size={24} /> Academic Details
              </h2>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Field of Study</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {FIELDS_OF_STUDY.map(f => (
                    <button
                      key={f}
                      onClick={() => setProfile(p => ({ ...p, field: f }))}
                      className={`p-3 rounded-xl text-sm font-medium text-left transition-all ${
                        profile.field === f
                          ? "bg-brand text-black"
                          : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-3">Target Degree</label>
                <div className="flex flex-wrap gap-3">
                  {DEGREE_LEVELS.map(d => (
                    <button
                      key={d}
                      onClick={() => setProfile(p => ({ ...p, degree: d }))}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        profile.degree === d
                          ? "bg-brand text-black"
                          : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">IELTS Score (optional)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    value={profile.ielts}
                    onChange={e => setProfile(p => ({ ...p, ielts: e.target.value }))}
                    placeholder="e.g., 6.5"
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Interests / Career Goals</label>
                  <input
                    type="text"
                    value={profile.interests}
                    onChange={e => setProfile(p => ({ ...p, interests: e.target.value }))}
                    placeholder="e.g., AI, Robotics, Startups"
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActiveStep(0)} className="flex-1 h-12 rounded-xl bg-card border border-border font-bold hover:bg-border/50 transition-all">Back</button>
                <button onClick={() => setActiveStep(2)} className="flex-1 h-12 rounded-xl bg-brand text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Destinations */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe className="text-brand" size={24} /> Desired Destinations
              </h2>
              <p className="text-gray-400 text-sm">Select all countries you'd like to study in. You can pick multiple!</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DESTINATIONS.map(dest => (
                  <button
                    key={dest}
                    onClick={() => toggleDestination(dest)}
                    className={`p-4 rounded-2xl text-sm font-bold flex items-center justify-between transition-all ${
                      profile.destinations.includes(dest)
                        ? "bg-brand text-black shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                        : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                    }`}
                  >
                    {dest}
                    {profile.destinations.includes(dest) && <CheckCircle size={16} />}
                  </button>
                ))}
              </div>
              {profile.destinations.length > 0 && (
                <p className="text-brand text-sm font-bold">
                  ✓ Selected: {profile.destinations.join(", ")}
                </p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setActiveStep(1)} className="flex-1 h-12 rounded-xl bg-card border border-border font-bold hover:bg-border/50 transition-all">Back</button>
                <button onClick={() => setActiveStep(3)} className="flex-1 h-12 rounded-xl bg-brand text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Financial */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="text-brand" size={24} /> Budget & Financial Plan
              </h2>
              <p className="text-gray-400 text-sm">This helps us filter universities by affordability.</p>
              <div className="space-y-3">
                {BUDGET_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setProfile(p => ({ ...p, budget: opt.value }))}
                    className={`w-full p-4 rounded-2xl text-left font-bold flex items-center justify-between transition-all ${
                      profile.budget === opt.value
                        ? "bg-brand text-black"
                        : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                    }`}
                  >
                    {opt.label}
                    {profile.budget === opt.value && <CheckCircle size={20} />}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setActiveStep(2)} className="flex-1 h-12 rounded-xl bg-card border border-border font-bold hover:bg-border/50 transition-all">Back</button>
                <button
                  onClick={handleSave}
                  className="flex-1 h-12 rounded-xl bg-card border border-brand/50 text-brand font-bold flex items-center justify-center gap-2 hover:bg-brand/10 transition-all"
                >
                  <Save size={18} />
                  {saved ? "Saved! ✓" : "Save Profile"}
                </button>
                <button
                  onClick={handleFindMatches}
                  className="flex-1 h-12 rounded-xl bg-brand text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <Briefcase size={18} />
                  Find Matches
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Summary Card (show when filled) */}
        {profile.field && profile.destinations.length > 0 && (
          <div className="mt-8 bg-brand/5 border border-brand/20 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-4">Profile Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 mb-1">Field</p>
                <p className="font-bold text-sm">{profile.field || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Degree</p>
                <p className="font-bold text-sm">{profile.degree || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Destinations</p>
                <p className="font-bold text-sm">{profile.destinations.length > 0 ? profile.destinations.slice(0, 2).join(", ") : "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Budget</p>
                <p className="font-bold text-sm">{profile.budget || "—"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
