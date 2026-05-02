"use client";

import { useState, useRef, useEffect } from "react";
import { UserCircle, Send, Sparkles, LayoutDashboard, History, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";


export default function ConsultantPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        assistantContent += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Consultant error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-screen bg-background text-foreground flex overflow-hidden pt-24">
      {/* Sidebar - Quick Actions */}
      <aside className="w-80 border-r border-border bg-card/30 hidden lg:flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Sparkles className="text-brand" size={20} />
          Strategy Board
        </h2>
        
        <div className="space-y-4">
          <button className="w-full p-4 rounded-2xl bg-brand/10 border border-brand/20 text-left hover:bg-brand/20 transition-all group">
            <h3 className="font-bold text-brand group-hover:translate-x-1 transition-transform">Resume Audit</h3>
            <p className="text-xs text-gray-400 mt-1">AI-powered scan for international standards.</p>
          </button>
          
          <button className="w-full p-4 rounded-2xl bg-border/20 border border-border/50 text-left hover:bg-border/30 transition-all group">
            <h3 className="font-bold group-hover:translate-x-1 transition-transform">Market Insights</h3>
            <p className="text-xs text-gray-400 mt-1">Current hiring trends in your target country.</p>
          </button>

          <button className="w-full p-4 rounded-2xl bg-border/20 border border-border/50 text-left hover:bg-border/30 transition-all group">
            <h3 className="font-bold group-hover:translate-x-1 transition-transform">Skill Roadmap</h3>
            <p className="text-xs text-gray-400 mt-1">What to learn before you move.</p>
          </button>
        </div>

        <div className="mt-auto pt-8 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
            <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-black font-bold">
              PK
            </div>
            <div>
              <p className="text-sm font-bold">Pakistani Student</p>
              <p className="text-xs text-gray-500">Free Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center text-brand mb-6">
                <UserCircle size={48} />
              </div>
              <h1 className="text-3xl font-black mb-4">Your AI Career Consultant</h1>
              <p className="text-gray-400 text-lg">
                Ask me about CV standards in Germany, salary expectations in Canada, or how to bridge the skill gap for international roles.
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={cn(
                "flex gap-4 max-w-4xl",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold",
                msg.role === "user" ? "bg-brand text-black" : "bg-card border border-border text-brand"
              )}>
                {msg.role === "user" ? "U" : "AI"}
              </div>
              <div className={cn(
                "p-6 rounded-3xl text-lg leading-relaxed",
                msg.role === "user" 
                  ? "bg-brand/10 text-white border border-brand/20" 
                  : "bg-card border border-border text-gray-200 shadow-xl"
              )}>
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-brand animate-pulse">
                AI
              </div>
              <div className="h-12 w-24 bg-card border border-border rounded-2xl animate-pulse" />
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 border-t border-border bg-background">
          <form 
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for career advice..."
              className="w-full h-16 bg-card border border-border rounded-2xl px-6 pr-20 text-white outline-none focus:border-brand/50 transition-all shadow-2xl"
            />
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 h-12 w-12 rounded-xl bg-brand text-black flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-4">
            PathFinder AI can make mistakes. Always verify critical information with official sources.
          </p>
        </div>
      </section>
    </main>
  );
}
