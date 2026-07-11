const audiences = [
  { label: "USA", flag: "US" },
  { label: "UK", flag: "UK" },
  { label: "Australia", flag: "AU" },
  { label: "UAE", flag: "AE" },
  { label: "Germany", flag: "DE" },
  { label: "International businesses", flag: "GL" },
];

export default function Testimonials() {
  return (
    <section className="section compact-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Global focus</span>
        <h2>Built for international business expectations</h2>
        <p>
          Webtrivo Technologies supports clients across major markets with clear
          communication, practical planning, and reliable implementation.
        </p>
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
