import { Fragment } from "react";
import { ArrowDown, MapPin, Mail } from "lucide-react";
import { PROFILE, CONTACT } from "../../data/profile";
import { GithubIcon, LinkedinIcon } from "../BrandIcons";
import Typewriter from "../Typewriter";

// The intro is pure CSS (see "HERO INTRO" in index.css) so it starts with the first paint:
// the name is split into characters here and each one carries its stagger index.
const NAME_WORDS = PROFILE.name.split(" ").reduce((words, word) => {
  const start = words.reduce((n, w) => n + w.chars.length, 0);
  return [...words, { start, chars: [...word] }];
}, []);

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-name">
      <div className="container hero-inner">
        <p className="hero-kicker hero-anim">
          <span className="status-dot" aria-hidden="true" /> Olá, eu sou
        </p>
        <h1 id="hero-name" className="hero-name" aria-label={PROFILE.name}>
          {NAME_WORDS.map(({ start, chars }, w) => (
            <Fragment key={start}>
              {w > 0 && " "}
              <span className="hero-word" aria-hidden="true">
                {chars.map((ch, i) => (
                  <span key={i} className="hero-char" style={{ "--i": start + i }}>{ch}</span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="hero-typed hero-anim">
          <Typewriter phrases={PROFILE.typed} />
        </p>
        <p className="hero-role hero-anim">{PROFILE.role}</p>
        <ul className="hero-focus hero-anim" aria-label="Principais tecnologias">
          {PROFILE.focus.map((f) => (
            <li key={f} className="chip">{f}</li>
          ))}
        </ul>
        <p className="hero-location hero-anim">
          <MapPin size={16} aria-hidden="true" /> {PROFILE.location}
        </p>

        <div className="hero-ctas hero-anim">
          <a href="#projetos" className="btn btn-primary">Ver projetos</a>
          <a href={`mailto:${CONTACT.email}`} className="btn btn-ghost">
            <Mail size={18} aria-hidden="true" /> Fale comigo
          </a>
        </div>

        <ul className="hero-social hero-anim" aria-label="Redes">
          <li>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" className="icon-btn" aria-label="GitHub (abre em nova aba)">
              <GithubIcon />
            </a>
          </li>
          <li>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="icon-btn" aria-label="LinkedIn (abre em nova aba)">
              <LinkedinIcon />
            </a>
          </li>
        </ul>
      </div>

      <a href="#sobre" className="scroll-cue" aria-label="Rolar para Sobre">
        <ArrowDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}
