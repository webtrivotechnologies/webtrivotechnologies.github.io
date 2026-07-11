import React, { useState } from "react";
import { MessageSquare, Send, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteSettings } from "../types";

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    country: "",
    project: "",
    budget: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStartChat = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
    
    const text = `Hello Webtrivo Technologies,

I want to discuss my project.

Name: ${formData.name || "Not specified"}
Company: ${formData.company || "Not specified"}
Country: ${formData.country || "Not specified"}
Project: ${formData.project || "Not specified"}
Budget: ${formData.budget || "Not specified"}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Dynamic Pop-up Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="whatsapp-chat-box"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="mb-4 w-[340px] rounded-2xl shadow-2xl overflow-hidden bg-white border border-slate-100"
          >
            {/* Header */}
            <div className="bg-[#0E1B31] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#0B63F6] flex items-center justify-center text-white font-bold">
                    W
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0E1B31]"></div>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Webtrivo Advisory</h4>
                  <p className="text-emerald-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                    Online • Active
                  </p>
                </div>
              </div>
              <button
                id="close-whatsapp-btn"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Form */}
            <div className="p-4 bg-slate-50 space-y-3">
              <p className="text-slate-600 text-xs leading-relaxed">
                Describe your project goals below to connect instantly with our lead technical consultant on WhatsApp.
              </p>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    id="wa-name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Doe"
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#0B63F6] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                      Company
                    </label>
                    <input
                      id="wa-company-input"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="e.g. Acme Corp"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#0B63F6] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                      Country
                    </label>
                    <input
                      id="wa-country-input"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g. USA"
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#0B63F6] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                    Project Type
                  </label>
                  <select
                    id="wa-project-select"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#0B63F6] transition-colors"
                  >
                    <option value="">Select Project Core...</option>
                    <option value="Website Development">Custom Website</option>
                    <option value="Mobile App Development">Mobile Application</option>
                    <option value="Enterprise CRM & ERP Systems">CRM / ERP Software</option>
                    <option value="SaaS Platform Engineering">SaaS Development</option>
                    <option value="AI Solutions & Chatbots">AI Chatbots & Automation</option>
                    <option value="Dedicated Technical Staffing">Dedicated Developers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-1">
                    Estimated Budget
                  </label>
                  <select
                    id="wa-budget-select"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#0B63F6] transition-colors"
                  >
                    <option value="">Select Range...</option>
                    <option value="<$5,000">&lt; $5,000</option>
                    <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                    <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                    <option value="$50,000+">$50,000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Response time: ~5 mins</span>
              <button
                id="wa-submit-chat-btn"
                onClick={handleStartChat}
                className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <Send size={12} />
                Open WhatsApp
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main floating trigger icon */}
      <motion.button
        id="whatsapp-floating-trigger"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-xl hover:bg-[#20ba59] transition-colors cursor-pointer focus:outline-none"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="animate-pulse" />}
      </motion.button>
    </div>
  );
}
