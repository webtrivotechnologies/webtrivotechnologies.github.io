import { ChevronDown } from "lucide-react";
import { useState } from "react";
import WhatsAppIcon from "./WhatsAppIcon";

const faqs = [
  {
    question: "How long does a typical project take?",
    answer: "A focused website can take a few weeks, while CRM, ERP, mobile app, and custom software builds depend on scope, integrations, and review cycles.",
  },
  {
    question: "Can you support us after launch?",
    answer: "Yes. Webtrivo Technologies offers maintenance, performance improvements, bug fixes, hosting support, and feature iteration after launch.",
  },
  {
    question: "Do you sign NDAs?",
    answer: "Yes. We can work under NDA and keep product ideas, business processes, and technical details confidential.",
  },
  {
    question: "Can you work with our existing tech stack?",
    answer: "Yes. We can build new systems or improve existing React, Node, Laravel, Shopify, Flutter, cloud, CRM, and e-commerce setups.",
  },
  {
    question: "How do you communicate during projects?",
    answer: "We use clear milestones, regular updates, practical demos, and direct communication so decisions stay visible.",
  },
  {
    question: "How do we get a cost estimate?",
    answer: "Share your goals, timeline, must-have features, and integrations through the contact form or WhatsApp. We will suggest a realistic project path.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq-section" data-reveal>
      <div className="section-heading">
        <span className="eyebrow">FAQ</span>
        <h2>Questions buyers usually ask before starting</h2>
      </div>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div className={`faq-item${open === index ? " open" : ""}`} key={item.question}>
            <button type="button" onClick={() => setOpen(open === index ? -1 : index)}>
              <span>{item.question}</span>
              <ChevronDown size={18} />
            </button>
            <div className="faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="faq-nudge">
        <strong>Still have questions?</strong>
        <a href="https://wa.me/917463867570?text=Hello%20Webtrivo%20Technologies%2C%20I%20have%20a%20question%20about%20a%20project." target="_blank" rel="noreferrer">
          <WhatsAppIcon size={17} /> Chat with us on WhatsApp
        </a>
      </div>
    </section>
  );
}
