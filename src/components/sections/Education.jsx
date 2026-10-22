import { Award, BadgeCheck, GraduationCap } from "lucide-react";
import { CERTS, EDUCATION } from "../../data/profile";
import SectionHeader from "../SectionHeader";

const FEATURED = CERTS.filter((c) => c.featured);
const OTHERS = CERTS.filter((c) => !c.featured);

export default function Education() {
  return (
    <section id="formacao" className="section" aria-labelledby="edu-title">
      <div className="container">
        <SectionHeader index={5} eyebrow="Formação" title="Formação e certificações." id="edu-title" />
        <div className="edu-grid">
          <ul className="edu-degrees" data-reveal-group>
            {EDUCATION.map((e) => (
              <li key={e.degree} className="glass degree">
                <GraduationCap size={24} aria-hidden="true" className="degree-icon" />
                <div>
                  <h3>{e.degree}</h3>
                  <p className="degree-school">{e.school}</p>
                  <p className="muted mono">{e.period}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="certs-col">
            <h3 className="certs-title" data-reveal>Certificações em destaque</h3>
            <ul className="cert-featured" data-reveal-group>
              {FEATURED.map((c) => (
                <li key={c.title} className="glass cert-card">
                  <BadgeCheck size={22} aria-hidden="true" className="cert-card-icon" />
                  <div>
                    <p className="cert-name">{c.title}</p>
                    <p className="muted cert-meta">
                      {c.issuer} · {c.date}
                      {c.credential && <> · Credencial {c.credential}</>}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <ul className="glass cert-list" data-reveal>
              {OTHERS.map((c) => (
                <li key={c.title}>
                  <Award size={18} aria-hidden="true" />
                  <span>
                    {c.title}
                    <span className="muted cert-meta"> — {c.issuer}, {c.date}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
