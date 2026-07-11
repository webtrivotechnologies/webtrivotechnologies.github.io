const audiences = [
  { label: "USA", flag: "US" },
  { label: "UK", flag: "UK" },
  { label: "Australia", flag: "AU" },
  { label: "UAE", flag: "AE" },
  { label: "Germany", flag: "DE" },
  { label: "International businesses", flag: "GL" },
];

const reviews = [
  {
    name: "Aarav Mehta",
    company: "SaaS Operations Founder",
    quote:
      "Webtrivo translated a rough CRM idea into a clear product roadmap and a polished dashboard our team could actually use.",
  },
  {
    name: "Nadia Williams",
    company: "E-commerce Director",
    quote:
      "The communication was direct, the interface felt premium, and the launch support helped us move without drama.",
  },
  {
    name: "Omar Al Khalid",
    company: "Business Systems Lead",
    quote:
      "They understood our workflow quickly and built software around our process instead of forcing a generic template.",
  },
];

export default function Testimonials() {
  return (
    <section className="section compact-section testimonials-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Client reviews</span>
        <h2>Trusted by teams that need clear software delivery</h2>
        <p>
          Webtrivo Technologies supports clients across major markets with clear
          communication, practical planning, and reliable implementation.
        </p>
      </div>
      <div className="review-grid">
        {reviews.map((review) => (
          <article className="review-card" key={review.name} data-reveal data-stagger>
            <div className="stars" aria-label="5 star rating">
              ★★★★★
            </div>
            <p>“{review.quote}”</p>
            <div>
              <strong>{review.name}</strong>
              <span>{review.company}</span>
            </div>
          </article>
        ))}
      </div>
      <div className="global-focus">
        <span className="eyebrow">Global focus</span>
        <h3>Built for international business expectations</h3>
      </div>
      <div className="market-row">
        {audiences.map((market) => (
          <span key={market.label}>
            <b>{market.flag}</b>
            {market.label}
          </span>
        ))}
      </div>
    </section>
  );
}
