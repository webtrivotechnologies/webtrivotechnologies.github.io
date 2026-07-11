import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import type { Company } from "../pages/HomePage";

type HeroProps = {
  company: Company;
};

const trustItems = [
  "7+ Years of Experience",
  "Global Client Support",
  "Custom-Built Solutions",
  "Reliable Development Team",
];

export default function Hero({ company }: HeroProps) {
  return (
    <section id="home" className="hero section" data-reveal>
      <div className="hero-copy">
        <span className="eyebrow">International technology partner</span>
        <h1>Transforming Ideas Into Powerful Digital Solutions</h1>
        <p>
          We build modern websites, mobile apps, CRM, ERP, e-commerce platforms,
          and custom software solutions for businesses worldwide.
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#contact">
            Start Your Project <ArrowRight size={18} />
          </a>
          <a
            className="secondary-button"
            href={company.portfolioUrl}
            target="_blank"
            rel="noreferrer"
          >
            View Our Portfolio <ExternalLink size={17} />
          </a>
        </div>
        <div className="trust-row" aria-label="Trust indicators">
          {trustItems.map((item) => (
            <span key={item}>
              <ShieldCheck size={16} /> {item}
            </span>
          ))}
        </div>
      </div>

      <div className="hero-visual" aria-label="Polished product dashboard illustration">
        <div className="visual-window product-mockup">
          <div className="window-bar">
            <span className="dot red" />
            <span className="dot amber" />
            <span className="dot green" />
            <strong>Webtrivo Command Center</strong>
          </div>
          <div className="dashboard-grid">
            <div className="metric-card wide premium-panel">
              <div>
                <small>Project pipeline</small>
                <strong>Web, App, CRM, ERP</strong>
              </div>
              <div className="chart-card">
                <i style={{ height: "42%" }} />
                <i style={{ height: "64%" }} />
                <i style={{ height: "52%" }} />
                <i style={{ height: "82%" }} />
                <i style={{ height: "70%" }} />
              </div>
            </div>
            <div className="metric-card stat-panel">
              <small>Markets</small>
              <strong>USA · UK · UAE</strong>
              <span>International delivery desk</span>
            </div>
            <div className="metric-card accent stat-panel">
              <small>Support</small>
              <strong>Launch + Care</strong>
              <span>Maintenance plans ready</span>
            </div>
            <div className="phone-card">
              <div className="phone-screen">
                <b />
                <span />
                <span />
              </div>
            </div>
            <div className="code-card">
              <span className="long" />
              <span />
              <span className="medium" />
              <span className="short" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
