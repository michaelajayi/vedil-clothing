"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { fmtPrice } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function AddToBag({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasSizes = !!product.sizes?.length;
  const [selectedSize, setSelectedSize] = useState<string | null>(hasSizes ? null : "one-size");
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      moq: product.moq,
      category: product.category,
      size: selectedSize === "one-size" ? undefined : selectedSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="atb">
      {hasSizes && (
        <div className="atb-sizes">
          <p className="atb-size-label">Size</p>
          <div className="atb-chips">
            {product.sizes!.map((s) => (
              <button
                key={s}
                className={`size-chip${selectedSize === s ? " size-chip--active" : ""}`}
                onClick={() => setSelectedSize(s)}
                aria-pressed={selectedSize === s}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        className={`btn atb-btn${added ? " atb-btn--added" : ""}`}
        onClick={handleAdd}
        disabled={!selectedSize}
        aria-disabled={!selectedSize}
      >
        {added ? "Added ✓" : hasSizes && !selectedSize ? "Select a size" : "Add to Bag"}
      </button>

      {product.wholesalePrice && (
        <p className="atb-ws-note">
          Buy {product.moq}+ units for wholesale pricing —{" "}
          <strong>{fmtPrice(product.wholesalePrice)}</strong> per unit
        </p>
      )}
    </div>
  );
}
