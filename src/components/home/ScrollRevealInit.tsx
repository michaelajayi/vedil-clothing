"use client";

import { useEffect } from "react";

export default function ScrollRevealInit() {
  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const siblings = [
              ...entry.target.parentElement!.querySelectorAll<HTMLElement>(":scope > .reveal"),
            ];
            const idx = Math.max(0, siblings.indexOf(entry.target as HTMLElement));
            (entry.target as HTMLElement).style.transitionDelay = idx * 80 + "ms";
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
