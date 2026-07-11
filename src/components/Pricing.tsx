import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    description: "Focused website, landing page, or MVP scope.",
    points: ["Clear fixed scope", "Responsive UI", "Basic launch support"],
  },
  {
    name: "Growth",
    description: "Best for CRM, e-commerce, dashboards, and app builds.",
    points: ["Product planning", "Custom development", "Integrations and QA"],
    featured: true,
  },
  {
    name: "Enterprise",
    description: "Long-term engineering, support, and platform evolution.",
    points: ["Flexible team model", "Ongoing support", "Scalable architecture"],
  },
];

export default function Pricing() {
  return (
    <section className="section pricing-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Engagement models</span>
        <h2>Choose the working model that fits your stage</h2>
        <p>
          Pricing depends on scope, timeline, integrations, and support needs,
          but these models help start the conversation clearly.
        </p>
      </div>
      <div className="pricing-grid">
        {plans.map((plan) => (
          <article className={`pricing-card${plan.featured ? " featured" : ""}`} key={plan.name} data-reveal data-stagger>
            <h3>{plan.name}</h3>
            <p>{plan.description}</p>
            <ul>
              {plan.points.map((point) => (
                <li key={point}>
                  <Check size={16} /> {point}
                </li>
              ))}
            </ul>
            <a href="#contact">{plan.featured ? "Plan a growth build" : "Discuss this model"}</a>
          </article>
        ))}
      </div>
    </section>
  );
}
