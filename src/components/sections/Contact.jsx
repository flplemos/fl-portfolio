import { useState } from "react";
import { Check, Copy, Globe, Mail, MapPin, Phone } from "lucide-react";
import { CONTACT, PROFILE } from "../../data/profile";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "../BrandIcons";
import SectionHeader from "../SectionHeader";

const CHANNELS = [
  { icon: Phone, label: "Telefone", value: CONTACT.phone, href: `tel:+5584991203743` },
  { icon: WhatsappIcon, label: "WhatsApp", value: "Enviar mensagem", href: CONTACT.whatsapp, external: true },
  { icon: LinkedinIcon, label: "LinkedIn", value: "in/felipelemos777", href: CONTACT.linkedin, external: true },
  { icon: GithubIcon, label: "GitHub", value: "flplemos", href: CONTACT.github, external: true },
  { icon: Globe, label: "Portfólio", value: "fl-portfolio-seven.vercel.app", href: CONTACT.portfolio, external: true },
];

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  return (
    <section id="contato" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <SectionHeader index={6} eyebrow="Contato" title="Vamos construir algo juntos?" id="contact-title" />

        <div className="glass contact-hero" data-reveal>
          <p className="muted">Escreva para</p>
          <a className="contact-email" href={`mailto:${CONTACT.email}`}>
            <Mail size={22} aria-hidden="true" /> {CONTACT.email}
          </a>
          <button type="button" className="btn btn-ghost btn-sm" onClick={copyEmail}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? "Copiado!" : "Copiar e-mail"}
          </button>
          <span className="sr-only" aria-live="polite">{copied ? "E-mail copiado" : ""}</span>
        </div>

        <ul className="channels" data-reveal-group>
          {CHANNELS.map((ch) => (
            <li key={ch.label}>
              <a
                href={ch.href}
                className="glass channel"
                {...(ch.external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                <ch.icon size={20} aria-hidden="true" />
                <span>
                  <span className="channel-label">{ch.label}</span>
                  <span className="channel-value">{ch.value}</span>
                </span>
                {ch.external && <span className="sr-only"> (abre em nova aba)</span>}
              </a>
            </li>
          ))}
        </ul>

        <p className="contact-location muted" data-reveal>
          <MapPin size={16} aria-hidden="true" /> {PROFILE.location}
        </p>
      </div>
    </section>
  );
}
