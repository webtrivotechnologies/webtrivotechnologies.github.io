const steps = ["Discovery", "Planning", "Design", "Development", "Testing", "Launch and Support"];

export default function Process() {
  return (
    <section className="section">
      <div className="section-heading">
        <span className="eyebrow">Process</span>
        <h2>Structured delivery from idea to launch</h2>
      </div>
      <div className="process-list">
        {steps.map((step, index) => (
          <article className="process-step" key={step}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{step}</h3>
            <p>
              {index === 0
                ? "We clarify goals, users, scope, risks, and success criteria."
                : index === steps.length - 1
                  ? "We publish, monitor, refine, and support the product after launch."
                  : "We move through the work with clear checkpoints and visible progress."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
