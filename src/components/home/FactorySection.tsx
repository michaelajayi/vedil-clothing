import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
              brands. Our factory delivers consistent quality at scale. Share your specs and
              we&apos;ll handle sampling, sourcing and finishing, on time.
            </p>
            <Link href="/garment-factory#quote" className="btn">
              Request a Quote
              <ArrowRight className="arw" size={16} strokeWidth={2} />
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
