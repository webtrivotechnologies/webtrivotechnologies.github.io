import { motion } from "motion/react";
import { Award, Briefcase, Code2, HeartHandshake, Zap } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      id: "stat-1",
      value: "100+",
      label: "Enterprise Projects Completed",
      subtext: "Delivered on-time, fully-scaled",
      icon: <Briefcase className="text-[#0B63F6]" size={20} />,
      color: "bg-blue-50"
    },
    {
      id: "stat-2",
      value: "20+",
      label: "Core Technologies Utilized",
      subtext: "React, Flutter, Laravel, AWS, AI",
      icon: <Code2 className="text-sky-500" size={20} />,
      color: "bg-sky-50"
    },
    {
      id: "stat-3",
      value: "10+",
      label: "Dedicated Senior Engineers",
      subtext: "Elite remote staff, average 6+ yrs exp",
      icon: <Zap className="text-amber-500" size={20} />,
      color: "bg-amber-50"
    },
    {
      id: "stat-4",
      value: "95%",
      label: "Client Satisfaction Rating",
      subtext: "Net promoter score top 1% globally",
      icon: <HeartHandshake className="text-emerald-500" size={20} />,
      color: "bg-emerald-50"
    },
    {
      id: "stat-5",
      value: "5+",
      label: "Years Premium Experience",
      subtext: "Established software innovators",
      icon: <Award className="text-[#0E1B31]" size={20} />,
      color: "bg-slate-100"
    }
  ];

  return (
    <section id="stats" className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase mb-2">Webtrivo By The Numbers</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0E1B31] tracking-tight">
            Trusted by Startups, SMBs, and Growing Businesses Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100/80 hover:bg-white hover:shadow-xl hover:border-white transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight font-heading group-hover:text-[#0B63F6] transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-bold text-slate-800 tracking-tight leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-4 pt-4 border-t border-slate-100/50">
                {stat.subtext}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
