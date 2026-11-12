import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import { SECTIONS } from "../data/profile";
import { useTheme } from "../hooks/useTheme";


// Performance model:
// - plain three.js with named imports (tree-shaken; no react-three-fiber/drei runtime);
// - DPR capped at 1.5, one lit mesh (flat-shaded standard material), the rest unlit;
// - scroll and pointer only write a target: all layout reads and all motion happen once per
//   frame inside tick(), on values cached at resize time;
// - while a spring is moving the scene draws every frame; once everything has settled only
//   the slow idle drift is left, and that is drawn at ~30fps (no drift at all, and no loop,
//   under prefers-reduced-motion).

// One keyframe per section (same order as SECTIONS). x balances the layout: the object
// sits opposite to where each section's content leans. x is a fraction of the content
// container's half-width (-1 = left edge, 1 = right edge), converted to world units every
// frame, so the object lands in the same column at any screen width or aspect ratio.
const KEYFRAMES = [
  { x: 0.6, y: 0.1, z: 0, rx: 0.2, ry: 0.3, rz: 0, s: 1 },           // hero
  { x: -0.7, y: 0.2, z: -0.6, rx: 0.8, ry: 1.4, rz: 0.2, s: 0.9 },  // sobre
  { x: 0.66, y: -0.1, z: -1.2, rx: 1.4, ry: 2.6, rz: 0.5, s: 0.85 }, // stack
  { x: -0.64, y: 0, z: -0.8, rx: 2.0, ry: 3.6, rz: 0.9, s: 0.9 },    // experiência
  { x: 0, y: 0, z: -3, rx: 2.6, ry: 4.6, rz: 1.2, s: 1.1 },          // projetos
  { x: 0.8, y: 0.3, z: -2.4, rx: 3.1, ry: 5.4, rz: 1.5, s: 0.75 },   // formação (full-width grid: stay back)
  { x: 0, y: 0.4, z: -0.4, rx: 3.6, ry: 6.3, rz: 1.8, s: 1.05 },     // contato
];
const CONTAINER_PX = 1240; // keep in sync with --container in index.css
const TAN_HALF_FOV = Math.tan(MathUtils.degToRad(45 / 2));

// Point-light cycle per theme: green → sky → indigo (darker variants on light bg).
const PALETTES = {
  dark: ["#22c55e", "#38bdf8", "#818cf8"],
  light: ["#16a34a", "#0284c7", "#4f46e5"],
};
const toColors = (p) => KEYFRAMES.map((_, i) => new Color(p[i % p.length]));
const LIGHT_COLORS = { dark: toColors(PALETTES.dark), light: toColors(PALETTES.light) };

const THEME_STYLE = {
  dark: { core: "#334155", metal: 0.7, rough: 0.3, shell: 0.3, dots: "#38bdf8", dotsOpacity: 0.75, ambient: 0.5, sun: 1.2 },
  // Light theme: pale, matte core (metal with nothing to reflect renders dark) so dark text
  // over it keeps its contrast.
  light: { core: "#e2e8f0", metal: 0.05, rough: 0.6, shell: 0.4, dots: "#0369a1", dotsOpacity: 0.5, ambient: 1.1, sun: 0.9 },
};

// Points on a tilted torus-like band around the core: the "nodes" of a system.
function orbitPositions(count) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2 + Math.random() * 0.9;
    const h = (Math.random() - 0.5) * 0.5;
    arr.set([Math.cos(a) * r, h + Math.sin(a * 3) * 0.12, Math.sin(a) * r], i * 3);
  }
  return arr;
}

const toFrame = (k, i, isMobile) => ({
  ...k,
  // On narrow screens content is single-column, so keep the object centred and pushed back.
  x: isMobile ? k.x * 0.2 : k.x,
  y: isMobile ? k.y + 0.6 : k.y,
  z: isMobile ? k.z - 1.6 : k.z,
  s: isMobile ? k.s * 0.8 : k.s,
  // Each section also turns the orbit a bit further, so scrolling drives all the motion.
  o: i * 0.6,
  c: i,
});
const KEYS = Object.keys(toFrame(KEYFRAMES[0], 0, false));

// Critically damped spring (the "SmoothDamp" form): unlike plain exponential damping the
// velocity is continuous, so the object eases in as well as out and discrete wheel steps
// blend into one motion instead of a series of lurches.
const SMOOTH_TIME = 0.32; // seconds to (roughly) reach the target
const OMEGA = 2 / SMOOTH_TIME;
function spring(s, to, dt) {
  const x = OMEGA * dt;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const delta = s.v - to;
  const temp = (s.vel + OMEGA * delta) * dt;
  s.vel = (s.vel - OMEGA * temp) * decay;
  s.v = to + (delta + temp) * decay;
}
const IDLE_FRAME_MS = 30; // idle drift: every 2nd frame at 60Hz, every 4th at 120Hz

function buildScene(canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, stencil: false, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene = new Scene();
  const camera = new PerspectiveCamera(45, 1, 0.1, 50); // fov mirrors TAN_HALF_FOV
  camera.position.z = 6;

  const ambient = new AmbientLight("#ffffff", 0.35);
  const sun = new DirectionalLight("#ffffff", 1);
  sun.position.set(-4, 3, 2);
  const point = new PointLight("#22c55e", 30, 14, 2);
  point.position.set(2.5, 2, 3);

  const coreGeo = new IcosahedronGeometry(1, 0);
  const coreMat = new MeshStandardMaterial({ metalness: 0.7, roughness: 0.3, flatShading: true });
  const shellGeo = new IcosahedronGeometry(1, 1);
  const shellMat = new MeshBasicMaterial({ wireframe: true, transparent: true });
  const shell = new Mesh(shellGeo, shellMat);
  shell.scale.setScalar(1.4);

  const dotsGeo = new BufferGeometry();
  dotsGeo.setAttribute("position", new BufferAttribute(orbitPositions(360), 3));
  const dotsMat = new PointsMaterial({ size: 0.035, transparent: true, depthWrite: false });
  const orbit = new Points(dotsGeo, dotsMat);
  orbit.rotation.set(0.35, 0, 0.15);

  const group = new Group();
  group.add(new Mesh(coreGeo, coreMat), shell, orbit);
  scene.add(ambient, sun, point, group);

  const setTheme = (theme) => {
    const t = THEME_STYLE[theme];
    coreMat.color.set(t.core);
    coreMat.metalness = t.metal;
    coreMat.roughness = t.rough;
    shellMat.opacity = t.shell;
    dotsMat.color.set(t.dots);
    dotsMat.opacity = t.dotsOpacity;
    ambient.intensity = t.ambient;
    sun.intensity = t.sun;
  };

  const dispose = () => {
    [coreGeo, shellGeo, dotsGeo, coreMat, shellMat, dotsMat].forEach((o) => o.dispose());
    renderer.dispose();
  };

  return { renderer, scene, camera, group, shell, orbit, point, shellMat, setTheme, dispose };
}

export default function Scene3D() {
  const canvasRef = useRef(null);
  const apiRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let three;
    try {
      three = buildScene(canvas);
    } catch {
      return; // WebGL unavailable at runtime: the page simply has no 3D background
    }
    const { renderer, scene, camera, group, shell, orbit, point, shellMat } = three;
    const pointer = { x: 0, y: 0 };
    const color = new Color();
    let palette = LIGHT_COLORS.dark;
    let raf = 0;
    let last = 0;
    let drawn = 0;
    let clock = 0;

    // Scroll → target. One pure function of the scroll position (no competing tweens, so
    // jumping straight to any section always lands on the right keyframe). Section i blends
    // in from the previous state while its top travels from the bottom of the viewport to
    // 25% from the top. Section offsets and frames are cached: scrolling reads no layout.
    const sections = SECTIONS.map(({ id }) => document.getElementById(id));
    const mobileMq = matchMedia("(max-width: 899px)"); // same breakpoint as the CSS layout
    const target = {};
    let frames = [];
    let tops = [];
    let vh = 1;
    let maxScroll = 0;
    let stale = true;
    const measure = () => {
      frames = KEYFRAMES.map((k, i) => toFrame(k, i, mobileMq.matches));
      tops = sections.map((el) => (el ? el.getBoundingClientRect().top + window.scrollY : Infinity));
      vh = window.innerHeight;
      maxScroll = document.documentElement.scrollHeight - vh;
      stale = true;
      requestRender();
    };
    const updateTarget = () => {
      stale = false;
      Object.assign(target, frames[0]);
      if (reduce) return;
      const y = window.scrollY;
      const atBottom = y >= maxScroll - 2;
      for (let i = 1; i < tops.length; i++) {
        let p = MathUtils.clamp((vh - (tops[i] - y)) / (0.75 * vh), 0, 1);
        if (atBottom && i === tops.length - 1) p = 1; // short last section
        if (p === 0) break;
        for (const k of KEYS) target[k] += (frames[i][k] - target[k]) * p;
      }
    };

    function requestRender() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    measure();
    updateTarget();
    // Start on the right keyframe (the scene fades in via CSS; it must not fly in).
    const state = Object.fromEntries(KEYS.map((k) => [k, { v: target[k], vel: 0 }]));

    function tick(now) {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      if (stale) updateTarget();

      let moving = false;
      for (const k of KEYS) {
        const s = state[k];
        let to = target[k];
        if (k === "rx") to -= pointer.y * 0.2;
        else if (k === "ry") to += pointer.x * 0.25;
        if (reduce) {
          s.v = to; // reduced motion jumps straight to the final state
          continue;
        }
        spring(s, to, dt);
        if (Math.abs(s.v - to) > 1e-3 || Math.abs(s.vel) > 1e-3) moving = true;
      }

      if (!reduce) {
        clock += dt;
        // Nothing but the idle drift left: half the frames are enough for it.
        if (!moving && now - drawn < IDLE_FRAME_MS) return requestRender();
      }
      drawn = now;

      // Container-relative x → world x at the current depth.
      const w = canvas.clientWidth || 1;
      const halfWidthWorld = TAN_HALF_FOV * (camera.position.z - state.z.v) * camera.aspect;
      const worldX = state.x.v * (Math.min(w, CONTAINER_PX) / w) * halfWidthWorld;
      // Idle drift (clock stays 0 under reduced motion): a slow float plus counter-rotating
      // shell and orbit, layered on top of the scroll-driven state.
      group.position.set(worldX, state.y.v + Math.sin(clock * 0.7) * 0.06, state.z.v);
      group.rotation.set(state.rx.v + Math.sin(clock * 0.4) * 0.04, state.ry.v + clock * 0.05, state.rz.v);
      group.scale.setScalar(state.s.v);
      shell.rotation.y = -clock * 0.09;
      orbit.rotation.y = state.o.v + clock * 0.06;
      // The coloured light travels with the object so it stays lit wherever it moves.
      point.position.set(group.position.x + 2.5, group.position.y + 2, group.position.z + 3);

      // Interpolate the light colour between the two neighbouring section colours.
      const c = MathUtils.clamp(state.c.v, 0, palette.length - 1);
      const i = Math.min(Math.floor(c), palette.length - 2);
      color.copy(palette[i]).lerp(palette[i + 1], c - i);
      point.color.copy(color);
      shellMat.color.copy(color);

      renderer.render(scene, camera);
      if (moving || !reduce) requestRender();
      else last = 0;
    }

    // Size from the canvas box (not window) and re-render on resize.
    const ro = new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      drawn = 0;
      requestRender();
    });
    ro.observe(canvas);
    // Fonts, images and breakpoints move the sections: re-measure when the page height changes.
    const layoutRo = new ResizeObserver(measure);
    layoutRo.observe(document.body);

    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      requestRender();
    };
    const finePointer = !reduce && matchMedia("(pointer: fine)").matches;
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

    const onScroll = () => {
      stale = true;
      requestRender();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    apiRef.current = {
      setTheme: (t) => {
        palette = LIGHT_COLORS[t];
        three.setTheme(t);
        drawn = 0;
        requestRender();
      },
    };

    return () => {
      apiRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      layoutRo.disconnect();
      window.removeEventListener("pointermove", onPointer);
      three.dispose();
    };
  }, []);

  useEffect(() => {
    apiRef.current?.setTheme(theme);
  }, [theme]);

  return (
    <div className="scene" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
