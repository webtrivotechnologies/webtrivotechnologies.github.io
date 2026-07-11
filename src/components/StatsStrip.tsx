import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 50, suffix: "+", label: "Projects delivered" },
  { value: 7, suffix: "+", label: "Years experience" },
  { value: 15, suffix: "+", label: "Countries served" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

export default function StatsStrip() {
  const ref = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValues(stats.map((stat) => stat.value));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const start = performance.now();
        const duration = 1250;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValues(stats.map((stat) => Math.round(stat.value * eased)));
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="stats-strip hero-stats" aria-label="Webtrivo Technologies delivery stats">
      {stats.map((stat, index) => (
        <div className="stat-item" key={stat.label}>
          <strong>
            {values[index]}
            {stat.suffix}
          </strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
