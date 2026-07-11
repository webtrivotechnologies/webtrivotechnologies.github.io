import About from "../components/About";
import BackToTop from "../components/BackToTop";
import CaseStudies from "../components/CaseStudies";
import ClientLogos from "../components/ClientLogos";
import Contact from "../components/Contact";
import ContactLauncher from "../components/ContactLauncher";
import CookieNotice from "../components/CookieNotice";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import MobileCTA from "../components/MobileCTA";
import PageLoader from "../components/PageLoader";
import Portfolio from "../components/Portfolio";
import Pricing from "../components/Pricing";
import Process from "../components/Process";
import ScrollProgress from "../components/ScrollProgress";
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

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion) return;

    const hero = document.querySelector<HTMLElement>(".hero");
    const visual = document.querySelector<HTMLElement>(".hero-visual");

    const handleScroll = () => {
      if (!visual) return;
      visual.style.setProperty("--hero-parallax", `${Math.min(window.scrollY * 0.035, 18)}px`);
    };

    const handlePointer = (event: PointerEvent) => {
      if (!hero || !finePointer) return;
      const rect = hero.getBoundingClientRect();
      hero.style.setProperty("--cursor-x", `${event.clientX - rect.left}px`);
      hero.style.setProperty("--cursor-y", `${event.clientY - rect.top}px`);
    };

    const tiltCards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
    const handleTilt = (event: PointerEvent) => {
      if (!finePointer) return;
      const card = event.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 7).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 7).toFixed(2)}deg`);
    };
    const resetTilt = (event: PointerEvent) => {
      const card = event.currentTarget as HTMLElement;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    hero?.addEventListener("pointermove", handlePointer);
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", handleTilt);
      card.addEventListener("pointerleave", resetTilt);
    });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      hero?.removeEventListener("pointermove", handlePointer);
      tiltCards.forEach((card) => {
        card.removeEventListener("pointermove", handleTilt);
        card.removeEventListener("pointerleave", resetTilt);
      });
    };
  }, []);

  return (
    <div className="site-shell">
      <PageLoader />
      <ScrollProgress />
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
        <ClientLogos />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact company={company} />
      </main>
      <Footer company={company} />
      <ContactLauncher company={company} />
      <WhatsAppButton href={company.whatsappPrefill} />
      <BackToTop />
      <MobileCTA />
      <CookieNotice />
    </div>
  );
}
