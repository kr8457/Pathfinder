"use client";

import { useState } from "react";
import { Calculator, Home, ShoppingCart, Bus, Wifi, Coffee, DollarSign } from "lucide-react";

const cities: Record<string, {
  country: string;
  currency: string;
  pkrRate: number;
  rent: [number, number];
  food: number;
  transport: number;
  internet: number;
  entertainment: number;
  utilities: number;
}> = {
  "Berlin, Germany": {
    country: "Germany", currency: "EUR", pkrRate: 305,
    rent: [600, 900], food: 250, transport: 86, internet: 30, entertainment: 80, utilities: 60,
  },
  "Munich, Germany": {
    country: "Germany", currency: "EUR", pkrRate: 305,
    rent: [900, 1400], food: 280, transport: 57, internet: 30, entertainment: 100, utilities: 75,
  },
  "Toronto, Canada": {
    country: "Canada", currency: "CAD", pkrRate: 205,
    rent: [1500, 2200], food: 400, transport: 156, internet: 60, entertainment: 120, utilities: 100,
  },
  "Vancouver, Canada": {
    country: "Canada", currency: "CAD", pkrRate: 205,
    rent: [1800, 2600], food: 420, transport: 110, internet: 60, entertainment: 130, utilities: 90,
  },
  "London, UK": {
    country: "UK", currency: "GBP", pkrRate: 355,
    rent: [1200, 1800], food: 350, transport: 174, internet: 40, entertainment: 150, utilities: 80,
  },
  "Manchester, UK": {
    country: "UK", currency: "GBP", pkrRate: 355,
    rent: [700, 1100], food: 280, transport: 90, internet: 35, entertainment: 100, utilities: 65,
  },
  "Rome, Italy": {
    country: "Italy", currency: "EUR", pkrRate: 305,
    rent: [600, 900], food: 250, transport: 35, internet: 30, entertainment: 80, utilities: 60,
  },
  "Istanbul, Turkey": {
    country: "Turkey", currency: "USD", pkrRate: 280,
    rent: [300, 500], food: 150, transport: 30, internet: 15, entertainment: 50, utilities: 40,
  },
};

const icons: Record<string, React.ReactNode> = {
  rent: <Home size={18} />,
  food: <ShoppingCart size={18} />,
  transport: <Bus size={18} />,
  internet: <Wifi size={18} />,
  entertainment: <Coffee size={18} />,
  utilities: <DollarSign size={18} />,
};

export default function CostCalculatorPage() {
  const [selectedCity, setSelectedCity] = useState("Berlin, Germany");
  const [rentType, setRentType] = useState<"shared" | "studio">("shared");

  const city = cities[selectedCity];
  const rent = rentType === "shared" ? city.rent[0] : city.rent[1];

  const breakdown = {
    rent,
    food: city.food,
    transport: city.transport,
    internet: city.internet,
    entertainment: city.entertainment,
    utilities: city.utilities,
  };

  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  const labels: Record<string, string> = {
    rent: rentType === "shared" ? "Rent (Shared Room)" : "Rent (Studio/1BR)",
    food: "Food & Groceries",
    transport: "Public Transport",
    internet: "Internet & Phone",
    entertainment: "Entertainment",
    utilities: "Utilities",
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-4">
            <Calculator size={14} /> Budget Planner
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Cost of Living Calculator</h1>
          <p className="text-gray-400 text-lg">
            Estimate your monthly expenses abroad in Pakistani Rupees. Plan smart, move confident.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Controls */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="font-bold text-lg mb-4">Select City</h2>
              <div className="space-y-2">
                {Object.keys(cities).map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedCity === city
                        ? "bg-brand text-black font-bold"
                        : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-3xl p-6">
              <h2 className="font-bold text-lg mb-4">Accommodation Type</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setRentType("shared")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    rentType === "shared"
                      ? "bg-brand text-black font-bold"
                      : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                  }`}
                >
                  🏘️ Shared Room / Wohnheim
                </button>
                <button
                  onClick={() => setRentType("studio")}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    rentType === "studio"
                      ? "bg-brand text-black font-bold"
                      : "bg-background border border-border text-gray-400 hover:border-brand/30 hover:text-white"
                  }`}
                >
                  🏠 Studio / 1BR Apartment
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-4">

            {/* Total Card */}
            <div className="bg-card border border-brand/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,255,102,0.05)]">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-gray-400">Estimated Monthly Total</h2>
                <span className="text-xs text-gray-500 font-bold uppercase">{selectedCity}</span>
              </div>
              <div className="text-5xl font-black text-brand mb-1">
                {total.toLocaleString()} {city.currency}
              </div>
              <div className="text-gray-400 text-lg">
                ≈ <span className="text-white font-bold">{(total * city.pkrRate).toLocaleString()} PKR</span> / month
              </div>
              <div className="text-gray-500 text-sm mt-1">
                ≈ {((total * city.pkrRate) * 12).toLocaleString()} PKR / year
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-card border border-border rounded-3xl p-6">
              <h3 className="font-bold mb-4">Expense Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(breakdown).map(([key, value]) => {
                  const pct = Math.round((value / total) * 100);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-brand">{icons[key]}</span>
                          {labels[key]}
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-sm">{value} {city.currency}</span>
                          <span className="text-gray-500 text-xs ml-2">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-brand/5 border border-brand/20 rounded-3xl p-6">
              <h3 className="font-bold text-brand mb-3">💡 Money-Saving Tips for {city.country}</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Apply for student discounts on transport (30-50% off in most cities)</li>
                <li>• Cook at home — eating out can cost 3x more</li>
                <li>• Use university student accommodation (Wohnheim/residences) for lowest rent</li>
                <li>• Compare international transfer apps: Wise, Remitly, or SadaPay</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
