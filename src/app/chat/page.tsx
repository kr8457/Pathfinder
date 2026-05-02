// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Bot, User, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{id: string, role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle initial query from landing page OR pre-filled student profile
  useEffect(() => {
    const initialQuery = sessionStorage.getItem("pathfinder_initial_query");
    if (initialQuery) {
      sessionStorage.removeItem("pathfinder_initial_query");
      setTimeout(() => {
        processQuery(initialQuery);
      }, 100);
      return;
    }

    // Auto-load from saved student profile
    const savedProfile = localStorage.getItem("pathfinder_student_profile");
    if (savedProfile) {
      try {
        const p = JSON.parse(savedProfile);
        if (p.field && p.destinations?.length > 0) {
          const autoQuery = `I want to study ${p.field}${p.degree ? " (" + p.degree + ")" : ""} in ${p.destinations.join(" or ")}. Budget: ${p.budget || "open"}. IELTS: ${p.ielts || "not yet taken"}.`;
          setTimeout(() => {
            processQuery(autoQuery);
          }, 300);
        }
      } catch {}
    }
  }, []); // eslint-disable-line

  const processQuery = async (text: string) => {
    const userMsg = { id: Date.now().toString(), role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    await performChat(newMessages);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    await processQuery(input);
  };

  const performChat = async (newMessages: any[]) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Network response was not ok");
      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";

      const astId = (Date.now() + 1).toString();
      setMessages([...newMessages, { id: astId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMsg += decoder.decode(value, { stream: true });
        
        setMessages(msgs => {
          const last = msgs[msgs.length - 1];
          return [...msgs.slice(0, -1), { ...last, content: assistantMsg }];
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for profile JSON in assistant messages
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      // Use a more inclusive regex for the profile tag
      const match = lastMessage.content.match(/<profile>([\s\S]*?)<\/profile>/i);
      if (match && match[1]) {
        try {
          const jsonStr = match[1].trim();
          const profileData = JSON.parse(jsonStr);
          
          // Save to local storage for the results page
          localStorage.setItem("pathfinder_profile", JSON.stringify(profileData));
          
          // Small delay for UI feedback before redirect
          const timer = setTimeout(() => {
            router.push("/results");
          }, 1200);
          
          return () => clearTimeout(timer);
        } catch (e) {
          console.warn("Found profile tag but JSON is incomplete/invalid yet:", e);
        }
      }
    }
  }, [messages, router]);

  // Strip profile tags from UI for clean display
  const cleanContent = (content: string) => {
    return content.replace(/<profile>[\s\S]*?<\/profile>/g, "").trim();
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center pt-24">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-brand flex items-center justify-center text-black">
                <Bot size={18} />
              </div>
              <span className="font-bold">PathFinder AI</span>
            </div>
          </div>
          <Link 
            href="/results"
            className="text-xs font-medium text-brand px-3 py-1.5 bg-brand/10 border border-brand/20 rounded hover:bg-brand/20 transition-all"
          >
            View Matches
          </Link>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 w-full max-w-3xl flex flex-col p-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 my-12">
            <Bot size={48} className="text-brand mb-4" />
            <h2 className="text-xl font-semibold mb-2">Welcome to PathFinder</h2>
            <p className="max-w-md">
              Hi! Tell me what you want to study and where you want to go. I'll ask a few questions to build your profile and find the best matches.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-6 pb-24">
          {messages.map((m) => {
            const content = cleanContent(m.content);
            if (!content) return null;

            const isAssistant = m.role === "assistant";

            return (
              <div 
                key={m.id} 
                className={`flex gap-4 ${isAssistant ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`w-8 h-8 shrink-0 rounded flex items-center justify-center ${
                  isAssistant ? "bg-card border border-border text-brand" : "bg-brand text-black"
                }`}>
                  {isAssistant ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  isAssistant 
                    ? "bg-card border border-border text-foreground" 
                    : "bg-brand text-black font-medium"
                }`}>
                  {content}
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex gap-4">
               <div className="w-8 h-8 shrink-0 rounded bg-card border border-border text-brand flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div className="bg-card border border-border rounded-2xl p-4 flex gap-1 items-center h-12">
                  <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-brand animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="w-full border-t border-border bg-background p-4 fixed bottom-0">
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-center"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., I want to study Computer Science in Germany..."
              className="w-full bg-card border border-border rounded-xl px-4 py-4 pr-14 outline-none focus:border-brand/50 transition-colors shadow-lg shadow-black"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 w-10 h-10 rounded-lg bg-brand hover:bg-brand-dark text-black flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="text-center text-xs text-gray-500 mt-2">
            AI can make mistakes. Please verify important information.
          </div>
        </div>
      </div>
    </main>
  );
}
