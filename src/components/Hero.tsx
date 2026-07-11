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
    <section id="home" className="hero section">
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

      <div className="hero-visual" aria-label="Software dashboard illustration">
        <div className="visual-window">
          <div className="window-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="dashboard-grid">
            <div className="metric-card wide">
              <small>Project pipeline</small>
              <strong>Web, App, CRM, ERP</strong>
              <div className="metric-line" />
            </div>
            <div className="metric-card">
              <small>Markets</small>
              <strong>USA UK UAE</strong>
            </div>
            <div className="metric-card accent">
              <small>Support</small>
              <strong>Launch + Care</strong>
            </div>
            <div className="phone-card">
              <div />
              <span />
              <span />
              <span />
            </div>
            <div className="code-card">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
