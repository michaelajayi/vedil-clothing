export type Category = "africa-my-heritage" | "ready-to-wear" | "accessories";
export type Gender = "women" | "men" | "children" | "unisex";

export type Product = {
	id: string;
	name: string;
	description?: string;
	category: Category;
	gender: Gender;
	retailPrice: number;
	wholesalePrice: number;
	moq: number;
	featured?: boolean;
	isNew?: boolean;
	sizes?: string[];
};

export const CATEGORY_META: Record<
	Category,
	{ name: string; tagline: string; description: string; mono: string }
> = {
	"africa-my-heritage": {
		name: "Africa My Heritage",
		tagline: "Ankara · African prints",
		description:
			"Vibrant Ankara prints and African fabric traditions reimagined for the modern wardrobe.",
		mono: "A",
	},
	"ready-to-wear": {
		name: "Ready to Wear",
		tagline: "Everyday dressing, elevated",
		description:
			"Clean silhouettes and versatile pieces designed for effortless everyday style.",
		mono: "R",
	},
	accessories: {
		name: "Accessories",
		tagline: "The finishing touch",
		description: "Hats, jewellery, and style pieces that complete every look.",
		mono: "Ac",
	},
};

export const PRODUCTS: Product[] = [];

export function fmtPrice(n: number): string {
	return "₦" + n.toLocaleString("en-NG");
}

export function getByCategory(category: Category, gender?: string): Product[] {
	return PRODUCTS.filter((p) => {
		if (p.category !== category) return false;
		if (!gender || gender === "all") return true;
		return p.gender === gender || p.gender === "unisex";
	});
}

export function getProduct(id: string): Product | undefined {
	return PRODUCTS.find((p) => p.id === id);
}

export function getRelated(product: Product, limit = 3): Product[] {
	return PRODUCTS.filter(
		(p) => p.category === product.category && p.id !== product.id,
	).slice(0, limit);
}

export function getFeatured(): Product[] {
	return PRODUCTS.filter((p) => p.featured);
}

export function isValidCategory(slug: string): slug is Category {
	return slug in CATEGORY_META;
}
