import { WhatsappIcon } from "@/components/ui/BrandIcons";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/2348012345678"
      className="wa-float"
      aria-label="Chat with us on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
    >
      <WhatsappIcon />
    </a>
  );
}
