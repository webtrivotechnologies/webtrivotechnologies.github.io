import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import type { Company } from "../pages/HomePage";

type CaseStudiesProps = {
  company: Company;
};

const studies = [
  {
    name: "CommerceFlow",
    category: "E-commerce platform",
    result: "40% faster checkout flow for a growing online retailer.",
    metric: "40%",
    type: "E-commerce",
    stack: ["React", "Node", "Stripe"],
  },
  {
    name: "OpsSuite CRM",
    category: "Sales and operations CRM",
    result: "Cleaner lead tracking across distributed sales teams.",
    metric: "CRM",
    type: "CRM",
    stack: ["React", "Laravel", "MySQL"],
  },
  {
    name: "FieldPro Mobile",
    category: "Mobile workforce app",
    result: "Simplified reporting for remote service staff.",
    metric: "Mobile",
    type: "Mobile",
    stack: ["Flutter", "Firebase", "AWS"],
  },
  {
    name: "StockLine ERP",
    category: "Manufacturing ERP",
    result: "30% reduction in stock discrepancies across inventory and finance.",
    metric: "30%",
    type: "ERP",
    stack: ["React", "Node", "PostgreSQL"],
  },
  {
    name: "CarePoint Scheduler",
    category: "Healthcare booking platform",
    result: "Cut no-shows by 25% with automated appointment reminders.",
    metric: "25%",
    type: "Web",
    stack: ["Next.js", "Twilio", "Cloud"],
  },
  {
    name: "PropertyHub Portal",
    category: "Real estate listings and CRM",
    result: "Reduced lead response time from hours to minutes.",
    metric: "CRM",
    type: "CRM",
    stack: ["React", "Maps API", "CRM"],
  },
];

const filters = ["All", "Web", "Mobile", "CRM", "ERP", "E-commerce"];

export default function CaseStudies({ company }: CaseStudiesProps) {
  const [active, setActive] = useState("All");
  const visibleStudies = useMemo(
    () => (active === "All" || active === "Web" ? studies : studies.filter((study) => study.type === active)),
    [active],
  );

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
          <button className={active === filter ? "active" : ""} type="button" key={filter} onClick={() => setActive(filter)}>
            {filter}
          </button>
        ))}
      </div>
      <div className="case-grid">
        {visibleStudies.map((study) => (
          <a className="case-card" href={company.portfolioUrl} key={study.name} target="_blank" rel="noreferrer" data-reveal data-stagger data-tilt>
            <div className="case-thumbnail">
              <em>{study.metric}</em>
              <span>{study.category}</span>
              <b>{study.name}</b>
            </div>
            <div className="case-card-body">
              <h3>{study.name}</h3>
              <p>{study.result}</p>
              <div className="tag-row">
                {study.stack.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <small>
                View portfolio <ExternalLink size={13} />
              </small>
            </div>
          </a>
        ))}
      </div>
      <div className="carousel-dots" aria-hidden="true">
        {visibleStudies.map((study) => (
          <span key={study.name} />
        ))}
      </div>
      <div className="case-footer">
        <a className="secondary-button" href={company.portfolioUrl} target="_blank" rel="noreferrer">
          View all projects <ExternalLink size={16} />
        </a>
      </div>
    </section>
  );
}
