import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, ChevronLeft, X } from "lucide-react";
import { BlogPost } from "../types";

interface BlogProps {
  blogs: BlogPost[];
}

export default function Blog({ blogs }: BlogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const categories = ["All", "Web Development", "Enterprise Solutions", "AI & Automation"];

  const filteredBlogs = blogs.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl space-y-2">
            <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase">Our Insights</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
              Webtrivo Tech Journal
            </h2>
          </div>

          {/* Search Filter */}
          <div className="relative w-full max-w-xs shrink-0">
            <input
              id="blog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journals..."
              className="w-full bg-white border border-slate-200 focus:border-[#0B63F6] rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none shadow-sm transition-colors text-[#0E1B31]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          </div>
        </div>

        {/* Tab Selection Row */}
        <div className="flex flex-wrap gap-1.5 mb-10 border-b border-slate-200 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              id={`blog-category-${cat.replace(/\s+/g, "-")}`}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#0B63F6] text-white"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((post, idx) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 flex flex-col justify-between hover:shadow-xl hover:border-slate-200/50 transition-all duration-300 group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] font-semibold">
                      <Calendar size={11} /> {post.date}
                      <span>•</span>
                      <Clock size={11} /> {post.readTime}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#0E1B31] group-hover:text-[#0B63F6] transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>
                  </div>
                </div>

                {/* Author Info & Read Trigger */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-extrabold text-xs">
                      {post.authorName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{post.authorName}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{post.authorRole}</p>
                    </div>
                  </div>

                  <button
                    id={`read-blog-btn-${post.id}`}
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-bold text-[#0E1B31] hover:text-[#0B63F6] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Read Journal <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic Immersive Blog Reader Drawer Modal */}
      <AnimatePresence>
        {selectedPost && (
          <div id="blog-reader-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="absolute inset-0"
            />
            <motion.div
              id="blog-reader-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[85vh] space-y-6"
            >
              <button
                id="close-blog-reader"
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {selectedPost.category}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0E1B31] leading-tight pt-1">
                    {selectedPost.title}
                  </h3>
                  
                  {/* Stats Meta */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs font-semibold pt-1">
                    <span className="flex items-center gap-1"><Calendar size={13} /> {selectedPost.date}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {selectedPost.readTime}</span>
                    <span className="flex items-center gap-1"><User size={13} /> {selectedPost.authorName} ({selectedPost.authorRole})</span>
                  </div>
                </div>

                {/* Subtext info */}
                <blockquote className="border-l-4 border-[#0B63F6] pl-4 italic text-slate-600 text-xs sm:text-sm">
                  {selectedPost.summary}
                </blockquote>

                {/* Core Markdown Body */}
                <div className="pt-6 border-t border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                  {selectedPost.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("###")) {
                      return <h4 key={i} className="text-base font-bold text-[#0E1B31] pt-3">{para.replace("###", "").trim()}</h4>;
                    }
                    if (para.startsWith("1.") || para.startsWith("-")) {
                      return (
                        <ul key={i} className="list-disc pl-5 space-y-1 text-slate-600">
                          {para.split("\n").map((li, j) => (
                            <li key={j}>{li.replace(/^[-\d\.\s*]+/, "").trim()}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i}>{para}</p>;
                  })}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                <button
                  id="close-reader-btn"
                  onClick={() => setSelectedPost(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-[#0E1B31] text-xs font-bold px-6 py-3 rounded-xl cursor-pointer"
                >
                  Close Article
                </button>
                <span className="text-[10px] text-slate-400 font-mono">Webtrivo Tech Journal</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
