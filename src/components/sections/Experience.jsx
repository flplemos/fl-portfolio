import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin } from "lucide-react";
import { EXPERIENCES } from "../../data/profile";
import SectionHeader from "../SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(root);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // The rail draws itself with the scroll; each node lights up as the rail reaches it.
      gsap.fromTo(
        ".timeline-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: 1 },
        },
      );
      gsap.utils.toArray(".timeline-item").forEach((item) => {
        gsap.from(item.querySelector(".timeline-card"), {
          autoAlpha: 0,
          x: 24,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" },
        });
        ScrollTrigger.create({
          trigger: item,
          start: "top 62%",
          toggleClass: { targets: item, className: "is-reached" },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="experiencia" className="section" aria-labelledby="exp-title" ref={root}>
      <div className="container">
        <SectionHeader index={3} eyebrow="Experiência" title="Trajetória profissional." id="exp-title" />
        <div className="timeline">
          <span className="timeline-rail" aria-hidden="true">
            <span className="timeline-progress" />
          </span>
          <ol className="timeline-list">
          {EXPERIENCES.map((xp) => (
            <li key={`${xp.company}-${xp.period}`} className={`timeline-item ${xp.current ? "is-current" : ""}`}>
              <span className="timeline-node" aria-hidden="true" />
              <article className="glass timeline-card">
                <p className="timeline-period">
                  <time>{xp.period}</time>
                  {xp.duration && <span className="muted"> · {xp.duration}</span>}
                  {xp.current && <span className="badge">Atual</span>}
                </p>
                <h3 className="timeline-role">{xp.role}</h3>
                <p className="timeline-company">{xp.company}</p>
                {xp.location && (
                  <p className="timeline-location muted">
                    <MapPin size={14} aria-hidden="true" /> {xp.location}
                  </p>
                )}
              </article>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
