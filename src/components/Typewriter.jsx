import { useEffect, useState } from "react";
import { useReducedMotion } from "../hooks/useMediaQuery";

// Types and erases each phrase in turn. Screen readers get the full list once (sr-only),
// never the letter-by-letter churn; with reduced motion the phrases are shown static.
export default function Typewriter({ phrases, typeMs = 70, eraseMs = 35, holdMs = 1800 }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const phrase = phrases[index];
    let delay = erasing ? eraseMs : typeMs;
    let next;
    if (!erasing && length === phrase.length) {
      delay = holdMs;
      next = () => setErasing(true);
    } else if (erasing && length === 0) {
      delay = typeMs * 4;
      next = () => {
        setErasing(false);
        setIndex((i) => (i + 1) % phrases.length);
      };
    } else {
      next = () => setLength((l) => l + (erasing ? -1 : 1));
    }
    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [reduce, phrases, index, length, erasing, typeMs, eraseMs, holdMs]);

  return (
    <>
      <span className="sr-only">{phrases.join(", ")}</span>
      <span className="typewriter" aria-hidden="true">
        <span className="typewriter-prompt">&gt;</span>
        {reduce ? phrases.slice(0, 2).join(" · ") : phrases[index].slice(0, length)}
        {!reduce && <span className="typewriter-caret" />}
      </span>
    </>
  );
}
