import Link from "next/link";

export default function FactorySection() {
  return (
    <section id="factory">
      <div className="wrap">
        <div className="factory reveal">
          <div className="ph" aria-hidden="true">
            <span className="ph-tag" style={{ left: "auto", right: 16, bottom: 16 }}>Factory image</span>
          </div>
          <div className="inner">
            <span className="eyebrow">Vedil Garment Factory</span>
            <h2>Custom orders &amp; <em>bulk manufacturing.</em></h2>
            <p>
              From staff uniforms and event aso-ebi to full production runs for growing fashion
              brands — our factory delivers consistent quality at scale. Share your specs and
              we&apos;ll handle sampling, sourcing and finishing, on time.
            </p>
            <Link href="/contact#quote" className="btn">
              Request a Quote
              <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="factory-stats">
              <div><b>500+</b><span>Garments / week capacity</span></div>
              <div><b>50</b><span>Piece minimum order</span></div>
              <div><b>10+</b><span>Years of production</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
