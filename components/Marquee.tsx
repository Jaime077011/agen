const ITEMS = ['BRAND IDENTITY', 'WEB & STORE', 'AI SYSTEMS', 'PAID MEDIA', 'SEO', 'AUTOMATION', 'CONTENT'];

function MarqueeContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i}>
          <span className="marquee-item">{item}</span>
          <span className="marquee-sep">✦</span>
        </span>
      ))}
    </>
  );
}

export function Marquee() {
  return (
    <section className="marquee-section">
      <div className="marquee-track">
        <div className="marquee-inner">
          <MarqueeContent />
          <MarqueeContent />
        </div>
      </div>
    </section>
  );
}
