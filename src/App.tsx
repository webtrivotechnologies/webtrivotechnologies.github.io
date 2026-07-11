import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, CheckCircle2, X, Send, Loader2, ChevronRight } from "lucide-react";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Services from "./components/Services";
import Industries from "./components/Industries";
import Process from "./components/Process";
import Portfolio from "./components/Portfolio";
import FAQ from "./components/FAQ";
import Career from "./components/Career";
import Blog from "./components/Blog";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import AdminPanel from "./components/AdminPanel";
import dbSeed from "../data/db.json";

// Types
import { CMSData, SiteSettings } from "./types";

const isApiEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_API === "true";
const cmsSeed = dbSeed as CMSData;
const staticCmsData: Omit<CMSData, "inquiries" | "subscribers"> = {
  portfolio: cmsSeed.portfolio,
  services: cmsSeed.services,
  blogs: cmsSeed.blogs.filter((blog) => blog.published),
  testimonials: cmsSeed.testimonials,
  faqs: cmsSeed.faqs,
  careers: cmsSeed.careers.filter((career) => career.active),
  settings: cmsSeed.settings,
};

// Dynamic backup client-side fallback data (ensuring 100% layout uptime)
const defaultBackupSettings: SiteSettings = {
  companyName: "Webtrivo Technologies",
  tagline: "Building Digital Products That Scale",
  primaryEmail: "info@webtrivo.com",
  contactEmail: "ritesh2001stm@gmail.com",
  whatsappNumber: "+917004183842",
  phoneNumber: "+917004183842",
  address: "402, Elite Business Hub, Sector 62, Noida, India",
  workingHours: "Mon - Fri: 9:00 AM - 7:00 PM (IST)",
  seoTitle: "Webtrivo Technologies | Premium Software Agency",
  seoDescription: "We build scalable websites, mobile apps, CRM, ERP, and AI solutions.",
  seoKeywords: "software development, SaaS, mobile apps",
  bookMeetingUrl: "https://calendly.com/webtrivo/consultation"
};

export default function App() {
  const [cmsData, setCmsData] = useState<Omit<CMSData, "inquiries" | "subscribers"> | null>(staticCmsData);
  const [activeSection, setActiveSection] = useState("hero");
  const [adminOpen, setAdminOpen] = useState(false);
  
  // Consultation Scheduling Modal States
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [schedName, setSchedName] = useState("");
  const [schedEmail, setSchedEmail] = useState("");
  const [schedProject, setSchedProject] = useState("");
  const [schedStatus, setSchedStatus] = useState<"idle" | "booking" | "success">("idle");

  const loadCmsData = async () => {
    if (!isApiEnabled) {
      setCmsData(staticCmsData);
      return;
    }

    try {
      const response = await fetch("/api/cms");
      if (response.ok) {
        const data = await response.json();
        setCmsData(data);
      }
    } catch (err) {
      console.warn("Failed to retrieve CMS content from backend, using static content.", err);
      setCmsData(staticCmsData);
    }
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  // Update dynamic page headers (SEO injection) dynamically from database configurations
  useEffect(() => {
    if (cmsData?.settings) {
      document.title = cmsData.settings.seoTitle || "Webtrivo Technologies";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", cmsData.settings.seoDescription || "");
      }
    }
  }, [cmsData]);

  // Section visibility tracker for dynamic active navbar links
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "services", "industries", "portfolio", "process", "careers", "blog", "contact"];
      const scrollPos = window.scrollY + 160;

      for (const sect of sections) {
        const el = document.getElementById(sect);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sect);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 85,
        behavior: "smooth"
      });
      setActiveSection(sectionId);
    }
  };

  // Schedule Free Consultation (Mock Calendly Core)
  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedName || !schedEmail || !selectedDate || !selectedTime) return;

    setSchedStatus("booking");
    try {
      if (!isApiEnabled) {
        setSchedStatus("success");
        setTimeout(() => {
          setSchedStatus("idle");
          setConsultationOpen(false);
          setSelectedDate(null);
          setSelectedTime(null);
          setSchedName("");
          setSchedEmail("");
          setSchedProject("");
        }, 3000);
        return;
      }

      // Post to our inquiry backend, creating a CRM inquiry lead item!
      const msg = `Scheduled Free Strategy Consultation.\nDate: ${selectedDate}\nTime Slot: ${selectedTime}\nTarget Topic: ${schedProject || "Core software audit"}`;
      
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: schedName,
          email: schedEmail,
          phone: "Meeting Scheduled",
          company: "Consultation Call",
          budget: "Consultation Audit",
          projectType: "Consultation Call",
          message: msg
        }),
      });

      if (response.ok) {
        setSchedStatus("success");
        setTimeout(() => {
          setSchedStatus("idle");
          setConsultationOpen(false);
          setSelectedDate(null);
          setSelectedTime(null);
          setSchedName("");
          setSchedEmail("");
          setSchedProject("");
        }, 3000);
      }
    } catch (err) {
      console.error("Error booking consultation", err);
      setSchedStatus("idle");
    }
  };

  // Mock available dates relative to Noida working days
  const availableDates = ["July 13, 2026", "July 14, 2026", "July 15, 2026", "July 16, 2026", "July 17, 2026"];
  const availableSlots = ["2:00 PM IST", "3:30 PM IST", "5:00 PM IST", "6:30 PM IST"];

  const settings = cmsData?.settings || defaultBackupSettings;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Dynamic Navigation Header */}
      <Header
        settings={settings}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenConsultation={() => setConsultationOpen(true)}
      />

      {/* Main Single-screen Sections Flow */}
      <main>
        <Hero
          settings={settings}
          onNavigate={handleNavigate}
          onOpenConsultation={() => setConsultationOpen(true)}
        />
        
        <Stats />

        <Services
          services={cmsData?.services || []}
          settings={settings}
          onNavigate={handleNavigate}
        />

        <Industries />

        <Portfolio portfolio={cmsData?.portfolio || []} />

        <Process />

        <Blog blogs={cmsData?.blogs || []} />

        <Career careers={cmsData?.careers || []} />

        <FAQ faqs={cmsData?.faqs || []} />

        <Contact settings={settings} />
      </main>

      {/* Corporate Navigational Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />

      {/* Floating Interactive WhatsApp trigger */}
      <FloatingWhatsApp settings={settings} />

      {/* Back-office Administrative CMS Panel Overlay */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            onClose={() => setAdminOpen(false)}
            onRefreshCms={loadCmsData}
          />
        )}
      </AnimatePresence>

      {/* Custom Calendly Free Consultation Modal */}
      <AnimatePresence>
        {consultationOpen && (
          <div id="consultation-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setConsultationOpen(false)} />
            
            <motion.div
              id="consultation-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button
                id="close-consultation-modal"
                onClick={() => setConsultationOpen(false)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[#0B63F6] text-xs font-bold uppercase tracking-wider">Solutions Advisory</p>
                <h3 className="text-xl font-extrabold text-[#0E1B31]">Schedule 30-Min Strategy Audit</h3>
                <p className="text-slate-400 text-xs">Pick an open timeslot to connect with Webtrivo lead architects.</p>
              </div>

              {schedStatus === "success" ? (
                /* Success screen */
                <motion.div
                  id="consultation-success-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0E1B31]">Meeting Scheduled Successfully!</h4>
                    <p className="text-xs text-slate-500 mt-2.5 max-w-xs mx-auto leading-relaxed">
                      Your strategy session is scheduled for **{selectedDate}** at **{selectedTime}**. An invite, video conference coordinates, and transaction receipt are dispatched.
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Interactive calendar picker forms */
                <form id="consultation-scheduler-form" onSubmit={handleConsultationSubmit} className="space-y-4 text-xs">
                  
                  {/* Step 1: Select date */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar size={12} /> 1. Select Available Date (IST Zone)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableDates.map(date => (
                        <button
                          key={date}
                          id={`date-slot-${date.replace(/[\s,]+/g, "-")}`}
                          type="button"
                          onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                          className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-colors ${
                            selectedDate === date
                              ? "bg-[#0B63F6] text-white border-[#0B63F6] shadow-sm"
                              : "bg-slate-50 text-slate-600 border-slate-200/60 hover:border-slate-300"
                          }`}
                        >
                          {date.split(",")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Select timeslot */}
                  {selectedDate && (
                    <motion.div
                      id="timeslot-picker"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Clock size={12} /> 2. Pick Open Timeslot
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSlots.map(slot => (
                          <button
                            key={slot}
                            id={`time-slot-${slot.replace(/\s+/g, "-")}`}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`p-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-colors ${
                              selectedTime === slot
                                ? "bg-[#0B63F6] text-white border-[#0B63F6] shadow-sm"
                                : "bg-slate-50 text-slate-600 border-slate-200/60 hover:border-slate-300"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Contact coordinates */}
                  {selectedTime && (
                    <motion.div
                      id="meeting-contact-fields"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3.5 pt-2 border-t border-slate-100"
                    >
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Name</label>
                          <input
                            id="sched-name-input"
                            type="text"
                            required
                            value={schedName}
                            onChange={(e) => setSchedName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0B63F6]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email Coordinates</label>
                          <input
                            id="sched-email-input"
                            type="email"
                            required
                            value={schedEmail}
                            onChange={(e) => setSchedEmail(e.target.value)}
                            placeholder="e.g. john@company.com"
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0B63F6]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">What challenges should we focus on? (Optional)</label>
                        <input
                          id="sched-project-input"
                          type="text"
                          value={schedProject}
                          onChange={(e) => setSchedProject(e.target.value)}
                          placeholder="e.g. scaling Next.js ERP bottlenecks, HIPAA checkups..."
                          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#0B63F6]"
                        />
                      </div>

                      <button
                        id="confirm-scheduling-btn"
                        type="submit"
                        disabled={schedStatus === "booking"}
                        className="w-full flex items-center justify-center gap-2 bg-[#0B63F6] hover:bg-blue-600 disabled:bg-blue-400 text-white text-xs font-bold py-3 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer"
                      >
                        {schedStatus === "booking" ? (
                          <>
                            <Loader2 size={12} className="animate-spin" /> Reserving Timeslot...
                          </>
                        ) : (
                          <>
                            Confirm Strategy Booking <ChevronRight size={14} />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
