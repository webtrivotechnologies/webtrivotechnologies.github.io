import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Map, Layout, Code, CheckSquare, CloudLightning, LifeBuoy, Check } from "lucide-react";

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Discovery & Audit",
      subtitle: "360-degree architectural audit",
      desc: "We analyze your existing workflows, database bottlenecks, and scalability targets. Our solutions architects outline clean tech stacks (e.g. Next.js, Laravel, PostgreSQL) and draft a precise Scope of Work (SOW).",
      deliverable: "Custom System Blueprint & Cost/Schedule SOW",
      icon: <Search size={20} />
    },
    {
      title: "Product Planning",
      subtitle: "Sprint blueprints & database design",
      desc: "We map complete database schemas, API structures, and microservice topologies. All user-stories are itemized into discrete, trackable Jira epic blocks, organizing precise 2-week Sprint goals.",
      deliverable: "Interactive Schema Map & Jira Backlog Board",
      icon: <Map size={20} />
    },
    {
      title: "High-Fidelity UI/UX",
      subtitle: "Pixel-perfect modern prototypes",
      desc: "We craft stunning, modern interfaces with generous whitespace, rounded components, and cohesive palettes. We provide interactive Figma prototypes to simulate transitions before writing a single line of CSS.",
      deliverable: "Interactive Figma Design System & Prototypes",
      icon: <Layout size={20} />
    },
    {
      title: "Agile Engineering",
      subtitle: "Clean, type-safe clean code",
      desc: "Our senior developers write robust, type-safe code using modular layouts (e.g. React/TypeScript with Laravel backend APIs). We run daily commits, utilize git-flow branches, and host continuous staging builds.",
      deliverable: "Access to Git Workspace & Live Staging Links",
      icon: <Code size={20} />
    },
    {
      title: "Rigorous QA Testing",
      subtitle: "Automated & end-to-end testing",
      desc: "We perform automated end-to-end integration tests using frameworks like Playwright or Jest. We verify responsive CSS on 12+ physical viewports, run security rate-limit evaluations, and eliminate memory leaks.",
      deliverable: "Automated QA Test Reports & Performance Logs",
      icon: <CheckSquare size={20} />
    },
    {
      title: "CI/CD Deployment",
      subtitle: "Secure serverless launch",
      desc: "We configure automated GitHub Actions pipelines to deploy your product onto secure, isolated container platforms (like Docker, AWS, or GCP). We integrate Cloudflare, set up caching headers, and run SSL sweeps.",
      deliverable: "Production Access Keys, SSL, & Cloud Configs",
      icon: <CloudLightning size={20} />
    },
    {
      title: "Lifetime Support & SLA",
      subtitle: "Proactive server security monitoring",
      desc: "Every launch is backed by a 90-day comprehensive technical warranty. We also offer standard SLA monthly packages covering server updates, security patching, analytical telemetry, and direct Slack helpdesk access.",
      deliverable: "Dedicated Slack Support & Performance Dashboards",
      icon: <LifeBuoy size={20} />
    }
  ];

  return (
    <section id="process" className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title Group */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#0B63F6] text-xs font-bold tracking-widest uppercase mb-2">How We Collaborate</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0E1B31] tracking-tight">
            Our Transparent Engineering Process
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            No dark boxes. We operate with elite-level standards, sharing design screens, task queues, and staging environments from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Vertical Timeline Selector */}
          <div className="lg:col-span-5 space-y-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                id={`process-step-trigger-${i}`}
                onClick={() => setActiveStep(i)}
                className={`flex gap-4 items-center p-4 rounded-xl border cursor-pointer text-left transition-all duration-300 ${
                  activeStep === i
                    ? "bg-white border-[#0B63F6] shadow-md shadow-blue-500/5 text-[#0E1B31]"
                    : "bg-transparent border-transparent text-slate-500 hover:bg-slate-100/50 hover:text-slate-700"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  activeStep === i
                    ? "bg-[#0B63F6] text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {i + 1}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold tracking-tight">{step.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{step.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Detail Visualization Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                id="process-detail-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6 min-h-[380px] flex flex-col justify-between"
              >
                <div className="space-y-6">
                  {/* Phase & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-[#0B63F6] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Phase 0{activeStep + 1} • {steps[activeStep].subtitle}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B63F6] flex items-center justify-center">
                      {steps[activeStep].icon}
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#0E1B31]">
                    {steps[activeStep].title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed">
                    {steps[activeStep].desc}
                  </p>
                </div>

                {/* Specific Artifact Deliverable */}
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 mt-6">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Deliverable Deliveries</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{steps[activeStep].deliverable}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
