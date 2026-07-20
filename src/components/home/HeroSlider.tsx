"use client";

import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Swipe hint (plays once on load) ─────────────────────── */
function SwipeHint() {
	const [show, setShow] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setShow(false), 3000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div
			className={`hero-swipe-hint${show ? "" : " hero-swipe-hint--hidden"}`}
			aria-hidden="true"
		>
			<ChevronLeft size={16} strokeWidth={1.5} />
			<span>Swipe</span>
			<ChevronRight size={16} strokeWidth={1.5} />
		</div>
	);
}

/* ─── Slide data ────────────────────────────────────────────── */
// Cloudinary header images — replacing gradient backgrounds
const CLOUD_BASE = "https://res.cloudinary.com/jqaitieh/image/upload";

const SWIPE_THRESHOLD = 50;

const slides = [
	{
		id: "accessories",
		category: "African Accessories",
		eyebrow: "Bold. Beaded. Yours.",
		headline: (
			<>
				Accessories that
				<br />
				carry <em>culture.</em>
			</>
		),
		description:
			"Handcrafted bags, jewelry, and accents rooted in African artistry. Statement pieces that start conversations.",
		cta: { label: "Shop Accessories", href: "/shop/accessories" },
		gradient: `url(${CLOUD_BASE}/v1784489035/header_image_accessories_gzufhr.jpg) center/cover`,
	},
	{
		id: "rtw",
		category: "Ready to Wear",
		eyebrow: "Effortless. Everyday. Elegant.",
		headline: (
			<>
				Ready-to-wear for
				<br />
				the <em>whole family.</em>
			</>
		),
		description:
			"Curated ready-to-wear pieces that bring Lagos sophistication to your daily life. No compromises on fit or fabric.",
		cta: { label: "Shop Ready-to-Wear", href: "/shop/ready-to-wear" },
		gradient: `url(${CLOUD_BASE}/v1784489038/header_image_ready_to_wear_s2w5da.webp) center/cover`,
	},
	{
		id: "heritage",
		category: "African Heritage",
		eyebrow: "Lagos Fashion House",
		headline: (
			<>
				Dress in pieces
				<br />
				made with <em>intention.</em>
			</>
		),
		description:
			"Ready-to-wear for the whole family, a sewing school for the curious, and a garment factory built for brands. Where craft meets everyday elegance.",
		cta: { label: "Shop Now", href: "/shop" },
		gradient: `url(${CLOUD_BASE}/v1784542161/header_image_african_my_heritage_ustiap_ewunzw.jpg) center/cover`,
	},
];

const n = slides.length;

/* ─── Component ─────────────────────────────────────────────── */
export default function HeroSlider() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const dragStartX = useRef(0);
	const dragStartY = useRef(0);

	const goTo = useCallback((index: number) => {
		setActiveIndex((index + n) % n);
	}, []);

	const goNext = useCallback(() => {
		goTo(activeIndex + 1);
	}, [activeIndex, goTo]);

	const goPrev = useCallback(() => {
		goTo(activeIndex - 1);
	}, [activeIndex, goTo]);

	// ── Autoplay ─────────────────────────────────────────
	useEffect(() => {
		if (isPaused) return;
		intervalRef.current = setInterval(goNext, 5000);
		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
		};
	}, [isPaused, goNext]);

	// ── Drag / Swipe handling ────────────────────────────
	const handleDragStart = useCallback((clientX: number, clientY: number) => {
		dragStartX.current = clientX;
		dragStartY.current = clientY;
		setIsDragging(true);
	}, []);

	const handleDragEnd = useCallback(
		(clientX: number, clientY: number) => {
			setIsDragging(false);
			const dx = clientX - dragStartX.current;
			const dy = clientY - dragStartY.current;

			if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
				if (dx > 0) goPrev();
				else goNext();
			}
		},
		[goNext, goPrev],
	);

	const onMouseDown = useCallback(
		(e: React.MouseEvent) => handleDragStart(e.clientX, e.clientY),
		[handleDragStart],
	);
	const onMouseUp = useCallback(
		(e: React.MouseEvent) => handleDragEnd(e.clientX, e.clientY),
		[handleDragEnd],
	);
	const onMouseLeave = useCallback(() => {
		setIsDragging(false);
		setIsPaused(false);
	}, []);
	const onTouchStart = useCallback(
		(e: React.TouchEvent) =>
			handleDragStart(e.touches[0].clientX, e.touches[0].clientY),
		[handleDragStart],
	);
	const onTouchEnd = useCallback(
		(e: React.TouchEvent) =>
			handleDragEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY),
		[handleDragEnd],
	);

	const slide = slides[activeIndex];
	const prevCategory = slides[(activeIndex - 1 + n) % n].category;
	const nextCategory = slides[(activeIndex + 1) % n].category;

	return (
		<section
			className={`hero hero--slider${isDragging ? " is-dragging" : ""}`}
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={onMouseLeave}
			onMouseDown={onMouseDown}
			onMouseUp={onMouseUp}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
		>
			{/* Background (instantly swaps) */}
			<div className="hero-slider-bg" style={{ background: slide.gradient }} />

			{/* "Est. Lagos" badge */}
			<div className="hero-meta" aria-hidden="true">
				<b>Est. Lagos</b>
				<span>Ready-to-Wear · Since 2012</span>
			</div>

			{/* Content (staggered reveal on key change) */}
			<div className="wrap">
				<div key={slide.id} className="hero-content">
					<span className="eyebrow hero-stagger hero-stagger--1">
						{slide.eyebrow}
					</span>
					<h1 className="hero-stagger hero-stagger--2">{slide.headline}</h1>
					<p className="hero-stagger hero-stagger--3">{slide.description}</p>
					<div className="hero-cta hero-stagger hero-stagger--4">
						<Link href={slide.cta.href} className="btn">
							{slide.cta.label}
							<ArrowRight className="arw" size={16} strokeWidth={2} />
						</Link>
						<Link href="/fun-to-sew" className="btn btn--ghost">
							Explore It&rsquo;s Fun to Sew
						</Link>
					</div>
				</div>
			</div>

			{/* ── Arrow buttons (peel on hover) ──────────── */}
			{n > 1 && (
				<>
					<button
						type="button"
						className="hero-arrow hero-arrow--prev"
						onClick={goPrev}
						aria-label={`Previous slide: ${prevCategory}`}
					>
						<ChevronLeft size={20} strokeWidth={2} />
						<span className="hero-arrow-label">{prevCategory}</span>
					</button>
					<button
						type="button"
						className="hero-arrow hero-arrow--next"
						onClick={goNext}
						aria-label={`Next slide: ${nextCategory}`}
					>
						<span className="hero-arrow-label">{nextCategory}</span>
						<ChevronRight size={20} strokeWidth={2} />
					</button>
				</>
			)}

			{/* ── Swipe hint (top-center, plays once on load) ── */}
			<SwipeHint />

			{/* ── Page counter ──────────────────────────────── */}
			{n > 1 && (
				<button
					type="button"
					className="hero-page-counter"
					onClick={goNext}
					aria-label={`Slide ${activeIndex + 1} of ${n}`}
				>
					<span className="hero-page-num">
						{String(activeIndex + 1).padStart(2, "0")}
					</span>
					<span className="hero-page-sep">/</span>
					<span className="hero-page-num">{String(n).padStart(2, "0")}</span>
				</button>
			)}
		</section>
	);
}
