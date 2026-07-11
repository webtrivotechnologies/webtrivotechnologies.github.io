import { MessageCircle } from "lucide-react";

type WhatsAppButtonProps = {
  href: string;
};

export default function WhatsAppButton({ href }: WhatsAppButtonProps) {
  return (
    <a
      className="whatsapp-float"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Webtrivo Technologies on WhatsApp"
    >
      <span>Chat with us</span>
      <MessageCircle size={24} />
    </a>
  );
}
