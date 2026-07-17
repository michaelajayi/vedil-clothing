import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import CategoryGridClient from "@/components/shop/CategoryGridClient";
import { CATEGORY_META, isValidCategory } from "@/lib/products";
import type { Category } from "@/lib/products";
import styles from "./page.module.css";

type Props = {
	params: Promise<{ category: string }>;
	searchParams: Promise<{ gender?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { category } = await params;
	if (!isValidCategory(category)) return {};
	const meta = CATEGORY_META[category];
	return {
		title: `${meta.name} | Vedil Clothing`,
		description: meta.description,
	};
}

const GENDER_TABS = [
	{ value: "all", label: "All" },
	{ value: "women", label: "Women" },
	{ value: "men", label: "Men" },
	{ value: "children", label: "Children" },
];

const CATEGORY_TABS: { slug: Category; label: string; num: string }[] = [
	{ slug: "ready-to-wear", label: "Ready to Wear", num: "01" },
	{ slug: "africa-my-heritage", label: "Africa My Heritage", num: "02" },
	{ slug: "accessories", label: "Accessories", num: "03" },
];

export default async function CategoryPage({ params, searchParams }: Props) {
	const { category } = await params;
	const { gender } = await searchParams;

	if (!isValidCategory(category)) notFound();

	const meta = CATEGORY_META[category];
	const activeGender = GENDER_TABS.some((t) => t.value === gender)
		? gender!
		: "all";

	return (
		<main>
			<ScrollRevealInit />

			{/* ── Category hero ─────────────────────────────────────── */}
			<section className={styles.catHero}>
				<div className="wrap">
					<nav className={styles.breadcrumb} aria-label="Breadcrumb">
						<Link href="/shop">Shop</Link>
						<span aria-hidden="true">›</span>
						<span>{meta.name}</span>
					</nav>
					<span className="eyebrow reveal">{meta.tagline}</span>
					<h1 className="reveal">{meta.name}</h1>
					<p className="reveal">{meta.description}</p>
				</div>
			</section>

			{/* ── Category switcher ─────────────────────────────────── */}
			<div className={styles.catSwitcher}>
				<nav className={styles.catSwitcherNav} aria-label="Shop categories">
					{CATEGORY_TABS.map(({ slug, label, num }) => (
						<Link
							key={slug}
							href={`/shop/${slug}`}
							className={`${styles.catSwitcherTab}${category === slug ? ` ${styles.catSwitcherTabActive}` : ""}`}
						>
							<span className={styles.catSwitcherNum}>{num}</span>
							{label}
						</Link>
					))}
				</nav>
			</div>

			{/* ── Filter + grid ─────────────────────────────────────── */}
			<section className={styles.catGrid}>
				<div className="wrap">
					<nav className="filter-tabs" aria-label="Filter by gender">
						{GENDER_TABS.map(({ value, label }) => (
							<Link
								key={value}
								href={
									value === "all"
										? `/shop/${category}`
										: `/shop/${category}?gender=${value}`
								}
								className={`filter-tab${activeGender === value ? " filter-tab--active" : ""}`}
							>
								{label}
							</Link>
						))}
					</nav>

					<CategoryGridClient category={category} activeGender={activeGender} />
				</div>
			</section>
		</main>
	);
}
