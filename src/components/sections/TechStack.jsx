import { BrainCircuit, LayoutTemplate, Server, Workflow } from "lucide-react";
import { STACK } from "../../data/profile";
import SectionHeader from "../SectionHeader";

const ICONS = { lowcode: Workflow, ai: BrainCircuit, front: LayoutTemplate, back: Server };

export default function TechStack() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="container">
        <SectionHeader index={2} eyebrow="Tech Stack" title="Ferramentas que uso para construir." id="stack-title" />
        <ul className="bento" data-reveal-group>
          {STACK.map(({ key, title, blurb, items }) => {
            const Icon = ICONS[key];
            return (
              <li key={key} className={`glass bento-card bento-${key}`}>
                <div className="bento-head">
                  <span className="bento-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                </div>
                <p className="muted">{blurb}</p>
                <ul className="tag-list" aria-label={`Tecnologias de ${title}`}>
                  {items.map((it) => (
                    <li key={it} className="tag">{it}</li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
