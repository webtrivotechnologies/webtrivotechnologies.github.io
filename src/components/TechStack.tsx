const tools = ["React", "Node.js", "Flutter", "AWS", "Shopify", "Laravel", "Firebase", "Stripe"];

export default function TechStack() {
  return (
    <section className="tech-stack" data-reveal>
      <span className="eyebrow">Tools we use</span>
      <div className="tool-row">
        {tools.map((tool) => (
          <span key={tool}>{tool}</span>
        ))}
      </div>
    </section>
  );
}
