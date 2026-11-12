// GSAP only drives below-the-fold scroll effects, so it is fetched after first paint
// instead of shipping in the entry bundle. One shared promise for every caller.
let pending;

export function loadGsap() {
  pending ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  });
  return pending;
}

// Elements already on screen when GSAP arrives are left alone: hiding them just to fade
// them back in would flash.
export const isBelowFold = (el) => el.getBoundingClientRect().top >= window.innerHeight;
