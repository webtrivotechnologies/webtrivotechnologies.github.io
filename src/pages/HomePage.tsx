import About from "../components/About";
import BackToTop from "../components/BackToTop";
import CaseStudies from "../components/CaseStudies";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Portfolio from "../components/Portfolio";
import Pricing from "../components/Pricing";
import Process from "../components/Process";
import Services from "../components/Services";
import TechStack from "../components/TechStack";
import Testimonials from "../components/Testimonials";
import WhatsAppButton from "../components/WhatsAppButton";
import WhyChooseUs from "../components/WhyChooseUs";
import { useEffect } from "react";

export const company = {
  name: "Webtrivo Technologies",
  email: "riteshkumar7463867570@gmail.com",
  whatsappUrl: "https://wa.me/917463867570",
  whatsappPrefill:
    "https://wa.me/917463867570?text=Hello%20Webtrivo%20Technologies%2C%20I%20would%20like%20to%20discuss%20a%20project.",
  portfolioUrl: "https://vivanwebsolution.com/portfolio",
};

export type Company = typeof company;

export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            entry.target.querySelectorAll<HTMLElement>("[data-stagger]").forEach((child, index) => {
              child.style.transitionDelay = `${Math.min(index * 90, 540)}ms`;
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <Header company={company} />
      <main>
        <Hero company={company} />
        <Services />
        <TechStack />
        <About />
        <WhyChooseUs />
        <Process />
        <CaseStudies company={company} />
        <Portfolio company={company} />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact company={company} />
      </main>
      <Footer company={company} />
      <WhatsAppButton href={company.whatsappPrefill} />
      <BackToTop />
    </div>
  );
}
