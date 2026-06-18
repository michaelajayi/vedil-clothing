"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";

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

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <article className="testi-card">
      <div className="quote-mark">&ldquo;</div>
      <p>{t.quote}</p>
      <div className="testi-author">
        <div className="avatar" style={{ background: t.avatarColor }}>{t.initials}</div>
        <div><b>{t.name}</b><span>{t.role}</span></div>
      </div>
    </article>
  );
}

function MobileCarousel() {
  const autoplay = Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="testi-embla">
      <div ref={emblaRef} style={{ overflow: "hidden" }}>
        <div className="testi-embla-container">
          {testimonials.map((t) => (
            <div key={t.name} className="testi-embla-slide">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>
      <div className="testi-dots">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`testi-dot${i === selectedIndex ? " is-active" : ""}`}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section style={{ paddingTop: 0, paddingBottom: "clamp(2.5rem, 6vw, 4rem)" }}>
      <div className="wrap">
        <div className="sec-head center reveal">
          <span className="eyebrow" style={{ justifyContent: "center" }}>Loved in Lagos &amp; beyond</span>
          <h2>What our community says</h2>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="testi-grid">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>

        {/* Mobile: Embla carousel */}
        <MobileCarousel />
      </div>
    </section>
  );
}
