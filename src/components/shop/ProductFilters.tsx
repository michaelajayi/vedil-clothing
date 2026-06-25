"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/products";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest",   label: "Newest" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "Plus"];

export default function ProductFilters({ products }: { products: Product[] }) {
  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState<SortKey>("featured");
  const [activeSizes, setActiveSizes] = useState<string[]>([]);

  const availableSizes = useMemo(() => {
    const all = products.flatMap((p) => p.sizes ?? []);
    return [...new Set(all)].sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a);
      const bi = SIZE_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }, [products]);

  const filtered = useMemo(() => {
    let result = [...products];

    const q = search.trim().toLowerCase();
    if (q) result = result.filter((p) => p.name.toLowerCase().includes(q));

    if (activeSizes.length > 0) {
      result = result.filter((p) => p.sizes?.some((s) => activeSizes.includes(s)));
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.retailPrice - b.retailPrice);
        break;
      case "price-desc":
        result.sort((a, b) => b.retailPrice - a.retailPrice);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // featured
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [products, search, sort, activeSizes]);

  const isFiltered = !!search.trim() || activeSizes.length > 0 || sort !== "featured";

  function toggleSize(size: string) {
    setActiveSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  }

  function clearAll() {
    setSearch("");
    setSort("featured");
    setActiveSizes([]);
  }

  return (
    <div>
      {/* ── Filter bar ──────────────────────────────────────── */}
      <div className="shop-filters">
        <div className="shop-search">
          <Search className="shop-search-icon" strokeWidth={2} aria-hidden="true" />
          <input
            className="shop-search-input"
            type="search"
            placeholder="Search pieces…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="shop-sort">
          <select
            className="shop-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="shop-sort-chevron" strokeWidth={2.5} aria-hidden="true" />
        </div>
      </div>

      {/* ── Size chips ───────────────────────────────────────── */}
      {availableSizes.length > 0 && (
        <div className="shop-size-row">
          <span className="shop-size-label">Size</span>
          <div className="atb-chips">
            {availableSizes.map((s) => (
              <button
                key={s}
                className={`size-chip${activeSizes.includes(s) ? " size-chip--active" : ""}`}
                onClick={() => toggleSize(s)}
                aria-pressed={activeSizes.includes(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {activeSizes.length > 0 && (
            <button className="shop-clear-btn" onClick={() => setActiveSizes([])}>
              Clear sizes
            </button>
          )}
        </div>
      )}

      {/* ── Result meta ──────────────────────────────────────── */}
      <div className="shop-results-bar">
        <p className="shop-count">
          {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        </p>
        {isFiltered && (
          <button className="shop-clear-btn" onClick={clearAll}>
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Grid / empty ─────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <p className="shop-empty">
          Nothing matched.{" "}
          <button className="link-arrow" style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={clearAll}>
            Clear filters →
          </button>
        </p>
      ) : (
        <div className="prod-grid prod-grid--3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
