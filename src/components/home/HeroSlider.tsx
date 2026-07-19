"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";

/* ─── Slide data ────────────────────────────────────────────── */
// TODO: Replace gradient backgrounds with real images from
//       src/assets/images/hero/ when available.
//       e.g. import accImg from "@/assets/images/hero/accessories.jpg";

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
		gradient:
			"linear-gradient(180deg, rgba(42,33,27,.10), rgba(42,33,27,.55)), linear-gradient(125deg, #7c5a3d, #b89a6f 45%, #d8c4a3)",
	},
	{
		id: "custom",
		category: "Custom Made",
		eyebrow: "Designed with you. Tailored to fit.",
		headline: (
			<>
				Made to measure,
				<br />
				made to <em>last.</em>
			</>
		),
		description:
			"Bespoke creations for those who refuse to compromise on fit or fabric. From consultation to creation.",
		cta: { label: "Request a Quote", href: "/contact" },
		gradient:
			"linear-gradient(180deg, rgba(110,31,42,.06), rgba(110,31,42,.48)), linear-gradient(125deg, #6e1f2a, #b07a3c 45%, #d8c4a3)",
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
		gradient:
			"linear-gradient(180deg, rgba(42,33,27,.08), rgba(42,33,27,.52)), linear-gradient(125deg, #4a3526, #8a6a2f 40%, #c2a35e)",
	},
];

const n = slides.length;

/* ─── Component ─────────────────────────────────────────────── */
export default function HeroSlider() {
	const autoplay = Autoplay({
		delay: 5000,
		stopOnInteraction: false,
		stopOnMouseEnter: true,
	});
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

	const [selectedIndex, setSelectedIndex] = useState(0);
	const [prevTooltip, setPrevTooltip] = useState(slides[n - 1].category);
	const [nextTooltip, setNextTooltip] = useState(slides[1].category);
	const [showPrevTip, setShowPrevTip] = useState(false);
	const [showNextTip, setShowNextTip] = useState(false);
	const tipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const updateTooltips = useCallback((idx: number) => {
		setPrevTooltip(slides[(idx - 1 + n) % n].category);
		setNextTooltip(slides[(idx + 1) % n].category);
	}, []);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		const idx = emblaApi.selectedScrollSnap();
		setSelectedIndex(idx);
		updateTooltips(idx);
	}, [emblaApi, updateTooltips]);

	useEffect(() => {
		if (!emblaApi) return;
		emblaApi.on("select", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, onSelect]);

	// ── Tooltip show/hide ───────────────────────────────
	const showTooltip = (side: "prev" | "next") => {
		if (tipTimerRef.current) clearTimeout(tipTimerRef.current);
		if (side === "prev") {
			setShowPrevTip(true);
		} else {
			setShowNextTip(true);
		}
	};

	const hideTooltip = (side: "prev" | "next") => {
		tipTimerRef.current = setTimeout(() => {
			if (side === "prev") {
				setShowPrevTip(false);
			} else {
				setShowNextTip(false);
			}
		}, 300);
	};

	return (
		<section className="hero hero--slider">
			{/* ── Embla viewport + container ──────────────── */}
			<div className="hero-slider-viewport" ref={emblaRef}>
				<div className="hero-slider-container">
					{slides.map((slide) => (
						<div key={slide.id} className="hero-slider-slide">
							{/* Background */}
							<div
								className="hero-slider-bg"
								style={{ background: slide.gradient }}
							/>

							{/* Persistent category label */}
							<span className="hero-slide-label">{slide.category}</span>

							{/* "Est. Lagos" badge */}
							<div className="hero-meta" aria-hidden="true">
								<b>Est. Lagos</b>
								<span>Ready-to-Wear · Since 2016</span>
							</div>

							{/* Content */}
							<div className="wrap">
								<div className="hero-content">
									<span className="eyebrow reveal">{slide.eyebrow}</span>
									<h1 className="reveal">{slide.headline}</h1>
									<p className="reveal">{slide.description}</p>
									<div className="hero-cta reveal">
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
						</div>
					))}
				</div>
			</div>

			{/* ── Prev / Next arrows ─────────────────────── */}
			{n > 1 && (
				<>
					<button
						type="button"
						className="hero-slider-arrow hero-slider-arrow--prev"
						onClick={() => emblaApi?.scrollPrev()}
						onMouseEnter={() => showTooltip("prev")}
						onMouseLeave={() => hideTooltip("prev")}
						onFocus={() => showTooltip("prev")}
						onBlur={() => hideTooltip("prev")}
						aria-label="Previous slide"
					>
						<ChevronLeft size={24} strokeWidth={2.5} />
						<span
							className={`hero-arrow-tip hero-arrow-tip--prev${showPrevTip ? " is-visible" : ""}`}
							aria-hidden="true"
						>
							{prevTooltip}
						</span>
					</button>
					<button
						type="button"
						className="hero-slider-arrow hero-slider-arrow--next"
						onClick={() => emblaApi?.scrollNext()}
						onMouseEnter={() => showTooltip("next")}
						onMouseLeave={() => hideTooltip("next")}
						onFocus={() => showTooltip("next")}
						onBlur={() => hideTooltip("next")}
						aria-label="Next slide"
					>
						<ChevronRight size={24} strokeWidth={2.5} />
						<span
							className={`hero-arrow-tip hero-arrow-tip--next${showNextTip ? " is-visible" : ""}`}
							aria-hidden="true"
						>
							{nextTooltip}
						</span>
					</button>
				</>
			)}

			{/* ── Dot indicators ──────────────────────────── */}
			{n > 1 && (
				<div className="hero-slider-dots" role="tablist" aria-label="Slides">
					{slides.map((slide, i) => (
						<button
							key={slide.id}
							type="button"
							role="tab"
							aria-selected={i === selectedIndex}
							aria-label={`Slide ${i + 1}: ${slide.category}`}
							className={`hero-slider-dot${i === selectedIndex ? " is-active" : ""}`}
							onClick={() => emblaApi?.scrollTo(i)}
						/>
					))}
				</div>
			)}
		</section>
	);
}
