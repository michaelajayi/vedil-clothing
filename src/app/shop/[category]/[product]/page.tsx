import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { isValidCategory } from "@/lib/products";
import type { Category } from "@/lib/products";
import "@/styles/size-chart.css";

type Props = {
	params: Promise<{ category: string; product: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { category } = await params;
	if (!isValidCategory(category)) return {};
	return {
		title: "Product | Vedil Clothing",
	};
}

export default async function ProductPage({ params }: Props) {
	const { category, product: productId } = await params;

	if (!isValidCategory(category)) notFound();

	return (
		<main>
			<ScrollRevealInit />
			<ProductDetailClient productId={productId} category={category as Category} />
		</main>
	);
}
