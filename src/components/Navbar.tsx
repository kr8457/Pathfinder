"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap, Briefcase, UserCircle, Home, Map, User,
  Award, LayoutDashboard, Calculator, FileText, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

const primaryNav = [
  { name: "Home", href: "/", icon: Home },
  { name: "Universities", href: "/chat", icon: GraduationCap },
  { name: "Internships", href: "/internships", icon: Briefcase },
  { name: "Consultant", href: "/consultant", icon: UserCircle },
];

const toolsNav = [
  { name: "Scholarships", href: "/scholarships", icon: Award },
  { name: "App Tracker", href: "/tracker", icon: LayoutDashboard },
  { name: "Cost Calculator", href: "/cost-calculator", icon: Calculator },
  { name: "Doc Checklist", href: "/checklist", icon: FileText },
  { name: "Visa Roadmap", href: "/visa-roadmap", icon: Map },
  { name: "My Profile", href: "/profile", icon: User },
];

export function Navbar() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isToolsActive = toolsNav.some((item) => pathname === item.href);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4">
      <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-full px-4 py-2 flex items-center gap-1 shadow-2xl shadow-black/20">
        
        {/* Primary Nav Links */}
        {primaryNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 group",
                isActive ? "text-black font-semibold" : "text-gray-400 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-brand rounded-full -z-10 shadow-[0_0_15px_rgba(0,255,102,0.3)]" />
              )}
              <Icon size={16} className={cn("transition-transform group-hover:scale-110", isActive && "text-black")} />
              <span className="text-sm hidden md:block">{item.name}</span>
            </Link>
          );
        })}

        {/* Divider */}
        <div className="w-px h-5 bg-border/50 mx-1" />

        {/* Tools Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setToolsOpen((p) => !p)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
              isToolsActive ? "text-black font-semibold" : "text-gray-400 hover:text-white"
            )}
          >
            {isToolsActive && (
              <div className="absolute inset-0 bg-brand rounded-full -z-10 shadow-[0_0_15px_rgba(0,255,102,0.3)]" />
            )}
            <span className="text-sm hidden md:block">Tools</span>
            <ChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                toolsOpen ? "rotate-180" : "",
                isToolsActive ? "text-black" : ""
              )}
            />
          </button>

          {/* Dropdown Panel */}
          {toolsOpen && (
            <div className="absolute top-full mt-3 right-0 bg-card/90 backdrop-blur-xl border border-border/50 rounded-2xl p-2 shadow-2xl min-w-[200px]">
              {toolsNav.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setToolsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm group",
                      isActive
                        ? "bg-brand text-black font-bold"
                        : "text-gray-400 hover:text-white hover:bg-border/50"
                    )}
                  >
                    <Icon size={16} className={cn("shrink-0", isActive && "text-black")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
