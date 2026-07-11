import { CheckCircle2, Code2, PenTool, Rocket, Search, Workflow } from "lucide-react";

const steps = [
  {
    title: "Discovery",
    description: "Clarify users, goals, scope, risks, and success criteria.",
    icon: Search,
  },
  {
    title: "Planning",
    description: "Shape architecture, milestones, responsibilities, and delivery rhythm.",
    icon: Workflow,
  },
  {
    title: "Design",
    description: "Create polished UX flows, interface systems, and responsive screens.",
    icon: PenTool,
  },
  {
    title: "Development",
    description: "Build clean frontend, backend, integrations, dashboards, and workflows.",
    icon: Code2,
  },
  {
    title: "Testing",
    description: "Validate behavior, responsiveness, forms, performance, and release quality.",
    icon: CheckCircle2,
  },
  {
    title: "Launch and Support",
    description: "Deploy, monitor, improve, and support the product after launch.",
    icon: Rocket,
  },
];

export default function Process() {
  return (
    <section className="section process-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Process</span>
        <h2>Structured delivery from idea to launch</h2>
      </div>
      <div className="process-timeline">
        {steps.map((step, index) => (
          <article className="process-step" key={step.title} data-reveal data-stagger>
            <div className="process-node">{String(index + 1).padStart(2, "0")}</div>
            <div className="process-card">
              <span className="process-icon">
                <step.icon size={20} />
              </span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
