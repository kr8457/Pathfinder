"use client";

import { useState } from "react";
import { CheckCircle2, Circle, FileText, ChevronDown, ChevronRight } from "lucide-react";

const checklists: Record<string, { category: string; items: string[] }[]> = {
  germany: [
    {
      category: "Academic Documents",
      items: [
        "Original Degree / Transcript (attested from HEC)",
        "Matric & Intermediate Certificates (attested from IBCC)",
        "English translation of all documents",
        "IELTS/TOEFL Score Report",
        "University Admission Letter (Unconditional)",
        "Motivation Letter / Statement of Purpose",
        "2 Recommendation Letters",
      ],
    },
    {
      category: "Financial Documents",
      items: [
        "Blocked Account Certificate (Expatrio or Fintiba)",
        "Bank Statement (last 6 months)",
        "Financial Sponsorship Letter (if applicable)",
        "Tax Returns of Sponsor (if applicable)",
      ],
    },
    {
      category: "Personal Documents",
      items: [
        "Valid Passport (6+ months validity)",
        "Recent Passport-size Photos (biometric)",
        "Completed Visa Application Form (VFS Germany)",
        "Health Insurance Certificate",
        "CV / Resume",
        "Proof of Accommodation in Germany",
      ],
    },
    {
      category: "At VFS / Embassy",
      items: [
        "Appointment Confirmation Print",
        "All originals + 2 photocopies",
        "VFS Service Fee Payment",
        "Biometrics (fingerprints)",
      ],
    },
  ],
  canada: [
    {
      category: "Academic Documents",
      items: [
        "Original Degree / Transcripts",
        "IELTS Score Report (min 6.0 SDS)",
        "Acceptance Letter from Canadian University",
        "Educational Credential Assessment (ECA) if required",
      ],
    },
    {
      category: "Financial Documents",
      items: [
        "GIC Certificate (CIBC/Scotiabank) — CAD 20,635",
        "Bank Statement (last 4 months)",
        "Proof of tuition payment (1st year)",
        "Scholarship/Funding letter (if applicable)",
      ],
    },
    {
      category: "Personal Documents",
      items: [
        "Valid Passport",
        "Passport Photos",
        "Study Permit Application (IMM 1294)",
        "Statement of Purpose",
        "PAL (Provincial Attestation Letter)",
        "Medical Exam from IRCC-approved physician",
        "Police Clearance Certificate",
      ],
    },
    {
      category: "Biometrics",
      items: [
        "Biometrics enrollment at VFS Global",
        "Biometrics fee payment (CAD 85)",
        "Biometrics collection letter from IRCC",
      ],
    },
  ],
  uk: [
    {
      category: "Academic Documents",
      items: [
        "Degree / Transcripts (HEC attested)",
        "IELTS Score (min 6.0-6.5 UKVI)",
        "CAS Number from University",
        "University Offer Letter",
        "Academic Reference Letters",
      ],
    },
    {
      category: "Financial Documents",
      items: [
        "Bank Statement showing required maintenance funds",
        "IHS Surcharge payment receipt",
        "Proof of tuition deposit payment",
        "Sponsor's financial documents (if applicable)",
      ],
    },
    {
      category: "Personal Documents",
      items: [
        "Valid Passport",
        "Passport Photos (UK spec)",
        "TB Test certificate from IOM Center",
        "Proof of English proficiency (IELTS UKVI)",
        "Criminal Record Certificate",
        "Completed UK Student Visa Application (online)",
      ],
    },
  ],
  italy: [
    {
      category: "Academic Documents",
      items: [
        "Degree Certificate (legalized via CIMEA/DOV)",
        "Transcripts (attested by HEC, MOFA, Italian Embassy)",
        "Pre-enrollment confirmation from Universitaly portal",
        "Italian Language certificate (B2) or IELTS",
      ],
    },
    {
      category: "Financial Documents",
      items: [
        "Bank Statement showing €500/month",
        "Scholarship letter (if applicable)",
        "Insurance certificate",
      ],
    },
    {
      category: "Personal Documents",
      items: [
        "Valid Passport",
        "Completed Visa Application Form (via BLS International)",
        "2 Passport Photos",
        "Proof of Accommodation",
        "Codice Fiscale application preparation",
      ],
    },
  ],
  turkey: [
    {
      category: "Academic Documents",
      items: [
        "Degree / Transcripts",
        "Denklik (Equivalency) from Turkish Embassy",
        "University Acceptance Letter (Türkiye Burslari or direct)",
        "Turkish Language Certificate (B2) or exemption",
      ],
    },
    {
      category: "Financial Documents",
      items: [
        "Bank Statement (last 3 months)",
        "Scholarship Certificate (if applicable)",
      ],
    },
    {
      category: "Personal Documents",
      items: [
        "Valid Passport",
        "Biometric Photos",
        "Student Visa Application",
        "Medical Insurance",
        "Travel Insurance (90-day)",
        "Accommodation confirmation",
      ],
    },
  ],
};

const countries = [
  { key: "germany", label: "🇩🇪 Germany" },
  { key: "canada", label: "🇨🇦 Canada" },
  { key: "uk", label: "🇬🇧 United Kingdom" },
  { key: "italy", label: "🇮🇹 Italy" },
  { key: "turkey", label: "🇹🇷 Turkey" },
];

export default function ChecklistPage() {
  const [selectedCountry, setSelectedCountry] = useState("germany");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = (cat: string) =>
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const categories = checklists[selectedCountry] || [];
  const allItems = categories.flatMap((c) => c.items.map((item) => `${selectedCountry}-${c.category}-${item}`));
  const checkedCount = allItems.filter((key) => checked[key]).length;
  const progress = allItems.length > 0 ? Math.round((checkedCount / allItems.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-4">
            <FileText size={14} /> Document Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Document Checklist</h1>
          <p className="text-gray-400 text-lg">Never miss a document. Your complete visa & application checklist by country.</p>
        </div>

        {/* Country Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {countries.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedCountry(c.key)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                selectedCountry === c.key
                  ? "bg-brand text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                  : "bg-card border border-border text-gray-400 hover:text-white hover:border-brand/30"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold">Your Progress</span>
            <span className="text-brand font-black">{checkedCount}/{allItems.length} documents</span>
          </div>
          <div className="h-3 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progress === 100 ? "🎉 You're ready to apply!" : `${progress}% complete — keep going!`}
          </p>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-4">
          {categories.map((cat) => {
            const isExpanded = expanded[cat.category] !== false; // default open
            const catChecked = cat.items.filter(
              (item) => checked[`${selectedCountry}-${cat.category}-${item}`]
            ).length;

            return (
              <div key={cat.category} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => toggleCategory(cat.category)}
                  className="w-full flex items-center justify-between p-5 hover:bg-border/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{cat.category}</span>
                    <span className="text-xs text-brand font-bold bg-brand/10 px-2 py-0.5 rounded-full">
                      {catChecked}/{cat.items.length}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 space-y-3 border-t border-border/50">
                    {cat.items.map((item) => {
                      const key = `${selectedCountry}-${cat.category}-${item}`;
                      const isDone = checked[key];
                      return (
                        <button
                          key={item}
                          onClick={() => toggle(key)}
                          className={`w-full flex items-start gap-3 text-left p-3 rounded-xl transition-all ${
                            isDone ? "bg-brand/10 border border-brand/20" : "hover:bg-border/30"
                          }`}
                        >
                          {isDone
                            ? <CheckCircle2 size={20} className="text-brand shrink-0 mt-0.5" />
                            : <Circle size={20} className="text-gray-600 shrink-0 mt-0.5" />
                          }
                          <span className={`text-sm ${isDone ? "text-brand line-through" : "text-gray-300"}`}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
