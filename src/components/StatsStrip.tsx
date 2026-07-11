const stats = [
  { value: "50+", label: "Projects delivered" },
  { value: "7+", label: "Years experience" },
  { value: "15+", label: "Countries served" },
  { value: "98%", label: "Client satisfaction" },
];

export default function StatsStrip() {
  return (
    <section className="stats-strip" aria-label="Webtrivo Technologies delivery stats" data-reveal>
      {stats.map((stat) => (
        <div className="stat-item" key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
