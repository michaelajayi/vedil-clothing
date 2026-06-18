const testimonials = [
  {
    quote: "The fit and finishing on my outfits are always perfect. Vedil has become my go-to for ready-to-wear that actually feels made for me.",
    name: "Adaeze Okafor",
    role: "Lekki, Lagos",
    initials: "AO",
    avatarColor: "var(--burgundy)",
  },
  {
    quote: "I joined the Foundations class as a complete beginner and now I sew for my kids every weekend. The teachers are so patient and warm.",
    name: "Tunde Bello",
    role: "It's Fun to Sew student",
    initials: "TB",
    avatarColor: "var(--gold)",
  },
  {
    quote: "We ordered 300 branded shirts for our company retreat. The factory handled everything and delivered ahead of schedule. Truly reliable.",
    name: "Ngozi Eze",
    role: "Operations Lead, Brightwave Ltd",
    initials: "NE",
    avatarColor: "#4a3526",
  },
];

export default function TestimonialsSection() {
  return (
    <section style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Loved in Lagos &amp; beyond</span>
          <h2>What our community says</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t) => (
            <article key={t.name} className="testi-card reveal">
              <div className="quote-mark">&ldquo;</div>
              <p>{t.quote}</p>
              <div className="stars">★★★★★</div>
              <div className="testi-author">
                <div className="avatar" style={{ background: t.avatarColor }}>{t.initials}</div>
                <div><b>{t.name}</b><span>{t.role}</span></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
