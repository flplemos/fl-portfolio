import { Briefcase, GraduationCap, MapPin } from "lucide-react";
import { PROFILE } from "../../data/profile";
import SectionHeader from "../SectionHeader";

const FACTS = [
  { icon: Briefcase, label: "Atualmente", value: "Desenvolvedor Mendix · TrueChange" },
  { icon: GraduationCap, label: "Formação", value: "Análise e Desenvolvimento de Sistemas" },
  { icon: MapPin, label: "Base", value: "Natal, RN — Brasil" },
];

export default function About() {
  return (
    <section id="sobre" className="section" aria-labelledby="sobre-title">
      <div className="container about-grid">
        <div className="about-copy">
          <SectionHeader index={1} eyebrow="Sobre" title="Código, automação e IA a serviço de quem usa." id="sobre-title" />
          <div className="lead" data-reveal>
            {PROFILE.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <ul className="about-facts" data-reveal-group>
          {FACTS.map((fact) => (
            <li key={fact.label} className="glass fact">
              <fact.icon size={20} aria-hidden="true" className="fact-icon" />
              <div>
                <p className="fact-label">{fact.label}</p>
                <p className="fact-value">{fact.value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
