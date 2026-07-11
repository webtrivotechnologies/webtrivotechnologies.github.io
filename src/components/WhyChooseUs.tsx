import { CheckCircle2 } from "lucide-react";

const reasons = [
  "Experienced development team",
  "Transparent communication",
  "Flexible engagement",
  "Scalable solutions",
  "On-time delivery",
  "Ongoing support",
];

export default function WhyChooseUs() {
  return (
    <section className="section muted-section">
      <div className="section-heading">
        <span className="eyebrow">Why choose us</span>
        <h2>A practical partner for serious product work</h2>
      </div>
      <div className="reason-grid">
        {reasons.map((reason) => (
          <div className="reason-item" key={reason}>
            <CheckCircle2 size={20} />
            <span>{reason}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
