import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "Experienced development team",
    description: "Senior frontend, backend, and product-minded builders for business-critical delivery.",
  },
  {
    title: "Transparent communication",
    description: "Clear milestones, practical updates, and decisions explained without noise.",
  },
  {
    title: "Flexible engagement",
    description: "Start with a focused build, expand into support, or hire dedicated capability.",
  },
  {
    title: "Scalable solutions",
    description: "Architecture choices that can grow with customers, teams, and operations.",
  },
  {
    title: "On-time delivery",
    description: "Disciplined planning and visible checkpoints from discovery to launch.",
  },
  {
    title: "Ongoing support",
    description: "Maintenance, optimization, improvements, and reliable post-launch care.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section muted-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Why choose us</span>
        <h2>A practical partner for serious product work</h2>
      </div>
      <div className="reason-grid">
        {reasons.map((reason) => (
          <div className="reason-item" key={reason.title} data-reveal data-stagger>
            <span className="reason-icon">
              <CheckCircle2 size={20} />
            </span>
            <div>
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
