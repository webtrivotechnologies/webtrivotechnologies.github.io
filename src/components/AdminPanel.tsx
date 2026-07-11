import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Lock,
  User,
  LogOut,
  FolderOpen,
  Settings,
  Mail,
  HelpCircle,
  Briefcase,
  Users,
  CheckCircle2,
  Trash2,
  Plus,
  Save,
  Check,
  X,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Loader2
} from "lucide-react";
import { CMSData, ContactInquiry, BlogPost, PortfolioItem, CareerJob, FaqItem, SiteSettings } from "../types";

interface AdminPanelProps {
  onClose: () => void;
  onRefreshCms: () => void;
}

export default function AdminPanel({ onClose, onRefreshCms }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // CMS Collections State
  const [db, setDb] = useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = useState<"leads" | "blogs" | "portfolio" | "careers" | "faqs" | "subscribers" | "settings">("leads");
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Form states for creating/editing items
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingPortfolio, setEditingPortfolio] = useState<Partial<PortfolioItem> | null>(null);
  const [editingJob, setEditingJob] = useState<Partial<CareerJob> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItem> | null>(null);

  useEffect(() => {
    // Check if session token exists
    const token = sessionStorage.getItem("webtrivo_admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        sessionStorage.setItem("webtrivo_admin_token", data.token);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setLoginError(data.error || "Authentication failed");
      }
    } catch (err) {
      setLoginError("Failed to connect to the backend server");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("webtrivo_admin_token");
    setIsAuthenticated(false);
    setDb(null);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("webtrivo_admin_token");
    try {
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDb(data);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch dashboard telemetry", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCMS = async (updatedDb: CMSData) => {
    setSaveStatus("saving");
    const token = sessionStorage.getItem("webtrivo_admin_token");
    try {
      const response = await fetch("/api/admin/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedDb)
      });
      if (response.ok) {
        setSaveStatus("success");
        setDb(updatedDb);
        onRefreshCms(); // Refresh client landing page view
        setTimeout(() => setSaveStatus("idle"), 2000);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      setSaveStatus("error");
    }
  };

  // Inquiry/Lead Status Update
  const handleUpdateInquiryStatus = async (id: string, status: 'new' | 'contacted' | 'qualified' | 'archived', notes: string) => {
    const token = sessionStorage.getItem("webtrivo_admin_token");
    try {
      const response = await fetch("/api/admin/inquiry/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status, notes })
      });
      if (response.ok) {
        if (db) {
          const updatedInquiries = db.inquiries.map(inq => {
            if (inq.id === id) {
              const updated = { ...inq, status, notes };
              if (selectedInquiry?.id === id) setSelectedInquiry(updated);
              return updated;
            }
            return inq;
          });
          setDb({ ...db, inquiries: updatedInquiries });
        }
      }
    } catch (err) {
      console.error("Failed to update inquiry", err);
    }
  };

  // Delete Helpers
  const handleDeleteItem = (collection: "blogs" | "portfolio" | "careers" | "faqs", id: string) => {
    if (!db) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    const updated = { ...db };
    updated[collection] = (updated[collection] as any[]).filter(item => item.id !== id);
    handleSaveCMS(updated);
  };

  // Save/Upsert handlers
  const handleSaveBlog = () => {
    if (!db || !editingBlog) return;
    const updated = { ...db };
    
    if (editingBlog.id) {
      // Edit
      updated.blogs = updated.blogs.map(b => b.id === editingBlog.id ? (editingBlog as BlogPost) : b);
    } else {
      // Create new
      const newBlog: BlogPost = {
        id: `blog-${Date.now()}`,
        title: editingBlog.title || "Untitled Blog",
        summary: editingBlog.summary || "",
        content: editingBlog.content || "",
        category: editingBlog.category || "Web Development",
        readTime: editingBlog.readTime || "4 min read",
        authorName: editingBlog.authorName || "Ritesh Kumar",
        authorRole: editingBlog.authorRole || "Chief Architect",
        date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        published: editingBlog.published !== undefined ? editingBlog.published : true
      };
      updated.blogs.unshift(newBlog);
    }

    handleSaveCMS(updated);
    setEditingBlog(null);
  };

  const handleSavePortfolio = () => {
    if (!db || !editingPortfolio) return;
    const updated = { ...db };

    if (editingPortfolio.id) {
      updated.portfolio = updated.portfolio.map(p => p.id === editingPortfolio.id ? (editingPortfolio as PortfolioItem) : p);
    } else {
      const newPortfolio: PortfolioItem = {
        id: `port-${Date.now()}`,
        title: editingPortfolio.title || "New Project",
        subtitle: editingPortfolio.subtitle || "",
        description: editingPortfolio.description || "",
        challenge: editingPortfolio.challenge || "",
        solution: editingPortfolio.solution || "",
        results: editingPortfolio.results || "",
        techStack: editingPortfolio.techStack || ["React", "Node.js"],
        duration: editingPortfolio.duration || "4 Weeks",
        client: editingPortfolio.client || "Self",
        category: editingPortfolio.category || "ERP & Fintech",
        mockupType: editingPortfolio.mockupType || "laptop",
        metricValue: editingPortfolio.metricValue || "100%",
        metricLabel: editingPortfolio.metricLabel || "Scalability Increase",
        featured: editingPortfolio.featured !== undefined ? editingPortfolio.featured : true
      };
      updated.portfolio.unshift(newPortfolio);
    }

    handleSaveCMS(updated);
    setEditingPortfolio(null);
  };

  const handleSaveJob = () => {
    if (!db || !editingJob) return;
    const updated = { ...db };

    if (editingJob.id) {
      updated.careers = updated.careers.map(j => j.id === editingJob.id ? (editingJob as CareerJob) : j);
    } else {
      const newJob: CareerJob = {
        id: `job-${Date.now()}`,
        title: editingJob.title || "New Open Role",
        department: editingJob.department || "Engineering",
        location: editingJob.location || "Remote",
        type: editingJob.type || "Full-time",
        salary: editingJob.salary || "$3,000 - $5,000",
        experience: editingJob.experience || "3+ Years",
        description: editingJob.description || "",
        requirements: editingJob.requirements || [],
        benefits: editingJob.benefits || [],
        active: editingJob.active !== undefined ? editingJob.active : true
      };
      updated.careers.unshift(newJob);
    }

    handleSaveCMS(updated);
    setEditingJob(null);
  };

  const handleSaveSettings = (settings: SiteSettings) => {
    if (!db) return;
    const updated = { ...db, settings };
    handleSaveCMS(updated);
  };

  return (
    <div id="admin-portal-wrapper" className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Absolute overlay close */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative bg-white w-full max-w-6xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col justify-between"
      >
        {/* Header bar */}
        <div className="bg-[#0E1B31] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Webtrivo Admin Portal</h2>
              <p className="text-[10px] text-slate-400">Manage client leads, inquiries, and CMS contents.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> SECURE SHELL ACTIVE
              </span>
            )}
            <button
              id="close-admin-portal"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-hidden flex">
          
          {!isAuthenticated ? (
            /* Auth form barrier */
            <div id="admin-login-frame" className="flex-1 flex items-center justify-center bg-slate-50">
              <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded-2xl border border-slate-100 shadow-xl space-y-5">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-blue-50 text-[#0B63F6] rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Lock size={22} />
                  </div>
                  <h3 className="text-base font-bold text-[#0E1B31]">Secure Access Verification</h3>
                  <p className="text-[11px] text-slate-400">Enter developer authorization keys to edit site schemas.</p>
                </div>

                {loginError && (
                  <div id="login-error-alert" className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl font-medium">
                    {loginError}
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Username</label>
                    <div className="relative">
                      <input
                        id="admin-username-input"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="admin"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 pl-10 outline-none focus:border-[#0B63F6] focus:bg-white"
                      />
                      <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Authorization Password</label>
                    <div className="relative">
                      <input
                        id="admin-password-input"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 pl-10 outline-none focus:border-[#0B63F6] focus:bg-white"
                      />
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>
                </div>

                <button
                  id="admin-login-submit"
                  type="submit"
                  className="w-full bg-[#0E1B31] hover:bg-slate-850 text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer"
                >
                  Verify Authorization
                </button>

                <div className="text-center text-[10px] text-slate-400 bg-slate-50 py-2 rounded-xl">
                  Default: <span className="font-bold">admin</span> / <span className="font-bold">webtrivo2026</span>
                </div>
              </form>
            </div>
          ) : (
            /* Logged in Workspace */
            <div className="flex-1 flex h-full overflow-hidden">
              {/* Sidebar */}
              <div className="w-56 bg-slate-50 border-r border-slate-100 p-4 flex flex-col justify-between">
                <nav id="admin-sidebar" className="space-y-1.5 text-xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-2">Data Engine</div>
                  
                  <button
                    onClick={() => { setActiveTab("leads"); setSelectedInquiry(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      activeTab === "leads" ? "bg-[#0B63F6] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Users size={16} />
                    Inquiries / Leads
                  </button>

                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pt-4 pb-2 mb-2 px-2 border-t border-slate-200/50">CMS Content</div>

                  <button
                    onClick={() => { setActiveTab("blogs"); setEditingBlog(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      activeTab === "blogs" ? "bg-[#0B63F6] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText size={16} />
                    Blog Journals
                  </button>

                  <button
                    onClick={() => { setActiveTab("portfolio"); setEditingPortfolio(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      activeTab === "portfolio" ? "bg-[#0B63F6] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FolderOpen size={16} />
                    Portfolio Items
                  </button>

                  <button
                    onClick={() => { setActiveTab("careers"); setEditingJob(null); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      activeTab === "careers" ? "bg-[#0B63F6] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Briefcase size={16} />
                    Careers Jobs
                  </button>

                  <button
                    onClick={() => { setActiveTab("subscribers"); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      activeTab === "subscribers" ? "bg-[#0B63F6] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Mail size={16} />
                    Newsletter Subs
                  </button>

                  <button
                    onClick={() => { setActiveTab("settings"); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left cursor-pointer ${
                      activeTab === "settings" ? "bg-[#0B63F6] text-white" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Settings size={16} />
                    Site Settings
                  </button>
                </nav>

                <button
                  id="admin-logout-btn"
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors font-bold text-xs rounded-xl"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>

              {/* Main Tab Area */}
              <div id="admin-tab-viewport" className="flex-1 p-6 overflow-y-auto bg-slate-50/40">
                {loading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 size={36} className="animate-spin text-[#0B63F6]" />
                  </div>
                )}

                {/* Status Bar */}
                {saveStatus !== "idle" && (
                  <div className={`mb-4 p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    saveStatus === "saving" ? "bg-blue-50 text-[#0B63F6]" :
                    saveStatus === "success" ? "bg-emerald-50 text-emerald-600" :
                    "bg-red-50 text-red-600"
                  }`}>
                    {saveStatus === "saving" && <Loader2 size={14} className="animate-spin" />}
                    {saveStatus === "success" && <Check size={14} />}
                    <span>
                      {saveStatus === "saving" && "Updating Webtrivo server database..."}
                      {saveStatus === "success" && "CMS modifications successfully compiled and deployed live!"}
                      {saveStatus === "error" && "Error pushing database updates to disk."}
                    </span>
                  </div>
                )}

                {db && (
                  <>
                    {/* LEADS TAB */}
                    {activeTab === "leads" && (
                      <div id="admin-tab-leads" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#0E1B31]">Client Inquiries & CRM Leads</h3>
                          <span className="text-[10px] bg-blue-50 text-[#0B63F6] border border-blue-200 px-2.5 py-1 rounded-full font-bold">
                            {db.inquiries.length} Total Captured
                          </span>
                        </div>

                        {!selectedInquiry ? (
                          /* Grid */
                          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100 text-[10px] tracking-wider">
                                  <th className="p-4">Client Name</th>
                                  <th className="p-4">Company</th>
                                  <th className="p-4">Project Type</th>
                                  <th className="p-4">Budget</th>
                                  <th className="p-4">Status</th>
                                  <th className="p-4 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {db.inquiries.map(inq => (
                                  <tr key={inq.id} className="hover:bg-slate-50/50">
                                    <td className="p-4">
                                      <p className="font-bold text-slate-800">{inq.name}</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">{inq.email}</p>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-600">{inq.company || "Not Specified"}</td>
                                    <td className="p-4 font-medium text-slate-600">{inq.projectType}</td>
                                    <td className="p-4 font-mono font-bold text-[#0B63F6]">{inq.budget}</td>
                                    <td className="p-4">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                        inq.status === "new" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                                        inq.status === "contacted" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                                        inq.status === "qualified" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                                        "bg-slate-100 text-slate-600 border border-slate-200"
                                      }`}>
                                        {inq.status}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                      <button
                                        onClick={() => setSelectedInquiry(inq)}
                                        className="text-xs text-[#0B63F6] font-bold hover:underline cursor-pointer"
                                      >
                                        Details →
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                                {db.inquiries.length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="text-center py-12 text-slate-400">No client inquiries received yet.</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          /* Detailed CRM View & Update Notes */
                          <div id="inquiry-detail-panel" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                            <button onClick={() => setSelectedInquiry(null)} className="text-xs text-[#0B63F6] font-bold hover:underline flex items-center gap-1 cursor-pointer">
                              ← Back to grid
                            </button>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                              <div>
                                <span className="text-slate-400 text-[10px] uppercase font-bold">Inquiry Core Details</span>
                                <h4 className="text-lg font-bold text-[#0E1B31] mt-0.5">{selectedInquiry.name}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Submitted at: {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-slate-500">Sales status:</label>
                                <select
                                  id="inquiry-status-select"
                                  value={selectedInquiry.status}
                                  onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as any, selectedInquiry.notes || "")}
                                  className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none"
                                >
                                  <option value="new">New / Unread</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="qualified">Qualified</option>
                                  <option value="archived">Archived</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 text-xs text-slate-600">
                              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Contact Details</p>
                                <p><strong>Email:</strong> {selectedInquiry.email}</p>
                                <p><strong>Phone:</strong> {selectedInquiry.phone || "Not specified"}</p>
                                <p><strong>Company:</strong> {selectedInquiry.company || "Not specified"}</p>
                              </div>

                              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl">
                                <p className="text-[10px] uppercase font-bold text-slate-400">Project Telemetry</p>
                                <p><strong>Project Category:</strong> {selectedInquiry.projectType}</p>
                                <p><strong>Client Budget:</strong> <span className="font-bold text-[#0B63F6]">{selectedInquiry.budget}</span></p>
                                <p><strong>Attachments:</strong> {selectedInquiry.fileUrl ? <a href={selectedInquiry.fileUrl} target="_blank" className="text-[#0B63F6] underline font-bold flex items-center gap-1 mt-0.5">Brief Document <ExternalLink size={11} /></a> : "None"}</p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Message</h4>
                              <p className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                            </div>

                            {/* Admin notes panel */}
                            <div className="space-y-3 pt-4 border-t border-slate-100">
                              <h4 className="text-xs font-bold text-[#0E1B31] uppercase tracking-wider">Administrative Follow-Up Logs</h4>
                              <textarea
                                id="inquiry-notes-input"
                                rows={3}
                                defaultValue={selectedInquiry.notes || ""}
                                onBlur={(e) => handleUpdateInquiryStatus(selectedInquiry.id, selectedInquiry.status, e.target.value)}
                                placeholder="Add notes (e.g. Schedule call on Monday, sent customized invoice PDF, waiting for GitHub approval)..."
                                className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-[#0B63F6] focus:bg-white rounded-xl p-3.5 outline-none"
                              />
                              <p className="text-[10px] text-slate-400">Notes are saved automatically when clicking outside the area.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* BLOGS TAB */}
                    {activeTab === "blogs" && (
                      <div id="admin-tab-blogs" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#0E1B31]">CMS Journals & Blog Content</h3>
                          <button
                            id="add-new-blog-btn"
                            onClick={() => setEditingBlog({})}
                            className="flex items-center gap-1.5 bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                          >
                            <Plus size={14} /> Add New Blog
                          </button>
                        </div>

                        {!editingBlog ? (
                          /* List */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {db.blogs.map(post => (
                              <div key={post.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[150px]">
                                <div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-600 uppercase">{post.category}</span>
                                    <span>{post.date}</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{post.title}</h4>
                                  <p className="text-slate-500 text-xs line-clamp-2 mt-1">{post.summary}</p>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs">
                                  <span className={`text-[10px] font-bold ${post.published ? "text-emerald-500" : "text-slate-400"}`}>
                                    {post.published ? "● Published" : "○ Draft"}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      id={`edit-blog-btn-${post.id}`}
                                      onClick={() => setEditingBlog(post)}
                                      className="text-xs text-[#0B63F6] font-bold hover:underline cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      id={`delete-blog-btn-${post.id}`}
                                      onClick={() => handleDeleteItem("blogs", post.id)}
                                      className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Edit Form */
                          <div id="blog-edit-form" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-[#0E1B31]">{editingBlog.id ? "Edit Blog Entry" : "Create Blog Entry"}</h4>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Article Title</label>
                                <input
                                  id="blog-title-input"
                                  type="text"
                                  value={editingBlog.title || ""}
                                  onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                                  placeholder="Why Webtrivo core scale matches Stripe standards"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                                <select
                                  id="blog-category-select"
                                  value={editingBlog.category || "Web Development"}
                                  onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                >
                                  <option value="Web Development">Web Development</option>
                                  <option value="Enterprise Solutions">Enterprise Solutions</option>
                                  <option value="AI & Automation">AI & Automation</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Short Summary / Intro</label>
                              <textarea
                                id="blog-summary-input"
                                rows={2}
                                value={editingBlog.summary || ""}
                                onChange={(e) => setEditingBlog({ ...editingBlog, summary: e.target.value })}
                                placeholder="A brief hook designed to trigger search queries..."
                                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Core content (Markdown headers ### supported)</label>
                              <textarea
                                id="blog-content-input"
                                rows={8}
                                value={editingBlog.content || ""}
                                onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                                placeholder="### Intro&#10;&#10;Use three hashtags for subheadings..."
                                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none font-mono"
                              />
                            </div>

                            <div className="flex items-center gap-6 pt-4 text-xs border-t border-slate-100">
                              <label className="flex items-center gap-2 font-bold text-slate-600">
                                <input
                                  id="blog-publish-checkbox"
                                  type="checkbox"
                                  checked={editingBlog.published !== false}
                                  onChange={(e) => setEditingBlog({ ...editingBlog, published: e.target.checked })}
                                />
                                Deploy Live (Published)
                              </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                              <button
                                id="cancel-blog-edit"
                                onClick={() => setEditingBlog(null)}
                                className="bg-slate-100 text-[#0E1B31] text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                id="save-blog-btn"
                                onClick={handleSaveBlog}
                                className="bg-[#0B63F6] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                              >
                                <Save size={14} /> Save Article
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* PORTFOLIO TAB */}
                    {activeTab === "portfolio" && (
                      <div id="admin-tab-portfolio" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#0E1B31]">CMS Portfolio Cases</h3>
                          <button
                            id="add-portfolio-btn"
                            onClick={() => setEditingPortfolio({})}
                            className="flex items-center gap-1.5 bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                          >
                            <Plus size={14} /> Add Case Study
                          </button>
                        </div>

                        {!editingPortfolio ? (
                          /* List */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {db.portfolio.map(port => (
                              <div key={port.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[150px]">
                                <div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                                    <span className="bg-blue-50 px-2.5 py-0.5 rounded-full font-bold text-[#0B63F6] uppercase">{port.category}</span>
                                    <span>{port.duration}</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-slate-800">{port.title}</h4>
                                  <p className="text-slate-500 text-xs line-clamp-2 mt-1">{port.description}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                                  <span className="text-[#0B63F6] text-[10px] font-bold font-mono">
                                    KPI: {port.metricValue} {port.metricLabel}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      id={`edit-portfolio-btn-${port.id}`}
                                      onClick={() => setEditingPortfolio(port)}
                                      className="text-xs text-[#0B63F6] font-bold hover:underline cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      id={`delete-portfolio-btn-${port.id}`}
                                      onClick={() => handleDeleteItem("portfolio", port.id)}
                                      className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Edit Form */
                          <div id="portfolio-edit-form" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 overflow-y-auto max-h-[70vh]">
                            <h4 className="text-sm font-bold text-[#0E1B31]">{editingPortfolio.id ? "Edit Portfolio Entry" : "Create Portfolio Entry"}</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Project Title</label>
                                <input
                                  id="portfolio-title-input"
                                  type="text"
                                  value={editingPortfolio.title || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, title: e.target.value })}
                                  placeholder="e.g. FinSphere"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Client Details</label>
                                <input
                                  id="portfolio-client-input"
                                  type="text"
                                  value={editingPortfolio.client || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, client: e.target.value })}
                                  placeholder="e.g. FinSphere Financial Group"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
                                <select
                                  id="portfolio-category-select"
                                  value={editingPortfolio.category || "ERP & Fintech"}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, category: e.target.value })}
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                >
                                  <option value="ERP & Fintech">ERP & Fintech</option>
                                  <option value="Mobile App & AI Solutions">Mobile App & AI Solutions</option>
                                  <option value="SaaS & CRM Development">SaaS & CRM Development</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Mockup layout style</label>
                                <select
                                  id="portfolio-mockup-select"
                                  value={editingPortfolio.mockupType || "laptop"}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, mockupType: e.target.value as any })}
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                >
                                  <option value="laptop">CSS Macbook Frame</option>
                                  <option value="phone">CSS iPhone Frame</option>
                                  <option value="dashboard">CSS Admin Dashboard</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">KPI Performance Value</label>
                                <input
                                  id="portfolio-metric-value"
                                  type="text"
                                  value={editingPortfolio.metricValue || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, metricValue: e.target.value })}
                                  placeholder="e.g. 74%"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">KPI Metric Label</label>
                                <input
                                  id="portfolio-metric-label"
                                  type="text"
                                  value={editingPortfolio.metricLabel || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, metricLabel: e.target.value })}
                                  placeholder="e.g. Latency Reduction"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Project Brief description</label>
                              <textarea
                                id="portfolio-desc-input"
                                rows={2}
                                value={editingPortfolio.description || ""}
                                onChange={(e) => setEditingPortfolio({ ...editingPortfolio, description: e.target.value })}
                                placeholder="A core high level summary..."
                                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">The Challenge Details</label>
                                <textarea
                                  id="portfolio-challenge-input"
                                  rows={3}
                                  value={editingPortfolio.challenge || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, challenge: e.target.value })}
                                  placeholder="What legacy hurdles faced the client..."
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Our Solution Details</label>
                                <textarea
                                  id="portfolio-solution-input"
                                  rows={3}
                                  value={editingPortfolio.solution || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, solution: e.target.value })}
                                  placeholder="How Webtrivo engineers resolved..."
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Results Impact Details</label>
                                <textarea
                                  id="portfolio-results-input"
                                  rows={3}
                                  value={editingPortfolio.results || ""}
                                  onChange={(e) => setEditingPortfolio({ ...editingPortfolio, results: e.target.value })}
                                  placeholder="Core stats and business ROI outcome..."
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                              <button
                                id="cancel-portfolio-edit"
                                onClick={() => setEditingPortfolio(null)}
                                className="bg-slate-100 text-[#0E1B31] text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                id="save-portfolio-btn"
                                onClick={handleSavePortfolio}
                                className="bg-[#0B63F6] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                              >
                                <Save size={14} /> Deploy Case Study
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CAREERS TAB */}
                    {activeTab === "careers" && (
                      <div id="admin-tab-careers" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#0E1B31]">CMS Career Job Listings</h3>
                          <button
                            id="add-job-btn"
                            onClick={() => setEditingJob({})}
                            className="flex items-center gap-1.5 bg-[#0B63F6] hover:bg-blue-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                          >
                            <Plus size={14} /> Create Listing
                          </button>
                        </div>

                        {!editingJob ? (
                          /* List */
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {db.careers.map(job => (
                              <div key={job.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col justify-between h-[150px]">
                                <div>
                                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                                    <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-600 uppercase">{job.department}</span>
                                    <span>{job.type}</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-slate-800">{job.title}</h4>
                                  <p className="text-slate-500 text-xs line-clamp-2 mt-1">{job.description}</p>
                                </div>
                                <div className="pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                                  <span className={`text-[10px] font-bold ${job.active ? "text-emerald-500" : "text-slate-400"}`}>
                                    {job.active ? "● Active" : "○ Paused"}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      id={`edit-job-btn-${job.id}`}
                                      onClick={() => setEditingJob(job)}
                                      className="text-xs text-[#0B63F6] font-bold hover:underline cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      id={`delete-job-btn-${job.id}`}
                                      onClick={() => handleDeleteItem("careers", job.id)}
                                      className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* Edit Form */
                          <div id="job-edit-form" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                            <h4 className="text-sm font-bold text-[#0E1B31]">{editingJob.id ? "Edit Job Listing" : "Create Job Listing"}</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Role Title</label>
                                <input
                                  id="job-title-input"
                                  type="text"
                                  value={editingJob.title || ""}
                                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                                  placeholder="e.g. Senior React Developer"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Department</label>
                                <input
                                  id="job-dept-input"
                                  type="text"
                                  value={editingJob.department || ""}
                                  onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                                  placeholder="e.g. Frontend Engineering"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Salary Range</label>
                                <input
                                  id="job-salary-input"
                                  type="text"
                                  value={editingJob.salary || ""}
                                  onChange={(e) => setEditingJob({ ...editingJob, salary: e.target.value })}
                                  placeholder="e.g. $4,000 - $6,000"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Job Contract Type</label>
                                <select
                                  id="job-type-select"
                                  value={editingJob.type || "Full-time"}
                                  onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value as any })}
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                >
                                  <option value="Full-time">Full-time</option>
                                  <option value="Contract">Contract</option>
                                  <option value="Remote">Remote</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Experience</label>
                                <input
                                  id="job-exp-input"
                                  type="text"
                                  value={editingJob.experience || ""}
                                  onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                                  placeholder="e.g. 5+ Years"
                                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Job Description</label>
                              <textarea
                                id="job-desc-input"
                                rows={3}
                                value={editingJob.description || ""}
                                onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                                placeholder="Describe the day-to-day operations and responsibilities..."
                                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                              <button
                                id="cancel-job-edit"
                                onClick={() => setEditingJob(null)}
                                className="bg-slate-100 text-[#0E1B31] text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                id="save-job-btn"
                                onClick={handleSaveJob}
                                className="bg-[#0B63F6] text-white text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                              >
                                <Save size={14} /> Deploy Role Listing
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SUBSCRIBERS TAB */}
                    {activeTab === "subscribers" && (
                      <div id="admin-tab-subs" className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-[#0E1B31]">Newsletter Subscribers</h3>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                            {db.subscribers.length} Registered Emails
                          </span>
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-xs">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100 text-[10px]">
                                <th className="p-4">Email Coordinates</th>
                                <th className="p-4">Subscribed At</th>
                                <th className="p-4 text-right">Action Logs</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {db.subscribers.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50/50">
                                  <td className="p-4 font-bold text-slate-700">{sub.email}</td>
                                  <td className="p-4 text-slate-500 font-mono text-[10px]">{new Date(sub.subscribedAt).toLocaleString()}</td>
                                  <td className="p-4 text-right">
                                    <span className="text-[10px] text-slate-400 font-mono">ACTIVE AUDIENCE</span>
                                  </td>
                                </tr>
                              ))}
                              {db.subscribers.length === 0 && (
                                <tr>
                                  <td colSpan={3} className="text-center py-12 text-slate-400">No newsletter signups received yet.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === "settings" && (
                      <div id="admin-tab-settings" className="space-y-6">
                        <h3 className="text-base font-bold text-[#0E1B31]">Global Settings & SEO Configuration</h3>
                        
                        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Agency Name</label>
                              <input
                                id="setting-company-name"
                                type="text"
                                defaultValue={db.settings.companyName}
                                onBlur={(e) => handleSaveSettings({ ...db.settings, companyName: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Core Tagline</label>
                              <input
                                id="setting-tagline"
                                type="text"
                                defaultValue={db.settings.tagline}
                                onBlur={(e) => handleSaveSettings({ ...db.settings, tagline: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Admin Notification Email</label>
                              <input
                                id="setting-contact-email"
                                type="email"
                                defaultValue={db.settings.contactEmail}
                                onBlur={(e) => handleSaveSettings({ ...db.settings, contactEmail: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Primary WhatsApp (Including country prefix, no spaces)</label>
                              <input
                                id="setting-whatsapp"
                                type="tel"
                                defaultValue={db.settings.whatsappNumber}
                                onBlur={(e) => handleSaveSettings({ ...db.settings, whatsappNumber: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Office Address</label>
                              <input
                                id="setting-address"
                                type="text"
                                defaultValue={db.settings.address}
                                onBlur={(e) => handleSaveSettings({ ...db.settings, address: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Book Meeting Link (e.g. Calendly)</label>
                              <input
                                id="setting-calendly"
                                type="url"
                                defaultValue={db.settings.bookMeetingUrl}
                                onBlur={(e) => handleSaveSettings({ ...db.settings, bookMeetingUrl: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                              />
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-100 space-y-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Database size={14} className="text-blue-500" /> SEO Meta Schema Definitions
                            </h4>
                            <div className="grid grid-cols-1 gap-4 text-xs">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Home SEO Meta Title</label>
                                <input
                                  id="setting-seo-title"
                                  type="text"
                                  defaultValue={db.settings.seoTitle}
                                  onBlur={(e) => handleSaveSettings({ ...db.settings, seoTitle: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Home SEO Meta Description</label>
                                <input
                                  id="setting-seo-desc"
                                  type="text"
                                  defaultValue={db.settings.seoDescription}
                                  onBlur={(e) => handleSaveSettings({ ...db.settings, seoDescription: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Meta Keywords (Comma separated)</label>
                                <input
                                  id="setting-seo-keywords"
                                  type="text"
                                  defaultValue={db.settings.seoKeywords}
                                  onBlur={(e) => handleSaveSettings({ ...db.settings, seoKeywords: e.target.value })}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 outline-none"
                                />
                              </div>
                            </div>
                          </div>

                          <p className="text-[10px] text-slate-400">Settings are automatically dispatched and compiled to `/data/db.json` when unfocusing inputs.</p>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
