import Link from "next/link";

export default function AcademySection() {
  return (
    <section className="academy" id="academy" style={{ paddingBlock: 0 }}>
      <div className="wrap">
        <div className="academy-top">
          <div>
            <span className="eyebrow reveal">It&apos;s Fun to Sew Academy</span>
            <h2 className="reveal">Learn to sew, the <em>joyful</em> way.</h2>
            <p className="reveal">
              Whether you dream of sewing for your family or starting a label of your own, our
              classes meet you exactly where you are. Learn from master tailors in our Lagos studio,
              or follow along at your own pace online — with real feedback, warm guidance, and a
              community that cheers you on.
            </p>
            <div className="academy-feats reveal">
              <span className="chip">In-person classes</span>
              <span className="chip">Self-paced online</span>
              <span className="chip">Beginner friendly</span>
              <span className="chip">Certificate on completion</span>
            </div>
            <Link href="/academy" className="btn reveal">
              View All Courses
              <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="ph reveal" aria-hidden="true"><span className="ph-tag">Studio image</span></div>
        </div>

        <div className="course-grid">
          <article className="course-card c1 reveal">
            <div className="ph"><span className="ph-tag">Course image</span></div>
            <div className="course-body">
              <span className="course-format">In-person · 6 weeks</span>
              <h3>Foundations of Sewing</h3>
              <p>Master your machine, seams and finishing from scratch. By the end you&apos;ll have made three garments you&apos;ll actually wear.</p>
              <div className="course-foot">
                <div className="price">₦85,000<small>One-time enrolment</small></div>
                <Link href="/academy/foundations" className="btn btn--enroll">Enroll</Link>
              </div>
            </div>
          </article>

          <article className="course-card c2 reveal">
            <div className="ph"><span className="ph-tag">Course image</span></div>
            <div className="course-body">
              <span className="course-format">In-person · 8 weeks</span>
              <h3>Pattern Drafting &amp; Draping</h3>
              <p>Take measurements, draft your own blocks and bring designs to life on the dress form. Our most-loved intermediate class.</p>
              <div className="course-foot">
                <div className="price">₦120,000<small>One-time enrolment</small></div>
                <Link href="/academy/pattern-drafting" className="btn btn--enroll">Enroll</Link>
              </div>
            </div>
          </article>

          <article className="course-card c3 reveal">
            <div className="ph"><span className="ph-tag">Course image</span></div>
            <div className="course-body">
              <span className="course-format">Online · Self-paced</span>
              <h3>Start Your Fashion Label</h3>
              <p>The business of sewing — pricing, sourcing in Lagos, branding and selling. Lifetime access to every lesson and template.</p>
              <div className="course-foot">
                <div className="price">₦45,000<small>Lifetime access</small></div>
                <Link href="/academy/fashion-label" className="btn btn--enroll">Enroll</Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
