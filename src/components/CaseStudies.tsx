import { ExternalLink } from "lucide-react";
import type { Company } from "../pages/HomePage";

type CaseStudiesProps = {
  company: Company;
};

const studies = [
  {
    name: "CommerceFlow",
    category: "E-commerce platform",
    result: "40% faster checkout flow",
    stack: ["React", "Node", "Stripe"],
  },
  {
    name: "OpsSuite CRM",
    category: "Sales and operations CRM",
    result: "Cleaner lead tracking across teams",
    stack: ["React", "Laravel", "MySQL"],
  },
  {
    name: "FieldPro Mobile",
    category: "Mobile workforce app",
    result: "Simplified reporting for remote staff",
    stack: ["Flutter", "Firebase", "AWS"],
  },
];

export default function CaseStudies({ company }: CaseStudiesProps) {
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
      <div className="case-grid">
        {studies.map((study) => (
          <a className="case-card" href={company.portfolioUrl} key={study.name} target="_blank" rel="noreferrer">
            <div className="case-thumbnail">
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
    </section>
  );
}
