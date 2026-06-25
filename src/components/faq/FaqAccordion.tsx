"use client";

import { useState } from "react";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { heading: string; items: FaqItem[] };

function FaqGroup({ group }: { group: FaqGroup }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const slug = group.heading.toLowerCase().replace(/\s+/g, "-");

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className="faq-group">
      <h3 className="faq-group-heading">{group.heading}</h3>
      <div className="faq-list">
        {group.items.map((item, i) => {
          const open = openIndex === i;
          const id = `faq-${slug}-${i}`;
          return (
            <div key={i} className={`faq-item${open ? " open" : ""}`}>
              <button
                className="faq-q"
                onClick={() => toggle(i)}
                aria-expanded={open}
                aria-controls={id}
              >
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="faq-icon-v" />
                    <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div className="faq-a" id={id} role="region">
                <div className="faq-a-inner">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="faq-groups">
      {groups.map((group) => (
        <FaqGroup key={group.heading} group={group} />
      ))}
    </div>
  );
}
