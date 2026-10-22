import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { SECTIONS } from "../data/profile";
import { setTheme, useTheme } from "../hooks/useTheme";

const LINKS = SECTIONS.slice(1);

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav className={`nav ${scrolled ? "is-scrolled" : ""}`} aria-label="Principal">
      <div className="nav-inner">
        <a href="#hero" className="nav-logo" aria-label="Felipe Lemos — início">
          <span aria-hidden="true">&lt;</span>FL<span aria-hidden="true">/&gt;</span>
        </a>

        <button
          type="button"
          className="nav-btn theme-toggle"
          aria-label={nextTheme === "light" ? "Ativar modo claro" : "Ativar modo escuro"}
          onClick={() => setTheme(nextTheme)}
        >
          {theme === "dark" ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
        </button>

        <button
          type="button"
          className="nav-btn nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>

        <ul id="nav-menu" className={`nav-links ${open ? "is-open" : ""}`}>
          {LINKS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? "is-active" : undefined}
                aria-current={active === id ? "true" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
