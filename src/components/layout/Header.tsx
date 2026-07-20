"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Header() {
	const headerRef = useRef<HTMLElement>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const { itemCount, openCart } = useCart();

	useEffect(() => {
		const header = headerRef.current;
		if (!header) return;
		const onScroll = () =>
			header.classList.toggle("scrolled", window.scrollY > 12);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);

	return (
		<>
			<header className="nav" ref={headerRef} id="nav">
				<div className="wrap nav-inner">
					<Link href="/" className="logo" aria-label="Vedil Clothing home">
						<img
							src="https://res.cloudinary.com/jqaitieh/image/upload/v1784491169/logo_p1utgu.png"
							alt="Vedil Clothing"
							className="logo-img"
						/>
					</Link>

					<ul className="nav-links">
						<li
							className={`has-dropdown${dropdownOpen ? " dropdown-open" : ""}`}
							onMouseEnter={() => setDropdownOpen(true)}
							onMouseLeave={() => setDropdownOpen(false)}
							onFocus={() => setDropdownOpen(true)}
							onBlur={(e) => {
								if (!e.currentTarget.contains(e.relatedTarget)) {
									setDropdownOpen(false);
								}
							}}
						>
							<button className="nav-item" aria-haspopup="true">
								Shop
								<ChevronDown className="chev" strokeWidth={2} />
							</button>
							<div
								className="dropdown dropdown--mega"
								onClick={() => setDropdownOpen(false)}
							>
								<div className="mega-col">
									<span className="mega-heading">Collections</span>
									<Link href="/shop/africa-my-heritage" className="mega-item">
										<strong>Africa My Heritage</strong>
										<span>Ankara &amp; African prints</span>
									</Link>
									<Link href="/shop/ready-to-wear" className="mega-item">
										<strong>Ready to Wear</strong>
										<span>Everyday dressing, elevated</span>
									</Link>
									<Link href="/shop/accessories" className="mega-item">
										<strong>Accessories</strong>
										<span>Hats, jewellery &amp; more</span>
									</Link>
								</div>
								<div className="mega-rule" />
								<div className="mega-col">
									<span className="mega-heading">Shop by</span>
									<Link
										href="/shop/ready-to-wear?gender=women"
										className="mega-item"
									>
										<strong>Women</strong>
									</Link>
									<Link
										href="/shop/ready-to-wear?gender=men"
										className="mega-item"
									>
										<strong>Men</strong>
									</Link>
									<Link
										href="/shop/ready-to-wear?gender=children"
										className="mega-item"
									>
										<strong>Children</strong>
									</Link>
									<Link href="/shop" className="mega-view-all">
										View All →
									</Link>
								</div>
							</div>
						</li>
						<li>
							<Link href="/about" className="nav-item">
								About
							</Link>
						</li>
						<li>
							<Link href="/fun-to-sew" className="nav-item">
								It&apos;s Fun to Sew
							</Link>
						</li>
						<li>
							<Link href="/garment-factory" className="nav-item">
								Garment Factory
							</Link>
						</li>
						<li>
							<Link href="/faq" className="nav-item">
								FAQ
							</Link>
						</li>
						<li>
							<Link href="/contact" className="nav-item">
								Contact
							</Link>
						</li>
					</ul>

					<div className="nav-actions">
						<button
							className="icon-btn"
							aria-label="View cart"
							onClick={openCart}
						>
							<ShoppingBag strokeWidth={1.7} />
							{itemCount > 0 && <span className="cart-count">{itemCount}</span>}
						</button>
						<button
							className="icon-btn menu-toggle"
							aria-label="Open menu"
							onClick={() => setMenuOpen(true)}
						>
							<Menu strokeWidth={2} />
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
					<X strokeWidth={2} />
				</button>
				<Link href="/shop" onClick={() => setMenuOpen(false)}>
					Shop
				</Link>
				<div className="sub-links">
					<div className="sub-links-pills">
						<Link
							href="/shop/africa-my-heritage"
							onClick={() => setMenuOpen(false)}
						>
							Africa My Heritage
						</Link>
						<Link href="/shop/ready-to-wear" onClick={() => setMenuOpen(false)}>
							Ready to Wear
						</Link>
						<Link href="/shop/accessories" onClick={() => setMenuOpen(false)}>
							Accessories
						</Link>
					</div>
				</div>
				<Link href="/about" onClick={() => setMenuOpen(false)}>
					About
				</Link>
				<Link href="/fun-to-sew" onClick={() => setMenuOpen(false)}>
					It&apos;s Fun to Sew
				</Link>
				<Link href="/garment-factory" onClick={() => setMenuOpen(false)}>
					Garment Factory
				</Link>
				<Link href="/faq" onClick={() => setMenuOpen(false)}>
					FAQ
				</Link>
				<Link href="/contact" onClick={() => setMenuOpen(false)}>
					Contact
				</Link>
			</nav>
		</>
	);
}
