import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { ServiceItem, SiteSettings } from "../types";

interface ServicesProps {
  services: ServiceItem[];
  settings: SiteSettings;
  onNavigate: (sectionId: string) => void;
}

export default function Services({ services, settings, onNavigate }: ServicesProps) {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const getIconComponent = (iconName: string) => {
    // Dynamically retrieve lucide icon or fallback to default
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
    return <Icon size={24} />;
  };

  const triggerWhatsAppForService = (service: ServiceItem) => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
    const text = `Hello Webtrivo Technologies,

I am interested in your service: ${service.title}.
I'd like to schedule a call to review my project requirements.

Service: ${service.title}
Estimated Timeline: ASAP`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${cleanNumber}?text=${encodedText}`, "_blank");
  };

  return (
    <section id="services" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase mb-2">Our Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
            High-Performance Software Engineering
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            We deliver state-of-the-art architectures, gorgeous UI/UX, and fast load times to guarantee long-term competitive advantages.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setSelectedService(service)}
              className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group h-[280px]"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center group-hover:bg-[#0B63F6] group-hover:text-white transition-all duration-300">
                  {getIconComponent(service.icon)}
                </div>
                <h3 className="text-lg font-bold text-[#0E1B31] mt-5 group-hover:text-[#0B63F6] transition-colors">
                  {service.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-2.5 line-clamp-3">
                  {service.shortDescription}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#0B63F6]">
                <span>Explore Capabilities</span>
                <span className="group-hover:translate-x-1.5 transition-transform">→</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#0E1B31] to-[#1a2d4b] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Need a customized architecture strategy?</h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Schedule a 30-minute free technical audit with our lead solutions architect to design your optimal software roadmap.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 justify-center">
            <button
              id="services-consultation-btn"
              onClick={() => triggerWhatsAppForService({ title: "Custom Consultation" } as ServiceItem)}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              Chat on WhatsApp
            </button>
            <button
              id="services-contact-btn"
              onClick={() => onNavigate("contact")}
              className="bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Component Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div id="service-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0"
            />
            
            <motion.div
              id="service-details-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col justify-between overflow-y-auto"
            >
              <button
                id="close-service-modal"
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              >
                <LucideIcons.X size={20} />
              </button>

              <div className="space-y-6 pt-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0B63F6] flex items-center justify-center shadow-sm">
                  {getIconComponent(selectedService.icon)}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#0E1B31]">{selectedService.title}</h3>
                  <span className="inline-block bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {selectedService.category} Solutions
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h4>
                  <p className="text-slate-600 text-xs leading-relaxed">{selectedService.fullDescription}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Features & SLA</h4>
                  <ul className="space-y-2.5">
                    {selectedService.features.map((feat, i) => (
                      <li key={i} className="flex gap-2.5 items-start text-xs text-slate-700">
                        <LucideIcons.CheckCircle2 className="text-[#0B63F6] shrink-0 mt-0.5" size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons inside Drawer */}
              <div className="border-t border-slate-100 pt-6 mt-8 space-y-3">
                <button
                  id="service-modal-wa-btn"
                  onClick={() => triggerWhatsAppForService(selectedService)}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold py-3.5 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <LucideIcons.MessageSquare size={16} />
                  Discuss {selectedService.title} on WhatsApp
                </button>
                <button
                  id="service-modal-contact-btn"
                  onClick={() => {
                    setSelectedService(null);
                    onNavigate("contact");
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-[#0E1B31] border border-slate-200 text-xs font-bold py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Get A Free Quote
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
