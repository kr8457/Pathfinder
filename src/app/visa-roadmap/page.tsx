"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ticket, CreditCard, ShieldCheck, Plane, Wallet, ChevronRight, Info } from "lucide-react";
import visaData from "@/data/visaData.json";

interface VisaInfo {
  country: string;
  currency: string;
  costs: { item: string; amount: number; note: string }[];
  steps: { title: string; desc: string }[];
}

export default function VisaRoadmap() {
  const [data, setData] = useState<VisaInfo | null>(null);
  const [pkrRate, setPkrRate] = useState(300); // Default placeholder rate

  useEffect(() => {
    const profileStr = localStorage.getItem("pathfinder_profile");
    if (profileStr) {
      const profile = JSON.parse(profileStr);
      // Try to match destination
      const dest = profile.destinations?.[0]?.toLowerCase() || "germany";
      const info = (visaData as any)[dest] || visaData.germany;
      setData(info);

      // Set exchange rate based on currency
      if (info.currency === "USD") setPkrRate(280);
      else if (info.currency === "EUR") setPkrRate(305);
      else if (info.currency === "GBP") setPkrRate(355);
      else if (info.currency === "CAD") setPkrRate(205);
    } else {
      setData(visaData.germany);
      setPkrRate(305);
    }
  }, []);

  if (!data) return null;

  const totalCost = data.costs.reduce((sum, item) => sum + item.amount, 0);

  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto p-4 flex items-center gap-3">
          <Link href="/results" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="font-bold">Visa Roadmap: {data.country}</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Hero Section */}
        <div className="mb-12 mt-4">
          <h1 className="text-4xl font-extrabold mb-4">Your Journey to {data.country}</h1>
          <p className="text-gray-400 max-w-2xl">
            From Pakistan to your dream campus. We've mapped out the essential steps and estimated costs to help you plan your budget.
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
                      <span className="font-bold text-brand">{item.amount} {data.currency}</span>
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
                Costs are estimates based on average PIA/International flight prices and official 2024 embassy fees.
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
                  Apply for the **HBL or Alfalah Student Account** to manage international transfers easily.
                </li>
                <li className="flex gap-2">
                  <ChevronRight size={14} className="text-brand shrink-0 mt-1" />
                  Book your flight at least **2 months in advance** to save up to 40k PKR.
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
