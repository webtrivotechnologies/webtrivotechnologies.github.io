const clients = ["SaaS Teams", "Retail Brands", "Healthcare Ops", "Fintech Startups", "Service Firms"];

export default function ClientLogos() {
  return (
    <section className="client-logo-strip" aria-label="Types of clients Webtrivo supports" data-reveal>
      <span className="eyebrow">Teams we support</span>
      <div className="client-logo-row">
        {clients.map((client) => (
          <span key={client}>{client}</span>
        ))}
      </div>
    </section>
  );
}
