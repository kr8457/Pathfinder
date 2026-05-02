"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, ExternalLink, CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";

type Stage = "wishlist" | "researching" | "applied" | "interview" | "offer";

interface ApplicationCard {
  id: string;
  university: string;
  country: string;
  program: string;
  deadline: string;
  website: string;
  notes: string;
  stage: Stage;
  createdAt: string;
}

const STAGES: { key: Stage; label: string; color: string; icon: React.ReactNode }[] = [
  { key: "wishlist", label: "Wishlist", color: "border-gray-600", icon: <Clock size={16} /> },
  { key: "researching", label: "Researching", color: "border-blue-500", icon: <Loader2 size={16} /> },
  { key: "applied", label: "Applied", color: "border-yellow-500", icon: <CheckCircle2 size={16} /> },
  { key: "interview", label: "Interview", color: "border-purple-500", icon: <CheckCircle2 size={16} /> },
  { key: "offer", label: "🎉 Offer!", color: "border-brand", icon: <CheckCircle2 size={16} /> },
];

const defaultCard = (): Partial<ApplicationCard> => ({
  university: "", country: "", program: "", deadline: "", website: "", notes: ""
});

export default function TrackerPage() {
  const [cards, setCards] = useState<ApplicationCard[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<ApplicationCard>>(defaultCard());
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pathfinder_tracker");
    if (stored) {
      try { setCards(JSON.parse(stored)); } catch {}
    }
  }, []);

  const save = (updated: ApplicationCard[]) => {
    setCards(updated);
    localStorage.setItem("pathfinder_tracker", JSON.stringify(updated));
  };

  const addCard = () => {
    if (!form.university) return;
    const newCard: ApplicationCard = {
      id: Date.now().toString(),
      university: form.university || "",
      country: form.country || "",
      program: form.program || "",
      deadline: form.deadline || "",
      website: form.website || "",
      notes: form.notes || "",
      stage: "wishlist",
      createdAt: new Date().toISOString(),
    };
    save([...cards, newCard]);
    setForm(defaultCard());
    setShowForm(false);
  };

  const moveCard = (cardId: string, newStage: Stage) => {
    save(cards.map((c) => c.id === cardId ? { ...c, stage: newStage } : c));
  };

  const deleteCard = (cardId: string) => {
    save(cards.filter((c) => c.id !== cardId));
  };

  const stageCards = (stage: Stage) => cards.filter((c) => c.stage === stage);

  return (
    <main className="min-h-screen bg-background text-foreground pt-28 pb-24">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black mb-2">Application Tracker</h1>
            <p className="text-gray-400">Track all your university applications in one place. Drag cards to update status.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="h-12 px-6 rounded-2xl bg-brand text-black font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(0,255,102,0.2)]"
          >
            <Plus size={20} /> Add Application
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {STAGES.map((stage) => (
            <div key={stage.key} className={`bg-card border-b-2 ${stage.color} rounded-2xl p-4 text-center`}>
              <div className="text-3xl font-black text-brand">{stageCards(stage.key).length}</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">{stage.label}</div>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
          {STAGES.map((stage) => (
            <div
              key={stage.key}
              className={`bg-card/40 border ${stage.color} border-opacity-40 rounded-3xl p-4 min-h-[400px]`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragging) moveCard(dragging, stage.key);
                setDragging(null);
              }}
            >
              <div className={`flex items-center gap-2 mb-4 font-bold text-sm`}>
                <span className={stage.key === "offer" ? "text-brand" : "text-gray-300"}>{stage.label}</span>
                <span className="ml-auto bg-border rounded-full w-6 h-6 flex items-center justify-center text-xs text-gray-400">
                  {stageCards(stage.key).length}
                </span>
              </div>

              <div className="space-y-3">
                {stageCards(stage.key).map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDragging(card.id)}
                    className="bg-card border border-border rounded-2xl p-4 cursor-grab active:cursor-grabbing hover:border-brand/30 transition-all group relative"
                  >
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex items-start gap-2 mb-2">
                      <GripVertical size={14} className="text-gray-600 mt-1 shrink-0" />
                      <div>
                        <h3 className="font-bold text-sm leading-tight">{card.university}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{card.country}</p>
                      </div>
                    </div>

                    {card.program && (
                      <div className="text-xs text-brand font-medium mb-2 pl-5">{card.program}</div>
                    )}

                    {card.deadline && (
                      <div className="text-xs text-gray-500 pl-5 mb-2">⏰ {card.deadline}</div>
                    )}

                    {card.notes && (
                      <div className="text-xs text-gray-500 pl-5 line-clamp-2 mb-2">{card.notes}</div>
                    )}

                    {card.website && (
                      <a
                        href={card.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-brand pl-5 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={10} /> Visit
                      </a>
                    )}

                    {/* Quick move buttons */}
                    <div className="flex gap-1 mt-3 pl-5 flex-wrap">
                      {STAGES.filter((s) => s.key !== stage.key).map((s) => (
                        <button
                          key={s.key}
                          onClick={() => moveCard(card.id, s.key)}
                          className="text-[9px] px-2 py-0.5 rounded-full bg-border/50 text-gray-500 hover:bg-brand/20 hover:text-brand transition-all"
                        >
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {stageCards(stage.key).length === 0 && (
                  <div className="text-center py-8 text-gray-600 text-xs">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
            <div className="bg-card border border-border rounded-3xl p-8 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-black mb-6">Add Application</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="University Name *"
                  value={form.university || ""}
                  onChange={(e) => setForm((p) => ({ ...p, university: e.target.value }))}
                  className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Country"
                    value={form.country || ""}
                    onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50"
                  />
                  <input
                    type="text"
                    placeholder="Program / Field"
                    value={form.program || ""}
                    onChange={(e) => setForm((p) => ({ ...p, program: e.target.value }))}
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Deadline (e.g. Jan 15)"
                    value={form.deadline || ""}
                    onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50"
                  />
                  <input
                    type="url"
                    placeholder="Website URL"
                    value={form.website || ""}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    className="w-full h-12 bg-background border border-border rounded-xl px-4 text-white outline-none focus:border-brand/50"
                  />
                </div>
                <textarea
                  placeholder="Notes (optional)"
                  value={form.notes || ""}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white outline-none focus:border-brand/50 resize-none"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowForm(false)} className="flex-1 h-12 rounded-xl bg-border/50 font-bold hover:bg-border transition-all">Cancel</button>
                <button onClick={addCard} className="flex-1 h-12 rounded-xl bg-brand text-black font-bold hover:opacity-90 transition-all">Add Card</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
