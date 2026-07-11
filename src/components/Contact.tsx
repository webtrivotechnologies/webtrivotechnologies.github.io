import { Mail, MessageCircle, Send } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import type { Company } from "../pages/HomePage";

type ContactProps = {
  company: Company;
};

const serviceOptions = [
  "Website Development",
  "Mobile App Development",
  "Custom Software Development",
  "CRM Development",
  "ERP Solutions",
  "E-commerce Development",
  "UI/UX Design",
  "Maintenance and Support",
];

export default function Contact({ company }: ContactProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: serviceOptions[0],
    details: "",
  });

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const message = [
      "Hello Webtrivo Technologies, I would like to discuss a project.",
      "",
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone/WhatsApp: ${form.phone}`,
      `Service: ${form.service}`,
      `Project details: ${form.details}`,
    ].join("\n");

    window.open(`${company.whatsappUrl}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="contact" className="section contact-section" data-reveal>
      <div className="contact-copy">
        <span className="eyebrow">Contact</span>
        <h2>Tell us what you want to build</h2>
        <p>
          Share your project goals and we will continue the conversation on
          WhatsApp with a clear next step. No fake backend submission is used on
          GitHub Pages.
        </p>
        <div className="contact-links">
          <a href={`mailto:${company.email}`}>
            <Mail size={18} /> {company.email}
          </a>
          <a href={company.whatsappPrefill} target="_blank" rel="noreferrer">
            <MessageCircle size={18} /> WhatsApp Webtrivo
          </a>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@company.com"
          />
        </label>
        <label>
          Phone or WhatsApp
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 0100" />
        </label>
        <label>
          Service
          <select name="service" value={form.service} onChange={handleChange}>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </label>
        <label className="full-field">
          Project details
          <textarea
            name="details"
            value={form.details}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Tell us about your business, timeline, and goals."
          />
        </label>
        <button className="primary-button form-button" type="submit">
          Submit via WhatsApp <Send size={17} />
        </button>
      </form>
    </section>
  );
}
