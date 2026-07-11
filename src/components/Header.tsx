import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Globe, Laptop, Cpu, Server, Briefcase, Settings, ShieldCheck, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SiteSettings } from "../types";

interface HeaderProps {
  settings: SiteSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  onOpenConsultation: () => void;
}

export default function Header({
  settings,
  activeSection,
  onNavigate,
  onOpenAdmin,
  onOpenConsultation,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Services", id: "services", dropdown: "services" },
    { label: "Industries", id: "industries" },
    { label: "Portfolio", id: "portfolio" },
    { label: "Process", id: "process" },
    { label: "Careers", id: "careers" },
    { label: "Blog", id: "blog" },
    { label: "Contact", id: "contact" },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md py-4 shadow-sm border-b border-slate-100"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          id="logo-container"
          onClick={() => handleLinkClick("hero")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#0B63F6] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            W
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-[#0E1B31]">
              Webtrivo
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#19B5FE] -mt-1">
              Technologies
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.id}
              className="relative"
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.dropdown)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors cursor-pointer rounded-lg hover:bg-slate-50 ${
                  activeSection === link.id
                    ? "text-[#0B63F6]"
                    : "text-slate-600 hover:text-[#0B63F6]"
                }`}
              >
                {link.label}
                {link.dropdown && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      activeDropdown === link.dropdown ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Stripe-style Mega Dropdown */}
              {link.dropdown === "services" && (
                <AnimatePresence>
                  {activeDropdown === "services" && (
                    <motion.div
                      id="services-mega-menu"
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] rounded-2xl bg-white shadow-xl border border-slate-100 p-6 grid grid-cols-2 gap-4"
                    >
                      <div className="col-span-2 pb-2 mb-2 border-b border-slate-50">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Engineering Solutions
                        </h4>
                      </div>
                      
                      <div
                        onClick={() => handleLinkClick("services")}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-[#0B63F6] shrink-0">
                          <Globe size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0E1B31]">Web Applications</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">High performance Next.js portals</p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleLinkClick("services")}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                          <Laptop size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0E1B31]">Mobile Apps</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Butter-smooth Flutter / iOS / Android</p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleLinkClick("services")}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                          <Cpu size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0E1B31]">CRM & ERP Suites</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Enterprise operations & flow tools</p>
                        </div>
                      </div>

                      <div
                        onClick={() => handleLinkClick("services")}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                          <Server size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#0E1B31]">AI Solutions & Automation</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Smart LLM tools & custom agents</p>
                        </div>
                      </div>

                      <div className="col-span-2 mt-2 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-[#0B63F6] font-semibold hover:underline cursor-pointer" onClick={() => handleLinkClick("services")}>
                        <span>Explore all capabilities & technologies</span>
                        <span>→</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </nav>

        {/* Action Buttons */}
        <div id="header-actions" className="hidden lg:flex items-center gap-3">
          <button
            id="admin-portal-header-btn"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 hover:text-[#0B63F6] text-xs font-semibold cursor-pointer rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ShieldCheck size={14} />
            Admin Panel
          </button>
          
          <button
            id="consultation-header-btn"
            onClick={onOpenConsultation}
            className="bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            Book Free Consultation
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-700 hover:text-[#0B63F6] p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-lg"
          >
            <div className="px-6 py-4 space-y-2 flex flex-col">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  id={`mobile-link-${link.id}`}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-left py-2 px-3 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                    activeSection === link.id
                      ? "text-[#0B63F6] bg-blue-50"
                      : "text-slate-600 hover:text-[#0B63F6] hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </button>
              ))}

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  id="mobile-admin-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-slate-700 hover:text-[#0B63F6] bg-slate-100 text-sm font-semibold"
                >
                  <ShieldCheck size={16} />
                  Admin Dashboard
                </button>

                <button
                  id="mobile-consultation-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenConsultation();
                  }}
                  className="flex items-center justify-center w-full py-3 rounded-xl bg-[#0B63F6] text-white text-sm font-bold shadow-lg shadow-blue-500/10"
                >
                  Book Free Consultation
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
