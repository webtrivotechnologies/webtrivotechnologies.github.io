import {
  Code2,
  LayoutDashboard,
  MonitorSmartphone,
  Palette,
  ServerCog,
  ShoppingCart,
} from "lucide-react";

const services = [
  {
    title: "Website Development",
    description: "Fast, responsive, SEO-aware websites built for trust, clarity, and conversion.",
    icon: MonitorSmartphone,
  },
  {
    title: "Mobile App Development",
    description: "Practical iOS, Android, and cross-platform apps with clean user journeys.",
    icon: LayoutDashboard,
  },
  {
    title: "CRM Development",
    description: "Custom customer, sales, lead, and workflow systems tailored to your operations.",
    icon: ServerCog,
  },
  {
    title: "ERP Solutions",
    description: "Connected inventory, finance, reporting, and business process software.",
    icon: Code2,
  },
  {
    title: "E-commerce Development",
    description: "Modern product catalogs, checkout flows, admin panels, and integrations.",
    icon: ShoppingCart,
  },
  {
    title: "Custom Software",
    description: "Scalable platforms, portals, dashboards, automations, and internal tools.",
    icon: Palette,
  },
];

export default function Services() {
  return (
    <section id="services" className="section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">Services</span>
        <h2>Digital engineering for growing businesses</h2>
        <p>
          From first launch to long-term platform support, Webtrivo Technologies
          helps teams build software that is clear, maintainable, and ready to scale.
        </p>
      </div>

      <div className="service-grid">
        {services.map(({ title, description, icon: Icon }) => (
          <article className="service-card" key={title} data-reveal data-stagger>
            <span className="card-icon" aria-hidden="true">
              <Icon size={24} />
            </span>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
