import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Company } from "../pages/HomePage";
import ThemeToggle from "./ThemeToggle";

type HeaderProps = {
  company: Company;
};

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];

export default function Header({ company }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1));
    const update = () => {
      setScrolled(window.scrollY > 12);
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (section && section.offsetTop - 150 <= window.scrollY) {
          current = id;
        }
      }
      if (current) setActive(`#${current}`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="brand" href="#home" aria-label={`${company.name} home`}>
        <span className="brand-mark">W</span>
        <span>
          <strong>Webtrivo</strong>
          <small>Technologies</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navItems.map((item) => (
          <a className={active === item.href ? "active" : ""} key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <ThemeToggle />

      <a className="header-cta" href="#contact">
        Get a Free Consultation
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <div className="mobile-panel">
          {navItems.map((item) => (
            <a className={active === item.href ? "active" : ""} key={item.href} href={item.href} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <ThemeToggle />
          <a className="mobile-cta" href="#contact" onClick={closeMenu}>
            Get a Free Consultation
          </a>
        </div>
      )}
    </header>
  );
}
