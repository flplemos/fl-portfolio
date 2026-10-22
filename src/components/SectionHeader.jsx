export default function SectionHeader({ index, eyebrow, title, id }) {
  return (
    <header className="section-header" data-reveal>
      <p className="eyebrow">
        <span className="eyebrow-index">{String(index).padStart(2, "0")}</span> {eyebrow}
      </p>
      <h2 id={id} className="section-title">{title}</h2>
    </header>
  );
}
