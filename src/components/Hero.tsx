import { useState, useEffect } from "react";
import { Play, Calendar, FileText, ArrowUpRight, TrendingUp, Sparkles, Users, Database, Layers, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { SiteSettings } from "../types";

interface HeroProps {
  settings: SiteSettings;
  onNavigate: (sectionId: string) => void;
  onOpenConsultation: () => void;
}

export default function Hero({ settings, onNavigate, onOpenConsultation }: HeroProps) {
  const [activeTab, setActiveTab] = useState<"crm" | "erp" | "ai">("crm");
  const [pulseCount, setPulseCount] = useState(148);

  useEffect(() => {
    // Light animated pulsing for live indicators
    const interval = setInterval(() => {
      setPulseCount((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-[#f8fafc] hero-gradient"
    >
      {/* Absolute Decorative Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-sky-300/15 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: "8s" }}></div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy Panel */}
        <div className="lg:col-span-5 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0B63F6] text-xs font-bold"
          >
            <Sparkles size={13} className="animate-spin-slow" />
            <span>Premium Product Development Agency</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0E1B31] leading-[1.1]"
          >
            Build Powerful <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B63F6] via-[#19B5FE] to-[#0B63F6] bg-300% animate-shimmer">
              Digital Products
            </span>{" "}
            That Scale
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0"
          >
            We help startups, SMBs, and enterprises build scalable websites, mobile apps, CRM, ERP, SaaS platforms, AI solutions, and custom software.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <button
              id="hero-consultation-btn"
              onClick={onOpenConsultation}
              className="flex items-center gap-2 bg-[#0B63F6] hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Calendar size={16} />
              Book Free Consultation
            </button>

            <button
              id="hero-quote-btn"
              onClick={() => onNavigate("contact")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-[#0E1B31] font-bold px-6 py-3.5 rounded-xl shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
            >
              <FileText size={16} />
              Get Free Quote
            </button>

            <button
              id="hero-portfolio-btn"
              onClick={() => onNavigate("portfolio")}
              className="flex items-center gap-2 text-slate-500 hover:text-[#0B63F6] font-semibold text-sm px-4 py-3 transition-colors cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center text-slate-500 group-hover:text-[#0B63F6] transition-all">
                <Play size={12} className="fill-current ml-0.5" />
              </div>
              Watch Our Work
            </button>
          </motion.div>

          {/* Dynamic Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 border-t border-slate-100 flex flex-wrap gap-x-8 gap-y-4 justify-center lg:justify-start text-xs text-slate-400 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Full IP Protection (NDAs)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>Dedicated Project Managers</span>
            </div>
          </motion.div>
        </div>

        {/* Right Dashboard / Graphics Panel */}
        <div className="lg:col-span-7 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 100, delay: 0.1 }}
            className="w-full max-w-[620px] rounded-3xl bg-[#0E1B31] shadow-2xl overflow-hidden border border-slate-800 blue-glow"
          >
            {/* Window Chrome Header */}
            <div className="bg-[#0b1424] px-5 py-3.5 flex items-center justify-between border-b border-slate-800/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              {/* Tabs */}
              <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                <button
                  id="tab-crm"
                  onClick={() => setActiveTab("crm")}
                  className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors cursor-pointer ${
                    activeTab === "crm"
                      ? "bg-[#0B63F6] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sales CRM
                </button>
                <button
                  id="tab-erp"
                  onClick={() => setActiveTab("erp")}
                  className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors cursor-pointer ${
                    activeTab === "erp"
                      ? "bg-[#0B63F6] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  ERP Analytics
                </button>
                <button
                  id="tab-ai"
                  onClick={() => setActiveTab("ai")}
                  className={`px-3 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md transition-colors cursor-pointer ${
                    activeTab === "ai"
                      ? "bg-[#0B63F6] text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  AI Agent
                </button>
              </div>
              <div className="text-slate-400 text-[10px] font-mono select-none">
                v2.6.4
              </div>
            </div>

            {/* Dashboard Body Frame */}
            <div className="p-6 text-white min-h-[340px] flex flex-col justify-between">
              {/* Conditional Tab Rendering */}
              {activeTab === "crm" && (
                <div id="crm-tab-view" className="space-y-6">
                  {/* CRM Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">Pipeline Revenue</p>
                      <h3 className="text-lg font-bold mt-1 text-[#19B5FE]">$842,500</h3>
                      <p className="text-emerald-400 text-[9px] flex items-center gap-0.5 mt-1 font-mono">
                        <TrendingUp size={10} /> +18.4%
                      </p>
                    </div>
                    <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">Active Leads</p>
                      <h3 className="text-lg font-bold mt-1">{pulseCount}</h3>
                      <p className="text-emerald-400 text-[9px] flex items-center gap-0.5 mt-1 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> live sync
                      </p>
                    </div>
                    <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800">
                      <p className="text-slate-400 text-[10px] font-medium tracking-wide uppercase">Closed Deals</p>
                      <h3 className="text-lg font-bold mt-1 text-emerald-400">92%</h3>
                      <p className="text-slate-400 text-[9px] mt-1 font-mono">Q3 Performance</p>
                    </div>
                  </div>

                  {/* SVG Chart Line */}
                  <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-slate-300 text-xs font-semibold">Deal Conversion Forecast</p>
                      <span className="text-[10px] text-slate-400 font-mono">Oct - Mar (Monthly)</span>
                    </div>
                    <div className="h-32 w-full pt-4 relative">
                      <svg viewBox="0 0 400 100" className="w-full h-full">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0B63F6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#0B63F6" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        {/* Area */}
                        <path d="M 0 80 Q 80 50 160 65 T 320 20 T 400 10 L 400 100 L 0 100 Z" fill="url(#chartGrad)"/>
                        {/* Line */}
                        <path d="M 0 80 Q 80 50 160 65 T 320 20 T 400 10" fill="none" stroke="#0B63F6" strokeWidth="3" strokeLinecap="round"/>
                        {/* Dynamic indicators */}
                        <circle cx="320" cy="20" r="5" fill="#19B5FE"/>
                        <circle cx="160" cy="65" r="4" fill="#0B63F6"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "erp" && (
                <div id="erp-tab-view" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                      <Database size={14} className="text-blue-400" />
                      Global Inventory Logistics
                    </p>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">cluster-on</span>
                  </div>

                  {/* ERP Grid Layout */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800 space-y-3">
                      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">Warehouse Fulfillment</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">98.2%</span>
                        <span className="text-xs text-emerald-400 mb-1">Perfect SLA</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "98.2%" }}></div>
                      </div>
                    </div>
                    <div className="bg-[#0b1424] p-4 rounded-xl border border-slate-800 space-y-3">
                      <p className="text-slate-400 text-[10px] font-medium uppercase tracking-wide">Transit Delivery Speed</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold">14.2 hr</span>
                        <span className="text-xs text-[#19B5FE] mb-1">Average</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#0B63F6] h-full rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>

                  {/* ERP Log Queue */}
                  <div className="bg-[#0b1424] rounded-xl border border-slate-800 p-3 font-mono text-[9px] text-slate-400 space-y-1.5">
                    <div className="flex justify-between border-b border-slate-800/60 pb-1 mb-1">
                      <span>ERP PROCESSOR LOGS</span>
                      <span className="text-emerald-400">ONLINE</span>
                    </div>
                    <p className="text-[#19B5FE]">[INFO] 05:08:28 - Loading cross-dock route schema नोएडा to Berlin...</p>
                    <p className="text-slate-300">[COMPLETED] - Order #WT-9428 fully fulfilled & invoiced (Stripe SDK)</p>
                    <p className="text-yellow-400">[WARN] - Transit node AZ-90 latency higher than threshold, rerouting...</p>
                    <p className="text-emerald-400">[SUCCESS] - Cluster-3 synced with backup PostgreSQL database safely</p>
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <div id="ai-tab-view" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#19B5FE]" />
                      Webtrivo AI Core Agent
                    </p>
                    <span className="text-[10px] text-[#19B5FE] font-mono">Gemini-3.5-Flash</span>
                  </div>

                  {/* Interactive Assistant Simulator */}
                  <div className="bg-[#0b1424] rounded-2xl border border-slate-800 p-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <Users size={14} />
                      </div>
                      <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none">
                        <p className="text-[11px] font-medium leading-relaxed">
                          "I need an enterprise eCommerce platform with customized inventory logs and a real-time analytics dashboard."
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <div className="bg-[#0B63F6]/90 p-3 rounded-2xl rounded-tr-none text-right max-w-[85%]">
                        <p className="text-[11px] font-semibold flex items-center justify-end gap-1 mb-1">
                          Webtrivo AI <Sparkles size={11} />
                        </p>
                        <p className="text-[11px] leading-relaxed text-slate-100">
                          "Excellent! We recommend a **Laravel API core** with **Next.js & Tailwind frontend** for high-speed SEO. Subscriptions handled via Stripe, and database clustered on PostgreSQL."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 border border-slate-700 font-mono">Cognitive Autopilot</span>
                    <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 border border-slate-700 font-mono">Smart Proposal Tool</span>
                    <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-300 border border-slate-700 font-mono">SLA Auto-Generator</span>
                  </div>
                </div>
              )}

              {/* Decorative Card Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-slate-400 text-[10px]">
                <span className="flex items-center gap-1">
                  <Database size={12} className="text-[#19B5FE]" /> Secured with SSL & End-to-End Encryption
                </span>
                <span className="flex items-center gap-1.5 cursor-pointer hover:text-white" onClick={() => onNavigate("contact")}>
                  Talk to Architect <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Floating CRM Mini Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="absolute -right-6 top-10 glass-card p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3.5 z-10 w-48"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0B63F6]">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Client Onboarded</p>
              <h4 className="text-sm font-bold text-slate-800">100+ Global SMBs</h4>
            </div>
          </motion.div>

          {/* Floating CRM Mini Card 2 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="absolute -left-6 bottom-10 glass-card p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3.5 z-10 w-48"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Success Rating</p>
              <h4 className="text-sm font-bold text-slate-800">95% Satisfaction</h4>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
