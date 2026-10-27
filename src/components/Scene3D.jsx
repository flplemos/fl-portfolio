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
// - render on demand: nothing is drawn while the page is idle. A frame is requested when
//   scroll, pointer, resize or theme change the target, and frames keep coming only until
//   the damped values settle;
// - DPR capped at 1.5, one lit mesh (flat-shaded standard material), the rest unlit.

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

  return { renderer, scene, camera, group, orbit, point, shellMat, setTheme, dispose };
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
    const { renderer, scene, camera, group, orbit, point, shellMat } = three;
    const target = toFrame(KEYFRAMES[0], 0, false);
    const pointer = { x: 0, y: 0 };
    const color = new Color();
    let palette = LIGHT_COLORS.dark;
    let raf = 0;
    let last = 0;

    const requestRender = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    function tick(now) {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      let moving = false;
      // Reduced motion jumps straight to the final state; otherwise damp and keep
      // requesting frames until every value has settled.
      const damp = (cur, to) => {
        const next = reduce ? to : MathUtils.damp(cur, to, 5, dt);
        if (Math.abs(next - to) > 1e-3) moving = true;
        return next;
      };

      // Container-relative x → world x at the target depth.
      const w = canvas.clientWidth || 1;
      const halfWidthWorld = TAN_HALF_FOV * (camera.position.z - target.z) * camera.aspect;
      const worldX = target.x * (Math.min(w, CONTAINER_PX) / w) * halfWidthWorld;
      group.position.set(damp(group.position.x, worldX), damp(group.position.y, target.y), damp(group.position.z, target.z));
      group.rotation.set(
        damp(group.rotation.x, target.rx - pointer.y * 0.2),
        damp(group.rotation.y, target.ry + pointer.x * 0.25),
        damp(group.rotation.z, target.rz),
      );
      group.scale.setScalar(damp(group.scale.x, target.s));
      // The coloured light travels with the object so it stays lit wherever it moves.
      point.position.set(group.position.x + 2.5, group.position.y + 2, group.position.z + 3);
      orbit.rotation.y = damp(orbit.rotation.y, target.o);

      // Interpolate the light colour between the two neighbouring section colours.
      const i = Math.min(Math.floor(target.c), palette.length - 2);
      color.copy(palette[i]).lerp(palette[i + 1], target.c - i);
      point.color.copy(color);
      shellMat.color.copy(color);

      renderer.render(scene, camera);
      if (moving) requestRender();
      else last = 0;
    }

    // Size from the canvas box (not window) and re-render on resize.
    const ro = new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = canvas;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      requestRender();
    });
    ro.observe(canvas);

    const onPointer = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      requestRender();
    };
    const finePointer = !reduce && matchMedia("(pointer: fine)").matches;
    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

    // Scroll → target. One pure function of the current scroll position (no competing
    // tweens, so jumping straight to any section always lands on the right keyframe); the
    // damping in tick() provides the smoothing. Section i blends in from the previous state
    // while its top travels from the bottom of the viewport to 25% from the top.
    const sections = SECTIONS.map(({ id }) => document.getElementById(id));
    const mobileMq = matchMedia("(max-width: 899px)"); // same breakpoint as the CSS layout
    const KEYS = Object.keys(target);
    const updateTarget = () => {
      const frames = KEYFRAMES.map((k, i) => toFrame(k, i, mobileMq.matches));
      Object.assign(target, frames[0]);
      if (!reduce) {
        const vh = window.innerHeight;
        const atBottom = window.scrollY + vh >= document.documentElement.scrollHeight - 2;
        for (let i = 1; i < sections.length; i++) {
          if (!sections[i]) continue;
          const top = sections[i].getBoundingClientRect().top;
          let p = MathUtils.clamp((vh - top) / (0.75 * vh), 0, 1);
          if (atBottom && i === sections.length - 1) p = 1; // short last section
          if (p === 0) break;
          for (const k of KEYS) target[k] += (frames[i][k] - target[k]) * p;
        }
      }
      requestRender();
    };
    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget, { passive: true });

    apiRef.current = {
      setTheme: (t) => {
        palette = LIGHT_COLORS[t];
        three.setTheme(t);
        requestRender();
      },
    };

    return () => {
      apiRef.current = null;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
      ro.disconnect();
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
