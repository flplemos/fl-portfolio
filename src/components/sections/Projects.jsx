import { ArrowUpRight, Code2, Sparkles } from "lucide-react";
import { PROJECTS } from "../../data/profile";
import { GithubIcon } from "../BrandIcons";
import SectionHeader from "../SectionHeader";

export default function Projects() {
  return (
    <section id="projetos" className="section" aria-labelledby="proj-title">
      <div className="container">
        <SectionHeader index={4} eyebrow="Projetos" title="Coisas que construí." id="proj-title" />
        <ul className="projects" data-reveal-group>
          {PROJECTS.map((p) => (
            <li key={p.title} className="glass project">
              <div className="project-media">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={`Prévia de ${p.title}`}
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="project-media-fallback" aria-hidden="true">
                    <Code2 size={40} />
                  </span>
                )}
              </div>
              {p.highlight && (
                <p className="badge badge-accent">
                  <Sparkles size={14} aria-hidden="true" /> Destaque
                </p>
              )}
              <h3 className="project-title">{p.title}</h3>
              <p className="muted project-desc">{p.desc}</p>
              <ul className="tag-list" aria-label={`Tecnologias de ${p.title}`}>
                {p.tags.map((t) => (
                  <li key={t} className="tag">{t}</li>
                ))}
              </ul>
              <div className="project-links">
                <a href={p.code} target="_blank" rel="noreferrer" className="link-btn">
                  <GithubIcon size={18} /> Código<span className="sr-only"> de {p.title} (abre em nova aba)</span>
                </a>
                {p.live && (
                  <a href={p.live} target="_blank" rel="noreferrer" className="link-btn link-btn-accent">
                    Ver online <ArrowUpRight size={18} aria-hidden="true" />
                    <span className="sr-only"> — {p.title} (abre em nova aba)</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
