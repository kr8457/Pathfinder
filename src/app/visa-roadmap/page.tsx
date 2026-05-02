"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Plane, Wallet, ChevronRight, Info } from "lucide-react";
import visaData from "@/data/visaData.json";

interface VisaInfo {
  country: string;
  currency: string;
  costs: { item: string; amount: number; note: string }[];
  steps: { title: string; desc: string }[];
}

const COUNTRY_KEYS = Object.keys(visaData) as Array<keyof typeof visaData>;

// Map common destination names → JSON keys
function resolveKey(dest: string): keyof typeof visaData {
  const d = dest.toLowerCase();
  if (d.includes("uk") || d.includes("united kingdom") || d.includes("britain")) return "uk";
  if (d.includes("canada")) return "canada";
  if (d.includes("germany")) return "germany";
  if (d.includes("italy")) return "italy";
  if (d.includes("turkey")) return "turkey";
  // fallback: try direct key
  if (COUNTRY_KEYS.includes(d as keyof typeof visaData)) return d as keyof typeof visaData;
  return "germany";
}

function getPkrRate(currency: string) {
  if (currency === "USD") return 280;
  if (currency === "EUR") return 305;
  if (currency === "GBP") return 355;
  if (currency === "CAD") return 205;
  return 300;
}

export default function VisaRoadmap() {
  const [selectedKey, setSelectedKey] = useState<keyof typeof visaData>("germany");

  useEffect(() => {
    const profileStr = localStorage.getItem("pathfinder_profile");
    if (profileStr) {
      try {
        const profile = JSON.parse(profileStr);
        const dest = profile.destinations?.[0] || "germany";
        setSelectedKey(resolveKey(dest));
      } catch {}
    }
  }, []);

  const data = visaData[selectedKey] as VisaInfo;
  const pkrRate = getPkrRate(data.currency);
  const totalCost = data.costs.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24 pt-24">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur sticky top-24 z-20">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-3">
          <Link href="/results" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="font-bold">Visa Roadmap</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Country Selector */}
        <div className="my-8">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Select Destination Country</h2>
          <div className="flex flex-wrap gap-3">
            {COUNTRY_KEYS.map((key) => {
              const countryData = visaData[key] as VisaInfo;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                    selectedKey === key
                      ? "bg-brand text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]"
                      : "bg-card border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                  }`}
                >
                  {countryData.country}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Your Journey to {data.country}</h1>
          <p className="text-gray-400 max-w-2xl">
            From Pakistan to your dream campus. Essential steps and estimated costs to help you plan your budget.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Timeline Section */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Plane className="text-brand" size={24} />
              Step-by-Step Guide
            </h2>

            <div className="relative pl-8 border-l border-border space-y-12 ml-4">
              {data.steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[45px] top-0 w-8 h-8 rounded-full bg-brand flex items-center justify-center text-black font-bold text-sm shadow-[0_0_15px_rgba(0,255,102,0.4)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                    <p className="text-gray-400">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Section */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet size={80} />
              </div>

              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="text-brand" size={20} />
                Estimated Budget
              </h2>

              <div className="space-y-4 mb-8">
                {data.costs.map((item, idx) => (
                  <div key={idx} className="flex flex-col border-b border-border/50 pb-3 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{item.item}</span>
                      <span className="font-bold text-brand">{item.amount.toLocaleString()} {data.currency}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.note}</span>
                  </div>
                ))}
              </div>

              <div className="bg-brand/10 rounded-xl p-4 border border-brand/20">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold">Total (Excl. Living)</span>
                  <span className="text-xl font-black text-brand">{totalCost.toLocaleString()} {data.currency}</span>
                </div>
                <div className="text-xs text-brand/70 text-right">
                  ≈ {(totalCost * pkrRate).toLocaleString()} PKR
                </div>
              </div>

              <div className="mt-6 flex items-start gap-2 text-xs text-gray-500 italic">
                <Info size={14} className="shrink-0 mt-0.5" />
                Costs are estimates based on average prices and official 2024 embassy fees.
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-border/30 rounded-2xl p-6 border border-border">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-brand" />
                Pro Tips for Pakistanis
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2">
                  <ChevronRight size={14} className="text-brand shrink-0 mt-1" />
                  Apply for HBL or Alfalah Student Account to manage international transfers easily.
                </li>
                <li className="flex gap-2">
                  <ChevronRight size={14} className="text-brand shrink-0 mt-1" />
                  Book your flight at least 2 months in advance to save up to 40k PKR.
                </li>
                <li className="flex gap-2">
                  <ChevronRight size={14} className="text-brand shrink-0 mt-1" />
                  Keep digital copies of all documents on Google Drive for easy access during the interview.
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}



