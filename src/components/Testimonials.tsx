const audiences = ["USA", "UK", "Australia", "UAE", "Germany", "International businesses"];

export default function Testimonials() {
  return (
    <section className="section compact-section">
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
          <span key={market}>{market}</span>
        ))}
      </div>
    </section>
  );
}
