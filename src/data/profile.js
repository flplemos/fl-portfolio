// ─── PROFILE ───────────────────────────────────────────────────────────────
export const PROFILE = {
  name: "Felipe Lemos",
  role: "Desenvolvedor Mendix na TrueChange",
  // Short phrases (≤ 25 chars) so the typed line never wraps on a 375px screen.
  typed: ["Desenvolvedor Full-Stack", "Especialista em Automação", "IA: RAG & Multi-Agentes", "Low-Code com Mendix"],
  focus: ["React", "Node.js", "Python", "Mendix", "n8n", "RAG"],
  location: "Natal, Rio Grande do Norte, Brasil",
  summary: [
    "Sou desenvolvedor Mendix na TrueChange, com certificações Mendix Rapid e Intermediate Developer. Construo aplicações corporativas Low-Code e automatizo processos de ponta a ponta com Power Automate e n8n.",
    "Também desenvolvo interfaces em React e back-ends com Node.js e Python, e projeto soluções de IA com RAG e sistemas multiagentes, do protótipo à integração com o negócio.",
    "Formado em Análise e Desenvolvimento de Sistemas e em Psicologia, uno base técnica e entendimento de pessoas para entregar software funcional, escalável e fácil de usar.",
  ],
};

export const CONTACT = {
  email: "flplemos@outlook.com",
  phone: "+55 (84) 99120-3743",
  whatsapp: "https://wa.me/5584991203743",
  linkedin: "https://www.linkedin.com/in/felipelemos777",
  github: "https://github.com/flplemos",
};

// ─── NAV / SECTIONS (order drives the 3D scroll keyframes) ────────────────
export const SECTIONS = [
  { id: "hero", label: "Início" },
  { id: "sobre", label: "Sobre" },
  { id: "stack", label: "Stack" },
  { id: "experiencia", label: "Experiência" },
  { id: "projetos", label: "Projetos" },
  { id: "formacao", label: "Formação" },
  { id: "contato", label: "Contato" },
];

// ─── TECH STACK ────────────────────────────────────────────────────────────
export const STACK = [
  {
    key: "lowcode",
    title: "Low-Code & Automação",
    blurb: "Aplicações corporativas e fluxos automatizados de ponta a ponta.",
    items: ["Mendix", "Power Automate", "Power Apps", "n8n"],
  },
  {
    key: "ai",
    title: "Inteligência Artificial",
    blurb: "Arquiteturas que combinam recuperação de contexto e agentes cooperativos.",
    items: ["RAG (Retrieval-Augmented Generation)", "Multi-Agent Systems", "LLMs locais", "Python"],
  },
  {
    key: "front",
    title: "Front-End & UI",
    blurb: "Interfaces responsivas, acessíveis e com atenção à experiência.",
    items: ["React", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5", "CSS3", "PWA", "UX Design"],
  },
  {
    key: "back",
    title: "Back-End, Dados & DevOps",
    blurb: "APIs, persistência e versionamento com boas práticas.",
    items: ["Node.js", "Express", "Supabase", "PostgreSQL", "MySQL", "MongoDB + Prisma", "Git", "GitHub", "Vercel"],
  },
];

// ─── EXPERIENCE ────────────────────────────────────────────────────────────
export const EXPERIENCES = [
  {
    company: "TrueChange",
    role: "Desenvolvedor (Mendix)",
    period: "Setembro de 2026 – Presente",
    location: "Recife, Pernambuco, Brasil (100% Remoto)",
    current: true,
  },
  {
    company: "Senac RN",
    role: "Assistente de Suporte I (Tecnologias Educacionais)",
    period: "Fevereiro de 2025 – Setembro de 2026",
    duration: "1 ano e 8 meses",
    location: "Rio Grande do Norte, Brasil",
  },
  {
    company: "Autônomo / Freelancer",
    role: "Web Designer & Desenvolvedor Front-End",
    period: "Outubro de 2022 – Presente",
    current: true,
  },
  {
    company: "Teleperformance",
    role: "Expert em Interações",
    period: "Agosto de 2020 – Maio de 2023",
    duration: "2 anos e 10 meses",
    location: "Rio Grande do Norte, Brasil",
  },
  {
    company: "Guararapes Confecções S/A",
    role: "Estagiário de Psicologia Organizacional",
    period: "Agosto de 2017 – Março de 2019",
    duration: "1 ano e 8 meses",
    location: "Rio Grande do Norte, Brasil",
  },
];

// ─── PROJECTS ──────────────────────────────────────────────────────────────
// image: 16:10 WebP preview in /public/projects (captured from the live site).
export const PROJECTS = [
  {
    title: "Ana Nails · Gestão",
    desc: "PWA mobile-first para uma nail designer gerenciar atendimentos, clientes, despesas e faturamento, com lembretes por Web Push agendados via pg_cron e Edge Functions.",
    tags: ["React 19", "Supabase", "PWA", "Tailwind CSS"],
    code: "https://github.com/flplemos/gestaoananails",
    live: "https://gestaoananails.vercel.app",
    image: "/projects/ananails.webp",
    highlight: true,
  },
  {
    title: "Espetaria do Gaguinho — Pedidos",
    desc: "Sistema de pedidos (POS/KDS) em tempo real: garçom lança a comanda no celular e ela aparece na hora na tela da churrasqueira e no caixa, via Supabase Realtime.",
    tags: ["React 19", "Supabase Realtime", "Tailwind CSS"],
    code: "https://github.com/flplemos/espetaria-mvp",
    live: "https://espetaria-mvp.vercel.app",
    image: "/projects/espetaria-mvp.webp",
  },
  {
    title: "Espetaria do Gaguinho — Cardápio",
    desc: "Cardápio digital com carrinho, combos personalizáveis, frete por CEP (ViaCEP), horário de funcionamento e pedido finalizado direto no WhatsApp.",
    tags: ["JavaScript", "ViaCEP", "WhatsApp"],
    code: "https://github.com/flplemos/espetariadogaguinho",
    live: "https://flplemos.github.io/espetariadogaguinho/",
    image: "/projects/cardapio.webp",
  },
  {
    title: "Shorts Summary",
    desc: "App web que resume vídeos curtos do YouTube usando IA. Stack completa com Vite, Node.js, Express, FFmpeg e Xenova Transformers.",
    tags: ["JavaScript", "Node.js", "IA", "Vite"],
    code: "https://github.com/flplemos/shorts-summary",
    live: null,
    image: null,
  },
  {
    title: "Costs — Gerenciador de Projetos",
    desc: "Sistema de gerenciamento de projetos e custos construído com React, com roteamento e estado global.",
    tags: ["React", "JavaScript", "CSS"],
    code: "https://github.com/flplemos/costs",
    live: "https://costs-sepia.vercel.app/",
    image: "/projects/costs.webp",
  },
  {
    title: "Pokédex Felps Edition",
    desc: "Pokédex interativa consumindo a PokéAPI, com gráficos Chart.js para exibir os stats dos Pokémons.",
    tags: ["JavaScript", "PokéAPI", "Chart.js"],
    code: "https://github.com/flplemos/pokedex",
    live: "https://flplemos.github.io/pokedex/index.html",
    image: "/projects/pokedex.webp",
  },
];

// ─── EDUCATION ─────────────────────────────────────────────────────────────
export const EDUCATION = [
  {
    degree: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
    school: "Senac São Paulo",
    period: "2023 – 2025",
  },
  {
    degree: "Bacharelado em Psicologia",
    school: "Universidade Potiguar - UnP",
    period: "2016 – 2021",
  },
];

// Curated from LinkedIn: featured = directly backs the current role / AI focus.
// Left out on purpose: Introduction to Cybersecurity, Curso de Java, NLW IA, Algoritmo,
// Computer Hardware Basics (introductory or outside the current positioning).
export const CERTS = [
  { title: "Mendix Intermediate Developer Certification", issuer: "Mendix", date: "set. 2026", credential: "114590", featured: true },
  { title: "Mendix Rapid Developer Certification", issuer: "Mendix", date: "ago. 2026", credential: "113175", featured: true },
  { title: "Engenharia de LLMs e Sistemas Agentic", issuer: "Senac RN", date: "jul. 2026", featured: true },
  { title: "Microsoft Elevate Educator Expert 2026-2027", issuer: "Microsoft", date: "set. 2026" },
  { title: "Bootcamp IA Generativa Microsoft", issuer: "Green Tecnologia", date: "mai. 2026" },
  { title: "Santander 2025 — Automação com n8n", issuer: "DIO", date: "dez. 2025" },
  { title: "Microsoft Innovative Educator Expert 2025-2026", issuer: "Microsoft", date: "out. 2025" },
  { title: "Conceitos Básicos do Design de Experiência do Usuário (UX)", issuer: "Google", date: "fev. 2025" },
  { title: "Trilha Digital | Coders 24 | Front End", issuer: "Ada", date: "jun. 2024" },
  { title: "Python Essentials 1", issuer: "Cisco", date: "nov. 2023" },
];
