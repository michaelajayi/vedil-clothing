"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { fmtPrice } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  const href = `/shop/${product.category}/${product.id}`;

  function addToBag(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      moq: product.moq,
      category: product.category,
    });
  }

  const genderLabel =
    product.gender === "unisex"
      ? "Unisex"
      : product.gender.charAt(0).toUpperCase() + product.gender.slice(1);

  return (
    <article className="prod-card">
      <div className="ph prod-img">
        <span className="ph-mono">{product.name[0]}</span>
        <span className="ph-tag">{genderLabel}</span>
        {product.isNew && <span className="prod-new-badge">New</span>}
        <button
          className="prod-quick"
          onClick={addToBag}
          aria-label={`Add ${product.name} to bag`}
        >
          Add to Bag
        </button>
      </div>
      <div className="prod-info">
        <h3 className="prod-name">
          <Link href={href} className="prod-card-link">
            {product.name}
          </Link>
        </h3>
        <p className="prod-price">{fmtPrice(product.retailPrice)}</p>
        <p className="prod-wholesale">
          Buy {product.moq}+ &middot; {fmtPrice(product.wholesalePrice)}
        </p>
      </div>
    </article>
  );
}
