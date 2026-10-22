import { lazy, Suspense, useEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import TechStack from "./components/sections/TechStack";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Education from "./components/sections/Education";
import Contact from "./components/sections/Contact";
import { useReveal } from "./hooks/useReveal";

// three.js is the heaviest chunk: fetch it only once the browser is idle after first
// paint, and skip it entirely for Data Saver users or browsers without WebGL.
const Scene3D = lazy(() => import("./components/Scene3D"));

function canRender3D() {
  if (navigator.connection?.saveData) return false;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // free the probe context
    return !!gl;
  } catch {
    return false;
  }
}

function useIdle3D() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!canRender3D()) return;
    const go = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(go, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(go, 600);
    return () => clearTimeout(id);
  }, []);
  return ready;
}

export default function App() {
  const main = useRef(null);
  const show3D = useIdle3D();
  useReveal(main);

  return (
    <>
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      {show3D && (
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      )}
      <div className="scene-vignette" aria-hidden="true" />
      <Nav />
      <main id="main" ref={main}>
        <Hero />
        <About />
        <TechStack />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <footer className="footer">
        <p className="mono">
          <span className="accent">&lt;</span> Felipe Lemos <span className="accent">/&gt;</span> — {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
