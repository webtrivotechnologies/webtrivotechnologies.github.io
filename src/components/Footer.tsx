import React, { useState } from "react";
import { Mail, Check, Send, Linkedin, Instagram, Facebook, Youtube, Github, ShieldAlert } from "lucide-react";
import { SiteSettings } from "../types";

const isApiEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_API === "true";

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ settings, onNavigate }: FooterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("submitting");
    try {
      if (!isApiEnabled) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-corporate-footer" className="bg-[#0E1B31] text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 border-b border-slate-800 pb-16">
        
        {/* Col 1: Abstract Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("hero")}>
            <div className="w-9 h-9 rounded-lg bg-[#0B63F6] flex items-center justify-center font-extrabold text-lg shadow-md text-white">
              W
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white leading-none">Webtrivo</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#19B5FE] mt-0.5">Technologies</span>
            </div>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
            Webtrivo Technologies is a world-class digital product agency engineering high-performance websites, custom cross-platform mobile apps, cloud-hosted ERP/CRM systems, and custom AI automations.
          </p>
          <div className="flex gap-4">
            <a href="https://linkedin.com/company/webtrivo" target="_blank" className="p-2 rounded-lg bg-slate-800 hover:bg-[#0B63F6] text-slate-400 hover:text-white transition-colors">
              <Linkedin size={15} />
            </a>
            <a href="https://instagram.com/webtrivo" target="_blank" className="p-2 rounded-lg bg-slate-800 hover:bg-[#0B63F6] text-slate-400 hover:text-white transition-colors">
              <Instagram size={15} />
            </a>
            <a href="https://github.com/webtrivo" target="_blank" className="p-2 rounded-lg bg-slate-800 hover:bg-[#0B63F6] text-slate-400 hover:text-white transition-colors">
              <Github size={15} />
            </a>
            <a href="https://facebook.com/webtrivo" target="_blank" className="p-2 rounded-lg bg-slate-800 hover:bg-[#0B63F6] text-slate-400 hover:text-white transition-colors">
              <Facebook size={15} />
            </a>
          </div>
        </div>

        {/* Col 2: Services Quick links */}
        <div className="lg:col-span-2.5 space-y-4 text-xs">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Solutions</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><button onClick={() => onNavigate("services")} className="hover:text-white transition-colors">Custom Websites</button></li>
            <li><button onClick={() => onNavigate("services")} className="hover:text-white transition-colors">iOS & Android Apps</button></li>
            <li><button onClick={() => onNavigate("services")} className="hover:text-white transition-colors">Enterprise CRM & ERP</button></li>
            <li><button onClick={() => onNavigate("services")} className="hover:text-white transition-colors">SaaS Product Builds</button></li>
            <li><button onClick={() => onNavigate("services")} className="hover:text-white transition-colors">AI & Automations</button></li>
          </ul>
        </div>

        {/* Col 3: Industries */}
        <div className="lg:col-span-2.5 space-y-4 text-xs">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expertise</h4>
          <ul className="space-y-2.5 text-slate-400">
            <li><button onClick={() => onNavigate("industries")} className="hover:text-white transition-colors">Healthcare Systems</button></li>
            <li><button onClick={() => onNavigate("industries")} className="hover:text-white transition-colors">Fintech Ledger Cores</button></li>
            <li><button onClick={() => onNavigate("industries")} className="hover:text-white transition-colors">Supply Chain Logistics</button></li>
            <li><button onClick={() => onNavigate("industries")} className="hover:text-white transition-colors">E-Commerce Platforms</button></li>
            <li><button onClick={() => onNavigate("industries")} className="hover:text-white transition-colors">Startups & B2B SaaS</button></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="lg:col-span-3 space-y-4">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscribe to Journal</h4>
          <p className="text-slate-400 text-xs leading-relaxed">
            Get technical architecture bulletins, system audit guides, and pricing disclosures delivered monthly.
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-2 text-xs">
            <div className="relative">
              <input
                id="newsletter-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full bg-[#0b1424] border border-slate-800 focus:border-[#0B63F6] rounded-xl pl-3.5 pr-12 py-3 text-xs outline-none text-white placeholder-slate-500"
              />
              <button
                id="newsletter-submit-btn"
                type="submit"
                disabled={status === "submitting"}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#0B63F6] hover:bg-blue-600 rounded-lg text-white disabled:bg-blue-400 cursor-pointer"
              >
                {status === "submitting" ? <Check size={12} className="animate-spin" /> : <Send size={12} />}
              </button>
            </div>

            {status === "success" && (
              <p id="newsletter-success" className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <Check size={11} /> Successfully subscribed!
              </p>
            )}
            {status === "error" && (
              <p id="newsletter-error" className="text-red-400 text-[10px] font-semibold">
                Failed to subscribe. Please try again.
              </p>
            )}
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-slate-500 font-medium">
        <p>© {currentYear} Webtrivo Technologies. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Configurations</a>
        </div>
      </div>
    </footer>
  );
}
