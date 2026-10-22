import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Subtle Scroll Reveal (ui-ux-pro-max gsap preset): every [data-reveal] element fades up
// once it enters the viewport; children of [data-reveal-group] stagger. Content stays
// visible without JS and under prefers-reduced-motion.
export function useReveal(scopeRef) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia(scopeRef);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 16,
          duration: 0.6,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none reverse" },
        });
      });
      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 16,
          duration: 0.55,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    });
    // Fonts change line heights, so recalculate trigger positions once they are in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [scopeRef]);
}
