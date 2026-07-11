import { ExternalLink } from "lucide-react";
import type { Company } from "../pages/HomePage";

type PortfolioProps = {
  company: Company;
};

export default function Portfolio({ company }: PortfolioProps) {
  return (
    <section id="portfolio" className="section portfolio-band">
      <div>
        <span className="eyebrow">Portfolio</span>
        <h2>Explore selected project work</h2>
        <p>
          Review examples of delivered web experiences, digital platforms, and
          business software work through our portfolio page.
        </p>
      </div>
      <a className="primary-button light" href={company.portfolioUrl} target="_blank" rel="noreferrer">
        View Portfolio <ExternalLink size={18} />
      </a>
    </section>
  );
}
