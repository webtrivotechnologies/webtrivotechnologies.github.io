import { useState } from "react";
import { motion } from "motion/react";
import {
  Heart,
  DollarSign,
  GraduationCap,
  Hammer,
  Factory,
  ShoppingBag,
  Building,
  Plane,
  Utensils,
  Car,
  Truck,
  Scale,
  Users,
  ShieldAlert,
  Rocket,
  ChevronRight,
} from "lucide-react";

export default function Industries() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const industries = [
    { name: "Healthcare & HIPAA", icon: <Heart size={18} />, desc: "HIPAA Compliant Patient portals, EHR, and diagnostics apps." },
    { name: "Fintech & Banking", icon: <DollarSign size={18} />, desc: "High-security digital ledgers, multi-currency wallets, and compliance." },
    { name: "EdTech & Learning", icon: <GraduationCap size={18} />, desc: "LMS systems, live classroom software, and grading analytics." },
    { name: "Logistics & Supply Chain", icon: <Truck size={18} />, desc: "Real-time fleet tracking, barcode integration, and routing." },
    { name: "B2B SaaS & Startups", icon: <Rocket size={18} />, desc: "Multi-tenant secure core architectures and Stripe subscription engines." },
    { name: "Manufacturing & ERP", icon: <Factory size={18} />, desc: "Production optimization, inventory monitoring, and billing." },
    { name: "Retail & eCommerce", icon: <ShoppingBag size={18} />, desc: "Headless commerce, rapid checkouts, and custom store builds." },
    { name: "Real Estate & Housing", icon: <Building size={18} />, desc: "Property CRM, visual lease management, and booking calendars." },
    { name: "Travel & Hospitality", icon: <Plane size={18} />, desc: "Booking pipelines, reservation engines, and localized tour guides." },
    { name: "Food Tech & Delivery", icon: <Utensils size={18} />, desc: "Order dispatch loops, restaurant management boards, and driver GPS." },
    { name: "Automotive & Fleet", icon: <Car size={18} />, desc: "Diagnostics logging, vehicle telemetry dashboards, and parts inventory." },
    { name: "Legal & Auditing", icon: <Scale size={18} />, desc: "Secure file lockers, case logging matrices, and digital signatures." },
    { name: "HR Tech & Recruiting", icon: <Users size={18} />, desc: "Applicant tracking boards, payroll automation, and skills checks." },
    { name: "GovTech & Security", icon: <ShieldAlert size={18} />, desc: "Ultra-secure citizen interfaces, credentials checking, and backups." },
    { name: "Construction Management", icon: <Hammer size={18} />, desc: "Project estimation sheets, field logging trackers, and blueprints." },
  ];

  return (
    <section id="industries" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Group */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-xl space-y-2">
            <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase">Target Markets</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
              Sector-Specific Software Engineering
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm max-w-sm">
            We adapt our microservices, API integrations, and user interfaces to match the strict security, compliance, and UI requirements of your specific vertical.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => (
            <motion.div
              key={ind.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.03 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="relative overflow-hidden bg-slate-50/50 hover:bg-slate-900 rounded-2xl p-6 border border-slate-100/80 hover:border-slate-800 transition-all duration-300 group flex flex-col justify-between h-[180px] cursor-default"
            >
              {/* Border Glow Accent */}
              {hoveredIdx === idx && (
                <motion.div
                  layoutId="glow-accent"
                  className="absolute inset-0 bg-radial from-[#0b63f6]/10 to-transparent -z-10"
                  transition={{ duration: 0.2 }}
                />
              )}

              <div className="space-y-4">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0B63F6] group-hover:bg-[#0B63F6]/20 group-hover:text-[#19B5FE] flex items-center justify-center transition-all duration-300">
                  {ind.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-[#0E1B31] group-hover:text-white transition-colors">
                    {ind.name}
                  </h3>
                  <p className="text-slate-500 group-hover:text-slate-400 text-xs leading-relaxed line-clamp-2">
                    {ind.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-1 text-[10px] font-bold text-[#0B63F6] group-hover:text-[#19B5FE] uppercase tracking-wider select-none opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span>View Schema Details</span>
                <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
