import type { Metadata } from "next";
import Link from "next/link";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";

export const metadata: Metadata = {
  title: "It's Fun to Sew Academy — Vedil Clothing",
  description:
    "Join hundreds of fashion enthusiasts at the It's Fun to Sew Academy. In-person sewing classes in Lagos from basic to advanced — each with certificate on completion.",
};

const courses = [
  {
    id: "basic",
    title: "Basic Sewing Class",
    duration: "3 months",
    format: "In-person · Lagos",
    description:
      "This is the best place to start — it covers the fundamentals of sewing, providing a strong foundation for every course that follows. By the end you will have mastered the machine and produced your first garments.",
    registration: "₦10,000",
    tuition: "₦300,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#7d6347,#bfa37e)",
  },
  {
    id: "intermediate",
    title: "Intermediate Sewing Class",
    duration: "3 months",
    format: "In-person · Lagos",
    description:
      "Suitable for those who have mastered the Basic Sewing Class course outline and are ready to be introduced to more complex techniques, projects, and garment construction.",
    registration: "₦10,000",
    tuition: "₦400,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#6e1f2a,#b07a3c)",
  },
  {
    id: "advanced",
    title: "Advanced Sewing Class",
    duration: "3 months",
    format: "In-person · Lagos",
    description:
      "Designed for experienced sewists, this class focuses on mastering advanced techniques and perfecting your craft — tailored couture, structural garments, and finishing at a professional standard.",
    registration: "₦10,000",
    tuition: "₦500,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#4a3526,#9a7e54)",
  },
  {
    id: "general-upgrade",
    title: "General Upgrade — Women's Wear",
    duration: "3 months",
    format: "In-person · Lagos",
    description:
      "Suitable for fashion designers and tailors who want to gain up-to-date sewing techniques and practices. It captures topics in Basic, Intermediate, and Advanced classes on womenswear.",
    registration: "₦10,000",
    tuition: "₦800,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#6e1f2a,#a4565f)",
  },
  {
    id: "rtw-production",
    title: "Ready-to-Wear Production Class",
    duration: "8 weeks",
    format: "In-person · Lagos",
    description:
      "For students who wish to gain hands-on experience in ready-to-wear production. You will understand the complete lifecycle of garment production — from concept to finished product.",
    registration: "₦10,000",
    tuition: "₦300,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#2a3d26,#5a7e54)",
  },
  {
    id: "childrens-wear",
    title: "Children's Wear Class",
    duration: "2 months",
    format: "In-person · Lagos",
    description:
      "Designed to provide students with the knowledge and skills necessary to design, produce, and market children's clothing. Intending students should already have basic sewing skills before registering.",
    registration: "₦10,000",
    tuition: "₦300,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#8a6a2f,#c2a35e)",
  },
  {
    id: "menswear",
    title: "Menswear Class",
    duration: "8 weeks",
    format: "In-person · Lagos",
    description:
      "Learn the fundamentals of designing and constructing tailored menswear — from shirts and trousers to native and formal pieces. Perfect for tailors wanting to serve male clientele professionally.",
    registration: "₦10,000",
    tuition: "₦300,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#3a3a4a,#6a7086)",
  },
  {
    id: "apprenticeship",
    title: "Apprenticeship Class",
    duration: "2 months",
    format: "In-person · Lagos",
    description:
      "A practical, industry-focused class that offers real workshop experience and hands-on training for aspiring fashion professionals who want to work in a production environment.",
    registration: "₦10,000",
    tuition: "₦400,000",
    certificate: "₦20,000",
    phColor: "linear-gradient(150deg,#2a211b,#5a4636)",
  },
];

export default function AcademyPage() {
  return (
    <main>
      <ScrollRevealInit />

      {/* Page hero */}
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow reveal">It&apos;s Fun to Sew Academy</span>
          <h1 className="reveal">
            Learn to sew.
            <br />
            <em>Build a career.</em>
          </h1>
          <p className="reveal">
            Join hundreds of fashion enthusiasts and upgrade your skills to another level.
            Learning how to sew at Vedil Clothing is always fun — attention is paid to every
            student&apos;s unique learning needs. We have a conducive learning environment and
            a sewing machine for each student.
          </p>
        </div>
      </section>

      {/* Academy intro */}
      <section className="academy" style={{ paddingBlock: 0 }}>
        <div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,5rem)" }}>
          <div className="academy-top">
            <div>
              <span className="eyebrow reveal">The Academy</span>
              <h2 className="reveal">
                Our training places emphasis on <em>practical hands-on</em> sewing skills.
              </h2>
              <p className="reveal">
                Our courses are structured in a way to help participants learn and master the
                craft. Intending students are advised to take them in order to avoid difficulty
                in catching up. We have a Foundation course to give participants understanding
                before proceeding to Intermediate.
              </p>
              <div className="academy-feats reveal">
                <span className="chip">Certificate on completion</span>
                <span className="chip">Sewing machine per student</span>
                <span className="chip">Small class sizes</span>
                <span className="chip">Hands-on from day one</span>
              </div>
            </div>
            <div className="ph reveal">
              <span className="ph-tag">Academy studio</span>
              <span className="ph-mono">A</span>
            </div>
          </div>
        </div>
      </section>

      {/* Course listing */}
      <section>
        <div className="wrap">
          <div className="sec-head">
            <span className="eyebrow reveal">Sewing classes</span>
            <h2 className="reveal">Our courses</h2>
            <p className="reveal">All fees listed below. Each course includes registration, tuition, and a completion certificate.</p>
          </div>

          <div className="course-listing">
            {courses.map((course, i) => (
              <article key={course.id} className={`course-item${i % 2 !== 0 ? " alt" : ""} reveal`}>
                <div className="ph course-item-img" style={{ background: course.phColor } as React.CSSProperties}>
                  <span className="ph-tag">{course.title}</span>
                </div>
                <div className="course-item-body">
                  <span className="course-duration-badge">{course.format} · {course.duration}</span>
                  <h3>{course.title}</h3>
                  <p className="course-item-desc">{course.description}</p>
                  <div className="course-fees-table">
                    <div className="fee-row">
                      <span>Registration</span>
                      <strong>{course.registration}</strong>
                    </div>
                    <div className="fee-row">
                      <span>Tuition</span>
                      <strong>{course.tuition}</strong>
                    </div>
                    <div className="fee-row">
                      <span>Certificate</span>
                      <strong>{course.certificate}</strong>
                    </div>
                    <div className="fee-row">
                      <span>Duration</span>
                      <strong>{course.duration}</strong>
                    </div>
                  </div>
                  <div className="course-item-actions">
                    <a
                      href="https://wa.me/2348138683171"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn"
                    >
                      Register Now
                      <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </a>
                    <a
                      href="https://wa.me/2348138683171"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn--ghost"
                    >
                      Student Handbook
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--paper)", borderRadius: "36px" }}>
        <div className="wrap" style={{ paddingBlock: "clamp(3rem,6vw,4.5rem)" }}>
          <div className="sec-head center">
            <span className="eyebrow reveal">Ready to start?</span>
            <h2 className="reveal">Not sure which class to take?</h2>
            <p className="reveal">
              Reach out to us on WhatsApp — we&apos;ll help you pick the right course for your
              current skill level and goals.
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <a
              href="https://wa.me/2348138683171"
              target="_blank"
              rel="noopener noreferrer"
              className="btn reveal"
            >
              Chat with us on WhatsApp
              <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
