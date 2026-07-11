import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Laptop, Smartphone, Calendar, ArrowRight, ExternalLink, Activity, Target, Check } from "lucide-react";
import { PortfolioItem } from "../types";

interface PortfolioProps {
  portfolio: PortfolioItem[];
}

export default function Portfolio({ portfolio }: PortfolioProps) {
  const [filter, setFilter] = useState("All");
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const categories = ["All", "ERP & Fintech", "Mobile App & AI Solutions", "SaaS & CRM Development"];

  const filteredItems = filter === "All"
    ? portfolio
    : portfolio.filter(item => item.category.toLowerCase().includes(filter.split("&")[0].trim().toLowerCase().split(" ")[0]));

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl space-y-2">
            <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase">Our Case Studies</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
              Products We Engineered
            </h2>
          </div>
          
          {/* Categories tab filter */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/40">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`portfolio-filter-${cat.replace(/\s+/g, "-")}`}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  filter === cat
                    ? "bg-[#0B63F6] text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="bg-slate-50/50 rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:bg-white transition-all duration-300 group"
              >
                <div className="space-y-6">
                  {/* Laptop/Phone CSS Device Mockup Container */}
                  <div className="bg-[#0E1B31] rounded-2xl h-[180px] w-full relative overflow-hidden flex items-center justify-center p-4 border border-slate-800 shadow-inner group-hover:scale-[1.02] transition-transform duration-300">
                    {/* Device style */}
                    {item.mockupType === "dashboard" || item.mockupType === "laptop" ? (
                      /* CSS Laptop Screen */
                      <div className="w-[85%] h-[80%] rounded-lg bg-slate-900 border-2 border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col">
                        <div className="bg-slate-800 h-3 px-2 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="p-3 space-y-1.5 flex-1 bg-slate-950 font-mono text-[8px] text-blue-400">
                          <p className="text-white font-bold">[{item.title.toUpperCase()} SERVER]</p>
                          <p className="text-slate-500">Initializing clusters ...</p>
                          <p className="text-emerald-400">&gt; Database operational 100%</p>
                          <p className="text-[#19B5FE]">&gt; Metric: {item.metricValue} {item.metricLabel}</p>
                        </div>
                      </div>
                    ) : (
                      /* CSS Phone Screen */
                      <div className="w-[80px] h-[150px] rounded-2xl bg-slate-900 border-3 border-slate-700 shadow-2xl relative overflow-hidden flex flex-col p-1">
                        <div className="w-12 h-2.5 bg-slate-800 rounded-full mx-auto mb-1"></div>
                        <div className="flex-1 bg-[#0b1424] p-1.5 flex flex-col justify-between rounded-lg">
                          <span className="text-[6px] font-bold text-white leading-none">{item.title} App</span>
                          <div className="h-10 w-full bg-[#0B63F6]/20 rounded flex items-center justify-center text-[#19B5FE] text-[10px] font-bold">
                            {item.metricValue}
                          </div>
                          <span className="text-[5px] text-slate-400 block text-center">HIPAA Compliant</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Panel */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-slate-400 text-[10px] flex items-center gap-1 font-semibold">
                        <Calendar size={11} /> {item.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0E1B31]">{item.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{item.description}</p>
                  </div>
                </div>

                {/* Tech & Action */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-1">
                    {item.techStack.map(tech => (
                      <span key={tech} className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-mono font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {/* Performance highlight */}
                    <div className="flex items-center gap-1.5 text-[#0B63F6]">
                      <Activity size={14} className="animate-pulse" />
                      <span className="text-xs font-extrabold">{item.metricValue}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{item.metricLabel}</span>
                    </div>

                    <button
                      id={`view-project-btn-${item.id}`}
                      onClick={() => setActiveItem(item)}
                      className="text-xs font-bold text-[#0E1B31] hover:text-[#0B63F6] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Case Details <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Case Details Popup Drawer */}
      <AnimatePresence>
        {activeItem && (
          <div id="case-study-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItem(null)}
              className="absolute inset-0"
            />

            <motion.div
              id="case-study-details"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[85vh] space-y-6"
            >
              <button
                id="close-case-study"
                onClick={() => setActiveItem(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <ExternalLink size={18} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[#0B63F6] text-xs font-bold uppercase tracking-wider">{activeItem.category} Case Study</span>
                  <h3 className="text-2xl font-extrabold text-[#0E1B31] mt-1">{activeItem.title}</h3>
                  <p className="text-slate-400 text-xs font-medium mt-1">Client: {activeItem.client} • Duration: {activeItem.duration}</p>
                </div>

                {/* Challenges & Solutions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Target size={13} className="text-red-500" />
                      The Challenge
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{activeItem.challenge}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Check size={13} className="text-emerald-500" />
                      Our Custom Solution
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{activeItem.solution}</p>
                  </div>
                </div>

                {/* KPI Metrics */}
                <div className="bg-[#0E1B31] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-800">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client Business Impact</p>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-sm">{activeItem.results}</p>
                  </div>
                  <div className="bg-[#0b1424] px-6 py-4 rounded-xl border border-slate-800 flex flex-col items-center shrink-0">
                    <span className="text-3xl font-extrabold text-[#19B5FE]">{activeItem.metricValue}</span>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 mt-1">{activeItem.metricLabel}</span>
                  </div>
                </div>

                {/* Tech stack */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeItem.techStack.map(tech => (
                      <span key={tech} className="bg-slate-100 text-slate-700 text-xs font-mono font-medium px-3 py-1 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  id="close-case-study-btn"
                  onClick={() => setActiveItem(null)}
                  className="bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  Close Case Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
