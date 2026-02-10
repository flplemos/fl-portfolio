import { useState, useEffect, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Shorts Summary",
    desc: "App web que resume vídeos curtos do YouTube usando IA. Stack completa com Vite, Node.js, Express, FFmpeg e Xenova Transformers.",
    tags: ["JavaScript", "Node.js", "IA", "Vite"],
    code: "https://github.com/flplemos/shorts-summary",
    live: null,
    highlight: true,
  },
  {
    title: "Costs — Gerenciador de Projetos",
    desc: "Sistema completo de gerenciamento de projetos e custos construído com React, com roteamento e estado global.",
    tags: ["React", "JavaScript", "CSS"],
    code: "https://github.com/flplemos/costs",
    live: "https://costs-sepia.vercel.app/",
  },
  {
    title: "Pokédex Felps Edition",
    desc: "Pokédex interativa consumindo PokéAPI com gráficos Chart.js para exibir stats dos Pokémons.",
    tags: ["JavaScript", "PokéAPI", "Chart.js"],
    code: "https://github.com/flplemos/pokedex",
    live: "https://flplemos.github.io/pokedex/index.html",
  },
  {
    title: "GTA 5 — Landing Page",
    desc: "Landing page temática do GTA V com animações, parallax e design totalmente responsivo.",
    tags: ["HTML", "CSS", "JavaScript"],
    code: "https://github.com/flplemos/gta-v-landing-page",
    live: "https://flplemos.github.io/gta-v-landing-page/index.html",
  },
  {
    title: "Sunnyside Agency",
    desc: "Desafio Frontend Mentor com layout responsivo complexo usando Bootstrap e técnicas modernas de CSS.",
    tags: ["Bootstrap", "CSS", "Responsivo"],
    code: "https://github.com/flplemos/frontend-mentor/tree/main/sunnyside-agency-landing-page-main",
    live: "https://flplemos.github.io/frontend-mentor/sunnyside-agency-landing-page-main/index.html",
  },
  {
    title: "Password Generator",
    desc: "Gerador de senhas seguras com controle de comprimento, símbolos e caracteres especiais.",
    tags: ["JavaScript", "HTML", "CSS"],
    code: "https://github.com/flplemos/password_generator",
    live: "https://flplemos.github.io/password_generator/index.html",
  },
];

const SKILLS = [
  { name: "React", level: 85 },
  { name: "JavaScript", level: 82 },
  { name: "HTML5 / CSS3", level: 90 },
  { name: "Node.js", level: 65 },
  { name: "Python", level: 45 },
  { name: "Power Automate", level: 80 },
  { name: "Git / GitHub", level: 78 },
  { name: "Microsoft 365", level: 85 },
];

const EXPERIENCES = [
  {
    role: "Assistente de Suporte I",
    company: "Senac RN",
    period: "Out/2025 — Atualmente",
    desc: "Suporte técnico a docentes e administrativo. Desenvolvimento de automações RPA com Power Automate. Gestão de identidades no Microsoft 365 Education.",
    tags: ["Power Automate", "M365", "RPA", "Suporte"],
    current: true,
  },
  {
    role: "Estagiário — Suporte em Tec. Educacionais",
    company: "Senac RN",
    period: "Fev/2025 — Out/2025",
    desc: "Resolução de incidentes técnicos em salas de aula e laboratórios. Suporte presencial e remoto.",
    tags: ["Suporte", "Hardware", "Software"],
  },
  {
    role: "Expert em Interação Multiskill",
    company: "Teleperformance",
    period: "2020 — 2023",
    desc: "Suporte técnico e atendimento ao cliente via chat e voz. Foco em troubleshooting ágil.",
    tags: ["Suporte Técnico", "Atendimento", "Home Office"],
  },
];

const CERTS = [
  { name: "Microsoft Innovative Educator Expert", issuer: "Microsoft", year: "2025" },
  { name: "Introduction to Cybersecurity", issuer: "Cisco Networking Academy", year: "2024" },
  { name: "Front End — Coders 24", issuer: "Ada Tech / Trilha Digital", year: "2024" },
  { name: "Python Essentials 1", issuer: "Cisco Networking Academy", year: "2024" },
  { name: "NLW IA", issuer: "Rocketseat", year: "2024" },
  { name: "UX Design Básico", issuer: "Google", year: "2023" },
];

// ─── ICONS ─────────────────────────────────────────────────────────────────
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconGithub = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const IconLinkedin = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconWhatsapp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);
const IconExternal = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const IconCode = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── TYPED TEXT HOOK ────────────────────────────────────────────────────────
function useTyped(words, speed = 100, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(w => (w + 1) % words.length);
          setCharIdx(0);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ─── SKILL BAR ──────────────────────────────────────────────────────────────
function SkillBar({ name, level, dark }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setAnimated(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: dark ? "#a0b4c8" : "#4a5568", letterSpacing: "0.05em" }}>{name}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: dark ? "#00e5ff" : "#0070f3" }}>{level}%</span>
      </div>
      <div style={{ height: "3px", background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)", borderRadius: "2px", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: "2px",
          width: animated ? `${level}%` : "0%",
          background: dark ? "linear-gradient(90deg, #00e5ff, #0070f3)" : "linear-gradient(90deg, #0070f3, #00b4d8)",
          transition: "width 1.2s cubic-bezier(.4,0,.2,1)",
          boxShadow: dark ? "0 0 8px rgba(0,229,255,0.4)" : "none",
        }} />
      </div>
    </div>
  );
}

// ─── CARD FADE IN ───────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, style = {} }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>{children}</div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const typed = useTyped(["Desenvolvedor Front-End", "React Developer", "UI/UX Enthusiast", "Especialista Microsoft 365"]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = dark
    ? {
        bg: "#080c10", surface: "#0d1117", surfaceHover: "#161b22",
        border: "rgba(0,229,255,0.12)", borderHover: "rgba(0,229,255,0.35)",
        text: "#e6edf3", muted: "#7d8fa3", accent: "#00e5ff", accentSec: "#0070f3",
        tag: "rgba(0,229,255,0.1)", tagText: "#00e5ff",
        navBg: "rgba(8,12,16,0.9)", glow: "0 0 20px rgba(0,229,255,0.15)",
        cardBg: "#0d1117", gridLine: "rgba(0,229,255,0.04)",
      }
    : {
        bg: "#f0f4f8", surface: "#ffffff", surfaceHover: "#f8fafc",
        border: "rgba(0,112,243,0.15)", borderHover: "rgba(0,112,243,0.4)",
        text: "#1a202c", muted: "#64748b", accent: "#0070f3", accentSec: "#00b4d8",
        tag: "rgba(0,112,243,0.08)", tagText: "#0070f3",
        navBg: "rgba(240,244,248,0.92)", glow: "0 4px 24px rgba(0,112,243,0.1)",
        cardBg: "#ffffff", gridLine: "rgba(0,112,243,0.04)",
      };

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => { setMenuOpen(false); setMenuClosing(false); }, 300);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };

  const navLinks = ["Sobre", "Skills", "Experiência", "Projetos", "Certificações", "Contato"];
  const navIds =   ["sobre", "skills", "experiencia", "projetos", "certs", "contato"];

  const styles = {
    root: { minHeight: "100vh", width: "100%", background: t.bg, color: t.text, fontFamily: "'Syne', sans-serif", transition: "background 0.3s, color 0.3s", overflowX: "hidden" },
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? t.navBg : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${t.border}` : "1px solid transparent",
      transition: "all 0.3s ease",
      padding: "0 1.25rem",
    },
    navInner: { maxWidth: "1100px", margin: "0 auto", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontFamily: "'Orbitron', monospace", fontSize: "1.1rem", fontWeight: 700, color: t.accent, letterSpacing: "0.1em", cursor: "pointer", textDecoration: "none" },
    section: { maxWidth: "1100px", margin: "0 auto", padding: "6rem 1.25rem 4rem" },
    sectionTitle: { fontFamily: "'Orbitron', monospace", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, marginBottom: "0.5rem", color: t.text, letterSpacing: "0.05em" },
    accentLine: { width: "40px", height: "2px", background: `linear-gradient(90deg, ${t.accent}, transparent)`, marginBottom: "3rem", borderRadius: "2px" },
    card: {
      background: t.cardBg, border: `1px solid ${t.border}`, borderRadius: "12px",
      padding: "1.5rem", transition: "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
      cursor: "default",
    },
  };

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { scroll-behavior: smooth; width: 100%; min-height: 100vh; }
        ::selection { background: ${t.accent}30; color: ${t.accent}; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${t.bg}; }
        ::-webkit-scrollbar-thumb { background: ${t.accent}50; border-radius: 2px; }
        .card-hover:hover { border-color: ${t.borderHover} !important; transform: translateY(-4px) !important; box-shadow: ${t.glow} !important; }
        .nav-link { background: none; border: none; cursor: pointer; color: ${t.muted}; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; letter-spacing: 0.08em; padding: 0.4rem 0.6rem; transition: color 0.2s; text-decoration: none; }
        .nav-link:hover { color: ${t.accent}; }
        .btn-primary { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; border: 1px solid ${t.accent}; color: ${t.accent}; background: ${t.accent}12; text-decoration: none; }
        .btn-primary:hover { background: ${t.accent}22; box-shadow: 0 0 16px ${t.accent}30; }
        .btn-outline { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem; font-weight: 500; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; border: 1px solid ${t.border}; color: ${t.muted}; background: transparent; text-decoration: none; }
        .btn-outline:hover { border-color: ${t.borderHover}; color: ${t.text}; }
        .tag { display: inline-flex; align-items: center; padding: 0.25rem 0.65rem; border-radius: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; background: ${t.tag}; color: ${t.tagText}; border: 1px solid ${t.accent}20; letter-spacing: 0.04em; }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 0 0 ${t.accent}40; } 50% { box-shadow: 0 0 0 8px transparent; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
        .cursor-blink { display: inline-block; animation: blink 0.8s infinite; color: ${t.accent}; }
        @keyframes menuSlideIn { from { opacity: 0; transform: translateY(-16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes menuSlideOut { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-16px) scale(0.97); } }
        @keyframes menuItemIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .mobile-menu { position: fixed; inset: 0; background: ${t.bg}; z-index: 99; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; pointer-events: none; opacity: 0; }
        .mobile-menu.open { pointer-events: all; animation: menuSlideIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
        .mobile-menu.closing { animation: menuSlideOut 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
        .mobile-menu.open .menu-item { opacity: 0; animation: menuItemIn 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
        .grid-bg { position: absolute; inset: 0; width: 100%; height: 100%; background-image: linear-gradient(${t.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${t.gridLine} 1px, transparent 1px); background-size: 40px 40px; pointer-events: none; }
        .social-link { display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 10px; border: 1px solid ${t.border}; color: ${t.muted}; transition: all 0.2s; text-decoration: none; }
        .social-link:hover { border-color: ${t.borderHover}; color: ${t.accent}; box-shadow: 0 0 12px ${t.accent}25; }
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
      `}</style>

      <div style={styles.root}>
        {/* ── NAV ── */}
        <nav style={styles.nav}>
          <div style={styles.navInner}>
            <a onClick={() => scrollTo("hero")} style={styles.logo}>FL.dev</a>
            <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="hide-mobile">
              {navLinks.map((l, i) => (
                <button key={l} className="nav-link" onClick={() => scrollTo(navIds[i])}>{l}</button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <button onClick={() => setDark(d => !d)} style={{ background: "none", border: `1px solid ${t.border}`, borderRadius: "8px", padding: "0.4rem 0.5rem", cursor: "pointer", color: t.muted, display: "flex", alignItems: "center", transition: "all 0.2s" }}>
                {dark ? <IconSun /> : <IconMoon />}
              </button>
              <button className="hide-mobile" style={{ display: "none" }} />
              <button onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, display: "flex", alignItems: "center" }} className="show-mobile">
                {menuOpen ? <IconX /> : <IconMenu />}
              </button>
            </div>
          </div>
        </nav>
        <style>{`@media (min-width: 641px) { .show-mobile { display: none !important; } }`}</style>

        {/* ── MOBILE MENU ── */}
        {menuOpen && (
          <div className={`mobile-menu ${menuClosing ? "closing" : "open"}`}>
            <div style={{ position: "absolute", inset: 0, borderBottom: `1px solid ${t.border}`, pointerEvents: "none" }} />
            {navLinks.map((l, i) => (
              <button
                key={l}
                className="nav-link menu-item"
                style={{ fontSize: "1.1rem", animationDelay: `${i * 0.06}s` }}
                onClick={() => scrollTo(navIds[i])}
              >
                <span style={{ color: t.accent, marginRight: "0.4rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem" }}>0{i + 1}.</span>
                {l}
              </button>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <section id="hero" style={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div className="grid-bg" />
          {/* Glow orb */}
          <div style={{ position: "absolute", top: "20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}12 0%, transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "10%", left: "-5%", width: "300px", height: "300px", borderRadius: "50%", background: `radial-gradient(circle, ${t.accentSec}10 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div style={{ ...styles.section, paddingTop: "0", paddingBottom: "0", width: "100%", position: "relative", zIndex: 1 }}>
            <div style={{ maxWidth: "700px" }}>
              <div style={{ marginBottom: "1.25rem", opacity: 0.6, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: t.accent, letterSpacing: "0.15em" }}>
                &gt; HELLO_WORLD.exe
              </div>
              <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 900, lineHeight: 1.1, marginBottom: "1rem", letterSpacing: "0.02em" }}>
                Felipe<br />
                <span style={{ color: t.accent }}>Lemos</span>
              </h1>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)", color: t.muted, marginBottom: "1.75rem", minHeight: "2rem" }}>
                <span style={{ color: t.accent }}>$ </span>{typed}<span className="cursor-blink">|</span>
              </div>
              <p style={{ fontSize: "1rem", color: t.muted, lineHeight: 1.75, marginBottom: "2.25rem", maxWidth: "520px" }}>
                Profissional de TI com perfil técnico híbrido. Combino desenvolvimento front-end moderno com automações RPA e gestão Microsoft 365. <strong style={{ color: t.text }}>Microsoft Innovative Educator Expert 2025–2026.</strong>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <a href="https://github.com/flplemos" target="_blank" rel="noreferrer" className="btn-primary">
                  <IconGithub /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/felipelemos777/" target="_blank" rel="noreferrer" className="btn-outline">
                  <IconLinkedin /> LinkedIn
                </a>
                <button onClick={() => scrollTo("projetos")} className="btn-outline">Ver Projetos</button>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", color: t.muted, animation: "float 2s ease-in-out infinite" }}>
            <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, transparent, ${t.accent})` }} />
          </div>
        </section>

        {/* ── SOBRE ── */}
        <section id="sobre" style={styles.section}>
          <FadeIn>
            <h2 style={styles.sectionTitle}>Sobre</h2>
            <div style={styles.accentLine} />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "start" }}>
            <FadeIn delay={0.1}>
              <div style={{ ...styles.card, lineHeight: 1.8 }} className="card-hover">
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", color: t.accent, letterSpacing: "0.15em", marginBottom: "1rem" }}>// PERFIL</div>
                <p style={{ color: t.muted, marginBottom: "1rem", fontSize: "0.95rem" }}>
                  Atuo como <strong style={{ color: t.text }}>Assistente de Suporte I no Senac RN</strong>, onde desenvolvimento automações RPA com Power Automate e administro o ecossistema Microsoft 365 Education.
                </p>
                <p style={{ color: t.muted, fontSize: "0.95rem" }}>
                  Minha paixão é criar interfaces web que sejam ao mesmo tempo funcionais e visualmente memoráveis, aliando conhecimentos de Front-End com uma visão sistêmica de infraestrutura.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ ...styles.card }} className="card-hover">
                <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", color: t.accent, letterSpacing: "0.15em", marginBottom: "1rem" }}>// DADOS</div>
                {[
                  ["📍 Localização", "Natal — RN, Brasil"],
                  ["🎓 Formação", "ADS — Senac SP (2025)"],
                  ["🎓 Graduação", "Psicologia — UnP (2021)"],
                  ["🏆 Certificação", "Microsoft Innovative Educator Expert"],
                  ["📧 E-mail", "flplemos@outlook.com"],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", flexDirection: "column", borderBottom: `1px solid ${t.border}`, padding: "0.65rem 0" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: t.accent, marginBottom: "0.2rem" }}>{k}</span>
                    <span style={{ fontSize: "0.9rem", color: t.text }}>{v}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" style={{ ...styles.section, paddingTop: "2rem" }}>
          <FadeIn>
            <h2 style={styles.sectionTitle}>Skills</h2>
            <div style={styles.accentLine} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ ...styles.card }} className="card-hover">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", color: t.accent, letterSpacing: "0.15em", marginBottom: "1.5rem" }}>// NÍVEL DE PROFICIÊNCIA</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.5rem 3rem" }}>
                {SKILLS.map(s => <SkillBar key={s.name} {...s} dark={dark} />)}
              </div>
            </div>
          </FadeIn>
          <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
            {["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Python", "Power Automate", "Git", "GitHub", "Bootstrap", "MySQL", "VS Code", "Figma", "Microsoft 365", "Cibersegurança"].map(tag => (
              <FadeIn key={tag} style={{ display: "inline-block" }}>
                <span className="tag">{tag}</span>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── EXPERIÊNCIA ── */}
        <section id="experiencia" style={{ ...styles.section, paddingTop: "2rem" }}>
          <FadeIn>
            <h2 style={styles.sectionTitle}>Experiência</h2>
            <div style={styles.accentLine} />
          </FadeIn>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "15px", top: 0, bottom: 0, width: "1px", background: `linear-gradient(to bottom, ${t.accent}, ${t.accentSec}30, transparent)` }} />
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={exp.role} delay={i * 0.15} style={{ paddingLeft: "2.5rem", marginBottom: "2rem", position: "relative" }}>
                <div style={{ position: "absolute", left: "8px", top: "6px", width: "14px", height: "14px", borderRadius: "50%", border: `2px solid ${t.accent}`, background: t.bg, animation: exp.current ? "pulse-glow 2s infinite" : "none" }} />
                <div style={{ ...styles.card }} className="card-hover">
                  {exp.current && <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: t.accent, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>● ATUAL</div>}
                  <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.2rem" }}>{exp.role}</h3>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: t.accent, marginBottom: "0.25rem" }}>{exp.company}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: t.muted, marginBottom: "0.75rem" }}>{exp.period}</div>
                  <p style={{ color: t.muted, fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "0.75rem" }}>{exp.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {exp.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── PROJETOS ── */}
        <section id="projetos" style={{ ...styles.section, paddingTop: "2rem" }}>
          <FadeIn>
            <h2 style={styles.sectionTitle}>Projetos</h2>
            <div style={styles.accentLine} />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
            {PROJECTS.map((p, i) => (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div style={{ ...styles.card, height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }} className="card-hover">
                  {p.highlight && (
                    <div style={{ position: "absolute", top: 0, right: 0, background: `linear-gradient(135deg, ${t.accent}, ${t.accentSec})`, color: "#000", fontSize: "0.6rem", fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, padding: "0.3rem 0.8rem", letterSpacing: "0.1em" }}>DESTAQUE</div>
                  )}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: t.accent, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>// PROJETO</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.6rem", lineHeight: 1.4 }}>{p.title}</h3>
                  <p style={{ color: t.muted, fontSize: "0.88rem", lineHeight: 1.7, flex: 1, marginBottom: "1rem" }}>{p.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                    {p.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "auto" }}>
                    <a href={p.code} target="_blank" rel="noreferrer" className="btn-outline" style={{ flex: 1, justifyContent: "center", padding: "0.5rem 0.75rem", fontSize: "0.75rem" }}>
                      <IconCode /> Código
                    </a>
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "0.5rem 0.75rem", fontSize: "0.75rem" }}>
                        <IconExternal /> Demo
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── CERTIFICAÇÕES ── */}
        <section id="certs" style={{ ...styles.section, paddingTop: "2rem" }}>
          <FadeIn>
            <h2 style={styles.sectionTitle}>Certificações</h2>
            <div style={styles.accentLine} />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {CERTS.map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.08}>
                <div style={{ ...styles.card, borderLeft: `2px solid ${t.accent}` }} className="card-hover">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.65rem", color: t.accent, letterSpacing: "0.1em" }}>{c.year}</span>
                  </div>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 700, lineHeight: 1.4, marginBottom: "0.4rem" }}>{c.name}</h3>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: t.muted }}>{c.issuer}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── CONTATO ── */}
        <section id="contato" style={{ ...styles.section, paddingTop: "2rem" }}>
          <FadeIn>
            <h2 style={styles.sectionTitle}>Contato</h2>
            <div style={styles.accentLine} />
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ ...styles.card, maxWidth: "560px" }} className="card-hover">
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "0.7rem", color: t.accent, letterSpacing: "0.15em", marginBottom: "1rem" }}>// VAMOS CONVERSAR</div>
              <p style={{ color: t.muted, marginBottom: "1.75rem", lineHeight: 1.75 }}>
                Aberto a novas oportunidades, freelas e colaborações. Fique à vontade para entrar em contato!
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
                {[
                  { icon: "📧", label: "E-mail", value: "flplemos@outlook.com", href: "mailto:flplemos@outlook.com" },
                  { icon: "📍", label: "Localização", value: "Natal — RN, Brasil", href: null },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "8px", background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${t.border}` }}>
                    <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: t.accent, marginBottom: "0.15rem" }}>{item.label}</div>
                      {item.href ? <a href={item.href} style={{ color: t.text, textDecoration: "none", fontSize: "0.9rem" }}>{item.value}</a> : <span style={{ color: t.text, fontSize: "0.9rem" }}>{item.value}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <a href="https://github.com/flplemos" target="_blank" rel="noreferrer" className="social-link" title="GitHub"><IconGithub /></a>
                <a href="https://www.linkedin.com/in/felipelemos777/" target="_blank" rel="noreferrer" className="social-link" title="LinkedIn"><IconLinkedin /></a>
                <a href="https://wa.me/5584991203743" target="_blank" rel="noreferrer" className="social-link" title="WhatsApp"><IconWhatsapp /></a>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${t.border}`, padding: "2rem 1.25rem", textAlign: "center" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: t.muted }}>
            <span style={{ color: t.accent }}>{"<"}</span> Coded by <a href="https://github.com/flplemos" target="_blank" rel="noreferrer" style={{ color: t.accent, textDecoration: "none" }}>Felipe Lemos</a> <span style={{ color: t.accent }}>{"/"}</span> <span style={{ color: t.accent }}>{">"}</span> — 2025
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: t.muted, marginTop: "0.4rem", opacity: 0.5 }}>Built with React & Vanilla CSS</div>
        </footer>
      </div>
    </>
  );
}
