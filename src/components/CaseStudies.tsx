import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import type { Company } from "../pages/HomePage";
import { portfolioProjects } from "../data/portfolioProjects";

type CaseStudiesProps = {
  company: Company;
};

const filters = ["All", "Websites", "Platforms", "Mobile App", "Open Source"] as const;
const PAGE_SIZE = 12;

export default function CaseStudies({ company }: CaseStudiesProps) {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const filtered = useMemo(
    () => (active === "All" ? portfolioProjects : portfolioProjects.filter((project) => project.category === active)),
    [active],
  );
  const visibleStudies = filtered.slice(0, limit);

  return (
    <section className="section case-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Featured work</span>
        <h2>Project previews built around business outcomes</h2>
        <p>
          A quick look at the kind of web, app, CRM, and commerce work Webtrivo
          Technologies delivers for growing teams.
        </p>
      </div>
      <div className="filter-row" aria-label="Portfolio filters">
        {filters.map((filter) => (
          <button className={active === filter ? "active" : ""} type="button" key={filter} onClick={() => { setActive(filter); setLimit(PAGE_SIZE); }}>
            {filter}
          </button>
        ))}
      </div>
      <div className="case-grid">
        {visibleStudies.map((study) => {
          const content = (
            <>
              <div className="case-thumbnail">
                {study.image ? (
                  <img src={study.image} alt={`${study.title} preview`} loading="lazy" />
                ) : (
                  <>
                    <span>{study.category}</span>
                    <b>{study.title}</b>
                  </>
                )}
              </div>
              <div className="case-card-body">
                <h3>{study.title}</h3>
                <p>{study.description}</p>
                <div className="tag-row">
                  <span>{study.category}</span>
                </div>
                {study.url && (
                  <small>
                    Visit project <ExternalLink size={13} />
                  </small>
                )}
              </div>
            </>
          );
          return study.url ? (
            <a className="case-card" href={study.url} key={study.title + study.url} target="_blank" rel="noopener noreferrer" data-tilt>
              {content}
            </a>
          ) : (
            <div className="case-card" key={study.title} data-tilt>
              {content}
            </div>
          );
        })}
      </div>
      {limit < filtered.length && (
        <div className="case-footer">
          <button className="secondary-button" type="button" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
            Load more projects
          </button>
        </div>
      )}
    </section>
  );
}
