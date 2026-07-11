import type { Company } from "../pages/HomePage";

type FooterProps = {
  company: Company;
};

const footerServices = [
  "Website Development",
  "Mobile App Development",
  "CRM Development",
  "ERP Solutions",
  "E-commerce Development",
  "Maintenance and Support",
];

export default function Footer({ company }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h2>{company.name}</h2>
          <p>
            Professional website, app, CRM, ERP, e-commerce, UI/UX, and custom
            software development for businesses worldwide.
          </p>
        </div>
        <div>
          <h3>Services</h3>
          <ul>
            {footerServices.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={company.whatsappPrefill} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <a href={company.portfolioUrl} target="_blank" rel="noreferrer">
            Portfolio
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>Copyright {new Date().getFullYear()} Webtrivo Technologies. All rights reserved.</span>
      </div>
    </footer>
  );
}
