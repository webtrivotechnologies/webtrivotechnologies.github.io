import { Calendar, Mail, MessageCircle, X } from "lucide-react";
import { useState } from "react";
import type { Company } from "../pages/HomePage";
import WhatsAppIcon from "./WhatsAppIcon";

type ContactLauncherProps = {
  company: Company;
};

export default function ContactLauncher({ company }: ContactLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`contact-launcher${open ? " open" : ""}`}>
      <div className="contact-options" aria-hidden={!open}>
        <a href={company.whatsappPrefill} target="_blank" rel="noreferrer">
          <WhatsAppIcon size={17} /> WhatsApp
        </a>
        <a href={`mailto:${company.email}`}>
          <Mail size={17} /> Email
        </a>
        <a href="#contact">
          <Calendar size={17} /> Book a call
        </a>
      </div>
      <button type="button" aria-label={open ? "Close contact options" : "Open contact options"} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
