import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ArrowDown, MapPin, Mail } from "lucide-react";
import { PROFILE, CONTACT } from "../../data/profile";
import { GithubIcon, LinkedinIcon } from "../BrandIcons";
import Typewriter from "../Typewriter";

gsap.registerPlugin(SplitText);

export default function Hero() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Stagger List preset: character split on the short headline only.
      const split = new SplitText(".hero-name", { type: "words,chars", wordsClass: "hero-word" });
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(split.chars, { autoAlpha: 0, y: 24, rotateX: -40, duration: 0.7, stagger: 0.025 })
        .from(".hero-anim", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.08 }, "-=0.4");
      return () => split.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="hero" className="hero" ref={root} aria-labelledby="hero-name">
      <div className="container hero-inner">
        <p className="hero-kicker hero-anim">
          <span className="status-dot" aria-hidden="true" /> Olá, eu sou
        </p>
        <h1 id="hero-name" className="hero-name" aria-label={PROFILE.name}>
          {PROFILE.name}
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
