import { ArrowUpRight } from "lucide-react";
import { AnimatePresence, LayoutGroup, animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Company } from "../pages/HomePage";
import { portfolioProjects } from "../data/portfolioProjects";
import type { PortfolioProject } from "../data/portfolioProjects";

type CaseStudiesProps = {
  company: Company;
};

const filters = ["All", "Websites", "Platforms", "Mobile App", "Open Source"] as const;
type Filter = (typeof filters)[number];
const PAGE_SIZE = 12;

function displayHost(url: string) {
  try {
    const { hostname, pathname } = new URL(url);
    const host = hostname.replace(/^www\./, "");
    if (host === "github.com") return `github.com${pathname.replace(/\/$/, "")}`;
    return host;
  } catch {
    return url;
  }
}

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{value}</span>;
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number; key?: string }) {
  const reduce = useReducedMotion();
  const host = project.url ? displayHost(project.url) : "Private project";

  const inner = (
    <>
      <div className="pf-frame">
        <div className="pf-screen">
          {project.image ? (
            <img src={project.image} alt={`${project.title} preview`} loading="lazy" decoding="async" />
          ) : (
            <div className="pf-fallback" aria-hidden="true">
              <b>{project.title.trim().charAt(0).toUpperCase()}</b>
              <em>{project.category}</em>
            </div>
          )}
          {project.url && (
            <div className="pf-overlay" aria-hidden="true">
              <span>
                Visit project <ArrowUpRight size={16} />
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="pf-body">
        <span className="pf-chip">{project.category}</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="pf-foot">
          <span className="pf-host">{host}</span>
          {project.url && (
            <span className="pf-go" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          )}
        </div>
      </div>
    </>
  );

  const motionProps = {
    layout: !reduce,
    initial: reduce ? false : { opacity: 0, y: 36, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    exit: reduce ? undefined : { opacity: 0, scale: 0.94, transition: { duration: 0.18 } },
    viewport: { once: true, margin: "0px 0px -60px 0px" },
    transition: { type: "spring" as const, stiffness: 140, damping: 20, delay: (index % 3) * 0.07 },
    whileHover: reduce ? undefined : { y: -8 },
  };

  return project.url ? (
    <motion.a
      className="pf-card"
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} – open project in a new tab`}
      {...motionProps}
    >
      {inner}
    </motion.a>
  ) : (
    <motion.div className="pf-card is-static" {...motionProps}>
      {inner}
    </motion.div>
  );
}

export default function CaseStudies(_props: CaseStudiesProps) {
  const [active, setActive] = useState<Filter>("All");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: portfolioProjects.length };
    for (const project of portfolioProjects) map[project.category] = (map[project.category] ?? 0) + 1;
    return map;
  }, []);

  const filtered = useMemo(
    () => (active === "All" ? portfolioProjects : portfolioProjects.filter((project) => project.category === active)),
    [active],
  );
  const visible = filtered.slice(0, limit);
  const liveCount = portfolioProjects.filter((project) => project.url).length;

  return (
    <section id="projects" className="section pf-section">
      <div className="pf-orb pf-orb-a" aria-hidden="true" />
      <div className="pf-orb pf-orb-b" aria-hidden="true" />

      <motion.div
        className="pf-head"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className="eyebrow">Our work</span>
        <h2>
          Real products, <span className="pf-gradient-text">live and in production</span>
        </h2>
        <p>
          Websites, platforms, mobile apps and open-source builds delivered by Webtrivo Technologies. Every card links
          to the real project.
        </p>
        <div className="pf-stats">
          <div>
            <strong>
              <CountUp to={portfolioProjects.length} />+
            </strong>
            <span>Projects</span>
          </div>
          <div>
            <strong>
              <CountUp to={liveCount} />
            </strong>
            <span>Live links</span>
          </div>
          <div>
            <strong>
              <CountUp to={filters.length - 1} />
            </strong>
            <span>Categories</span>
          </div>
        </div>
      </motion.div>

      <LayoutGroup id="pf-filters">
        <div className="pf-filters" role="tablist" aria-label="Project categories">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={active === filter}
              className={active === filter ? "is-active" : ""}
              onClick={() => {
                setActive(filter);
                setLimit(PAGE_SIZE);
              }}
            >
              {active === filter && <motion.span layoutId="pf-pill" className="pf-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="pf-filter-label">
                {filter}
                <small>{counts[filter] ?? 0}</small>
              </span>
            </button>
          ))}
        </div>
      </LayoutGroup>

      <motion.div className="pf-grid" layout>
        <AnimatePresence initial={false}>
          {visible.map((project, index) => (
            <ProjectCard key={project.title + project.url} project={project} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="pf-more">
        <div className="pf-progress" aria-hidden="true">
          <motion.span animate={{ width: `${(visible.length / filtered.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
        </div>
        <p>
          Showing {visible.length} of {filtered.length} projects
        </p>
        {limit < filtered.length && (
          <button className="pf-more-btn" type="button" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
            Load more projects <ArrowUpRight size={16} />
          </button>
        )}
      </div>
    </section>
  );
}
