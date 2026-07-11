import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Portfolio from "../components/Portfolio";
import Process from "../components/Process";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import WhatsAppButton from "../components/WhatsAppButton";
import WhyChooseUs from "../components/WhyChooseUs";

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
  return (
    <div className="site-shell">
      <Header company={company} />
      <main>
        <Hero company={company} />
        <Services />
        <About />
        <WhyChooseUs />
        <Process />
        <Portfolio company={company} />
        <Testimonials />
        <Contact company={company} />
      </main>
      <Footer company={company} />
      <WhatsAppButton href={company.whatsappPrefill} />
    </div>
  );
}
