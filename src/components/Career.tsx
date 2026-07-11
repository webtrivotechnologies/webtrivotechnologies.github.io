import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, MapPin, DollarSign, Clock, CheckCircle2, ChevronRight, X, Upload, Send } from "lucide-react";
import { CareerJob } from "../types";

interface CareerProps {
  careers: CareerJob[];
}

export default function Career({ careers }: CareerProps) {
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [applyJob, setApplyJob] = useState<CareerJob | null>(null);
  const [appliedStatus, setAppliedStatus] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    github: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeName(e.target.files[0].name);
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    // Simulate database submission
    setAppliedStatus(true);
    setTimeout(() => {
      setAppliedStatus(false);
      setApplyJob(null);
      setFormData({ name: "", email: "", github: "", message: "" });
      setResumeName("");
    }, 3000);
  };

  return (
    <section id="careers" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase mb-2">Join Our Team</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
            We Are Hiring Elite Talent
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Build bleeding-edge systems for international brands. 100% remote flexibility, state-of-the-art equipment stipends, and continuous growth.
          </p>
        </div>

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {careers.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-50/50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:bg-white hover:border-slate-200/50 transition-all duration-300 group"
            >
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {job.department}
                  </span>
                  <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
                    <Clock size={12} /> {job.type}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#0E1B31] group-hover:text-[#0B63F6] transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={13} /> {job.location}</span>
                    <span className="flex items-center gap-0.5"><DollarSign size={13} /> {job.salary}</span>
                  </div>
                </div>

                <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">{job.description}</p>
              </div>

              <div className="pt-8 mt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  id={`view-job-details-${job.id}`}
                  onClick={() => setSelectedJob(job)}
                  className="text-xs font-bold text-slate-600 hover:text-[#0B63F6] flex items-center gap-1 cursor-pointer transition-colors"
                >
                  View Details <ChevronRight size={14} />
                </button>
                <button
                  id={`apply-job-btn-${job.id}`}
                  onClick={() => setApplyJob(job)}
                  className="bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
                >
                  Apply Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Job Details Modal Drawer */}
      <AnimatePresence>
        {selectedJob && (
          <div id="job-details-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0"
            />
            <motion.div
              id="job-details-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[85vh] space-y-6"
            >
              <button
                id="close-job-details"
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedJob.department}</span>
                  <h3 className="text-2xl font-extrabold text-[#0E1B31] mt-2">{selectedJob.title}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1"><MapPin size={14} /> {selectedJob.location}</span>
                    <span className="flex items-center gap-0.5"><DollarSign size={14} /> {selectedJob.salary}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {selectedJob.type}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Job Description</h4>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{selectedJob.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs text-slate-700">
                          <CheckCircle2 size={14} className="text-[#0B63F6] shrink-0 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compensation & Benefits</h4>
                    <ul className="space-y-2">
                      {selectedJob.benefits.map((ben, i) => (
                        <li key={i} className="flex gap-2 items-start text-xs text-slate-700">
                          <CheckCircle2 size={14} className="text-[#0B63F6] shrink-0 mt-0.5" />
                          <span>{ben}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  id="close-job-details-btn"
                  onClick={() => setSelectedJob(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0E1B31] text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  id="job-details-apply-btn"
                  onClick={() => {
                    setApplyJob(selectedJob);
                    setSelectedJob(null);
                  }}
                  className="bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  Apply For This Role
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Application Form Drawer Modal */}
      <AnimatePresence>
        {applyJob && (
          <div id="apply-form-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApplyJob(null)}
              className="absolute inset-0"
            />
            <motion.div
              id="apply-form-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6 overflow-hidden"
            >
              <button
                id="close-apply-form"
                onClick={() => setApplyJob(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-1">
                <span className="text-[#0B63F6] text-xs font-bold uppercase tracking-wider">Application Form</span>
                <h3 className="text-xl font-bold text-[#0E1B31]">{applyJob.title}</h3>
                <p className="text-slate-400 text-xs">{applyJob.department} • {applyJob.location}</p>
              </div>

              {appliedStatus ? (
                /* Success screen */
                <motion.div
                  id="apply-success-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-100">
                    <CheckCircle2 size={36} className="animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0E1B31]">Application Received!</h4>
                    <p className="text-xs text-slate-500 mt-2.5 max-w-xs mx-auto leading-relaxed">
                      Thank you for applying. Our talent advisory team will review your profile, GitHub records, and resume and respond in 24-48 hours.
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Active Form */
                <form id="job-application-form" onSubmit={handleApplySubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                    <input
                      id="apply-name-input"
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Jane Doe"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                    <input
                      id="apply-email-input"
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. jane@example.com"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">GitHub / Portfolio URL</label>
                    <input
                      id="apply-github-input"
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      placeholder="e.g. https://github.com/janedoe"
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Upload Resume (PDF/DOC)</label>
                    <div className="relative border border-dashed border-slate-300 hover:border-[#0B63F6] rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition-colors cursor-pointer">
                      <input
                        id="apply-resume-file"
                        type="file"
                        required
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Upload size={20} className="text-slate-400 mb-1.5" />
                      <span className="text-[11px] text-slate-600 font-bold">
                        {resumeName ? resumeName : "Click or drag resume to upload"}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5">PDF or Word format only</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Message / Intro</label>
                    <textarea
                      id="apply-message-input"
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and past experience..."
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none focus:border-[#0B63F6] focus:bg-white transition-colors"
                    />
                  </div>

                  <button
                    id="submit-job-application"
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-colors"
                  >
                    <Send size={12} /> Submit Application
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
