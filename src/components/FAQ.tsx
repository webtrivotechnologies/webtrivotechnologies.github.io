import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Search, HelpCircle, X } from "lucide-react";
import { FaqItem } from "../types";

interface FAQProps {
  faqs: FaqItem[];
}

export default function FAQ({ faqs }: FAQProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["All", "Process", "Legal & Security", "Staffing", "Support"];

  // Search & Category Filtering logic
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="faq" className="py-24 bg-slate-50/40">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center space-y-3 mb-12">
          <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase">Common Questions</p>
          <h2 className="text-3xl font-extrabold text-[#0E1B31] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Find immediate answers regarding our transparent onboarding, system security, source code ownership, and ongoing technical support agreements.
          </p>
        </div>

        {/* Search Bar & Categories Grid */}
        <div className="space-y-6 mb-10">
          <div className="relative">
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., NDA, support, pricing)..."
              className="w-full bg-white border border-slate-200 focus:border-[#0B63F6] rounded-2xl pl-12 pr-10 py-4 text-sm outline-none shadow-sm transition-all text-[#0E1B31]"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            {searchQuery && (
              <button
                id="clear-faq-search"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`faq-tab-${cat.replace(/\s+/g, "-")}`}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedId(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0E1B31] text-white border-[#0E1B31] shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <motion.div
                  key={faq.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-200/60 transition-all duration-300"
                >
                  <button
                    id={`faq-trigger-${faq.id}`}
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full flex items-center justify-between text-left px-6 py-5 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle size={18} className="text-[#0B63F6] mt-0.5 shrink-0" />
                      <span className="text-sm sm:text-base font-bold text-[#0E1B31] leading-tight">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-300 shrink-0 ${
                        expandedId === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {expandedId === faq.id && (
                      <motion.div
                        id={`faq-content-${faq.id}`}
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden bg-slate-50/50 border-t border-slate-50"
                      >
                        <div className="px-6 py-5 text-slate-600 text-xs sm:text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div id="no-faqs-found" className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                <HelpCircle size={36} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-500 font-medium text-sm">No FAQs matched your search terms.</p>
                <button
                  id="reset-faq-filters"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="text-xs text-[#0B63F6] font-bold mt-2 hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
