const steps = [
  {
    title: "Discovery",
    description: "Clarify users, goals, scope, risks, and success criteria.",
  },
  {
    title: "Planning",
    description: "Shape architecture, milestones, responsibilities, and delivery rhythm.",
  },
  {
    title: "Design",
    description: "Create polished UX flows, interface systems, and responsive screens.",
  },
  {
    title: "Development",
    description: "Build clean frontend, backend, integrations, dashboards, and workflows.",
  },
  {
    title: "Testing",
    description: "Validate behavior, responsiveness, forms, performance, and release quality.",
  },
  {
    title: "Launch and Support",
    description: "Deploy, monitor, improve, and support the product after launch.",
  },
];

export default function Process() {
  return (
    <section className="section process-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Process</span>
        <h2>Structured delivery from idea to launch</h2>
      </div>
      <div className="process-list">
        {steps.map((step, index) => (
          <article className="process-step" key={step.title} data-reveal>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
