import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, Map, Pin, Upload, Loader2 } from "lucide-react";
import { SiteSettings } from "../types";

const isApiEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_API === "true";

interface ContactProps {
  settings: SiteSettings;
}

export default function Contact({ settings }: ContactProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget: "",
    projectType: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setLoading(true);
    try {
      if (!isApiEnabled) {
        const subject = `Project inquiry from ${formData.name}`;
        const body = [
          `Name: ${formData.name}`,
          `Email: ${formData.email}`,
          `Phone: ${formData.phone}`,
          `Company: ${formData.company}`,
          `Budget: ${formData.budget}`,
          `Project Type: ${formData.projectType}`,
          "",
          formData.message,
        ].join("\n");
        window.location.href = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          budget: "",
          projectType: "",
          message: "",
        });
        setFileName("");
        return;
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          fileUrl: fileName ? `https://storage.webtrivo.com/invoices/${fileName}` : "",
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          budget: "",
          projectType: "",
          message: "",
        });
        setFileName("");
      }
    } catch (err) {
      console.warn("Error submitting contact inquiry", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerDirectWhatsApp = () => {
    const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, "");
    const text = `Hello Webtrivo Technologies,

I want to discuss my project.`;
    window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Grid */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase mb-2">Partner with Us</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
            Let's Launch Your Next Venture
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Inquiries are evaluated by our solution engineers within 4 hours. Complete the secure lead portal below or chat directly on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Contact Form Column */}
          <div className="lg:col-span-7 bg-slate-50/50 p-8 rounded-3xl border border-slate-100/80 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {success ? (
                /* Success Screen */
                <motion.div
                  id="contact-success-view"
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-5"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} className="animate-bounce" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0E1B31]">Inquiry Received Successfully!</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Webtrivo. We have dispatched a simulated transaction log to **{settings.contactEmail}**. An advisory solutions engineer will coordinate a callback within 4 hours.
                    </p>
                  </div>
                  <button
                    id="reset-contact-form"
                    onClick={() => setSuccess(false)}
                    className="text-xs font-bold text-[#0B63F6] hover:underline"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                /* Interactive Form Screen */
                <form id="lead-capture-form" key="form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name *</label>
                      <input
                        id="contact-name-input"
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address *</label>
                      <input
                        id="contact-email-input"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. john@company.com"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input
                        id="contact-phone-input"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +1 555-0199"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Company Name</label>
                      <input
                        id="contact-company-input"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. Acme Corp"
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Estimated Budget</label>
                      <select
                        id="contact-budget-select"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors text-slate-600"
                      >
                        <option value="">Select Range...</option>
                        <option value="<$5,000">&lt; $5,000</option>
                        <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                        <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                        <option value="$50,000+">$50,000+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Project Core Focus</label>
                      <select
                        id="contact-project-select"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors text-slate-600"
                      >
                        <option value="">Select Category...</option>
                        <option value="Website Development">Custom Website Development</option>
                        <option value="Mobile App Development">iOS / Android Mobile App</option>
                        <option value="CRM & ERP Systems">Enterprise CRM or ERP Systems</option>
                        <option value="AI Solutions & Automation">AI Solutions & Automation</option>
                        <option value="SaaS Product Engineering">SaaS Engineering</option>
                        <option value="Dedicated Developers">Dedicated Staff Staffing</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Upload System Brief / Mockups (Optional)</label>
                    <div className="relative border border-dashed border-slate-200 hover:border-[#0B63F6] rounded-xl p-4 flex flex-col items-center justify-center bg-white transition-colors cursor-pointer">
                      <input
                        id="contact-file-input"
                        type="file"
                        accept=".pdf,.png,.jpg,.doc"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload size={18} className="text-slate-400 mb-1.5" />
                      <span className="text-[11px] text-slate-600 font-bold">
                        {fileName ? fileName : "Drag & drop files or browse files"}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5">PDF, PNG, JPG, or DOC (Max 10MB)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Project Goals *</label>
                    <textarea
                      id="contact-message-input"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Outline your target platforms, database goals, and performance expectations..."
                      className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] transition-colors"
                    />
                  </div>

                  <button
                    id="submit-contact-form"
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-[#0B63F6] hover:bg-blue-600 disabled:bg-blue-400 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/15 cursor-pointer transition-colors"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Analyzing System Architecture...
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Dispatched Secure Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Business Cards Panel */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Card */}
            <div className="bg-[#0E1B31] text-white p-6 rounded-3xl border border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Webtrivo headquarters</h3>
                <p className="text-slate-400 text-xs">Direct coordinates for technical advisories.</p>
              </div>

              <div className="space-y-4 text-xs">
                <a
                  id="mailto-email-link"
                  href={`mailto:${settings.contactEmail}?subject=New%20Project%20Inquiry`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0b1424] hover:bg-[#12203b] border border-slate-800 transition-colors"
                >
                  <Mail className="text-[#19B5FE]" size={16} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Email Inquiry</p>
                    <p className="font-semibold">{settings.contactEmail}</p>
                  </div>
                </a>

                <div
                  id="whatsapp-chat-link"
                  onClick={triggerDirectWhatsApp}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-colors cursor-pointer"
                >
                  <MessageSquare className="text-[#25D366]" size={16} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">WhatsApp Chat</p>
                    <p className="font-semibold text-[#25D366]">Chat with advisory staff</p>
                  </div>
                </div>

                <a
                  id="telephone-call-link"
                  href={`tel:${settings.phoneNumber}`}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0b1424] hover:bg-[#12203b] border border-slate-800 transition-colors"
                >
                  <Phone className="text-emerald-400" size={16} />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Direct Call</p>
                    <p className="font-semibold">{settings.phoneNumber}</p>
                  </div>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center gap-4 text-xs">
                <div className="flex gap-2.5 items-start">
                  <MapPin size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Location</p>
                    <p className="text-slate-300 mt-0.5 font-medium leading-normal text-[11px]">{settings.address}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 items-start text-xs">
                <Clock size={16} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Office Working Hours</p>
                  <p className="text-slate-300 mt-0.5 font-medium text-[11px]">{settings.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Noida Sector 62 Interactive CSS Map Mockup */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 overflow-hidden space-y-3 relative h-[240px] flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between z-10">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Map size={13} className="text-slate-400" />
                  Noida, India Cluster Map
                </span>
                <span className="text-[8px] bg-emerald-100 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-bold">PHYSICAL HUBS</span>
              </div>

              {/* Pure CSS Map Design */}
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200 select-none overflow-hidden rounded-3xl">
                {/* CSS Roads */}
                <div className="absolute w-[200%] h-4 bg-white/70 rotate-12 top-1/3"></div>
                <div className="absolute w-[200%] h-6 bg-white/70 -rotate-45 top-1/2"></div>
                <div className="absolute h-[200%] w-5 bg-white/70 left-1/4"></div>
                <div className="absolute h-[200%] w-3 bg-white/70 right-1/3"></div>
                
                {/* CSS Parks */}
                <div className="absolute w-24 h-24 bg-emerald-100/60 rounded-full blur-sm top-1/4 left-1/3"></div>
                <div className="absolute w-36 h-20 bg-emerald-100/50 rounded-2xl blur-xs bottom-1/10 right-1/10"></div>
                
                {/* CSS Buildings blocks */}
                <div className="absolute w-12 h-10 bg-slate-300 rounded top-10 left-10 border border-slate-400/20"></div>
                <div className="absolute w-16 h-8 bg-slate-300 rounded bottom-12 left-12 border border-slate-400/20"></div>
                <div className="absolute w-14 h-12 bg-slate-300 rounded top-12 right-20 border border-slate-400/20"></div>

                {/* Pulsing Noida Office Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <span className="relative flex h-5 h-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-[#0B63F6] border-2 border-white items-center justify-center">
                      <Pin size={10} className="text-white fill-current" />
                    </span>
                  </span>
                  <div className="mt-1 bg-[#0E1B31] border border-slate-800 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                    Webtrivo Technologies
                  </div>
                </div>
              </div>

              <div className="z-10 bg-white/80 backdrop-blur-xs p-2 rounded-xl text-[9px] text-slate-500 font-medium">
                402, Elite Business Hub, Sector 62, Noida, India
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
