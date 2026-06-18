"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header className="nav" ref={headerRef} id="nav">
        <div className="wrap nav-inner">
          <Link href="/" className="logo" aria-label="Vedil Clothing home">
            Ve<b>dil</b><span className="dot">.</span>
          </Link>

          <ul className="nav-links">
            <li className="has-dropdown">
              <button className="nav-item" aria-haspopup="true">
                Shop
                <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div className="dropdown">
                <Link href="/shop/men"><strong>Men</strong><span>Clothing &amp; Accessories</span></Link>
                <Link href="/shop/women"><strong>Women</strong><span>Clothing &amp; Accessories</span></Link>
                <Link href="/shop/children"><strong>Children</strong><span>Clothing &amp; Accessories</span></Link>
              </div>
            </li>
            <li><Link href="/academy" className="nav-item">Academy</Link></li>
            <li><Link href="/garment-factory" className="nav-item">Garment Factory</Link></li>
            <li><Link href="/contact" className="nav-item">Contact</Link></li>
          </ul>

          <div className="nav-actions">
            <button className="icon-btn" aria-label="View cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="cart-count">2</span>
            </button>
            <button
              className="icon-btn menu-toggle"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        id="mobileMenu"
        aria-hidden={!menuOpen}
      >
        <button
          className="icon-btn mobile-close"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
        <div className="sub-links">
          <Link href="/shop/men" onClick={() => setMenuOpen(false)}>Men</Link>
          <Link href="/shop/women" onClick={() => setMenuOpen(false)}>Women</Link>
          <Link href="/shop/children" onClick={() => setMenuOpen(false)}>Children</Link>
        </div>
        <Link href="/academy" onClick={() => setMenuOpen(false)}>Academy</Link>
        <Link href="/garment-factory" onClick={() => setMenuOpen(false)}>Garment Factory</Link>
        <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
      </nav>
    </>
  );
}
