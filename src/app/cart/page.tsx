"use client";

import Link from "next/link";
import { useCart, effectivePrice, fmtPrice } from "@/contexts/CartContext";

export default function CartPage() {
  const { items, subtotal, removeItem, setQty, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main style={{ paddingBlock: "clamp(4rem,10vw,8rem)", textAlign: "center" }}>
        <div className="wrap" style={{ maxWidth: 560 }}>
          <svg
            width="56" height="56" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.4"
            style={{ margin: "0 auto 1.4rem", opacity: .3 }}
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <path d="M3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.4rem)", marginBottom: ".8rem" }}>
            Your cart is empty
          </h1>
          <p style={{ color: "var(--ink-soft)", marginBottom: "2rem" }}>
            Browse the shop and add something you love.
          </p>
          <Link href="/shop" className="btn">Shop Now</Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingBlock: "clamp(2.5rem,6vw,4.5rem)" }}>
      <div className="wrap">
        <h1 style={{ fontSize: "clamp(2rem,4vw,2.8rem)", marginBottom: "2.5rem" }}>
          Shopping Cart
        </h1>

        <div className="cart-page-layout">
          {/* Item table */}
          <div>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Price</th>
                  <th style={{ textAlign: "right" }}>Total</th>
                  <th aria-label="Remove" />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const price = effectivePrice(item);
                  const isWholesale =
                    item.wholesalePrice !== null && item.quantity >= item.moq;
                  const moqLeft =
                    item.wholesalePrice !== null && !isWholesale
                      ? item.moq - item.quantity
                      : 0;

                  return (
                    <tr key={item.id}>
                      {/* Product */}
                      <td>
                        <div className="product-cell">
                          <div className="product-thumb ph" aria-hidden="true" />
                          <div>
                            <p className="product-name">{item.name}</p>
                            {item.size && (
                              <p className="product-size">Size: {item.size}</p>
                            )}
                            {moqLeft > 0 && (
                              <p style={{ fontSize: ".75rem", color: "var(--gold)", marginTop: ".3rem" }}>
                                Add {moqLeft} more for wholesale ({fmtPrice(item.wholesalePrice!)})
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Qty */}
                      <td style={{ textAlign: "center" }}>
                        <div className="qty-ctrl" style={{ margin: "0 auto", width: "fit-content" }}>
                          <button
                            className="qty-btn"
                            onClick={() => setQty(item.id, item.quantity - 1)}
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="qty-num">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => setQty(item.id, item.quantity + 1)}
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Unit price */}
                      <td style={{ textAlign: "right" }}>
                        <span className={`cell-price${isWholesale ? " ws" : ""}`}>
                          {fmtPrice(price)}
                          {isWholesale && (
                            <span className="ws-label">Wholesale</span>
                          )}
                        </span>
                      </td>

                      {/* Line total */}
                      <td style={{ textAlign: "right" }}>
                        <span className={`cell-price${isWholesale ? " ws" : ""}`}>
                          {fmtPrice(price * item.quantity)}
                        </span>
                      </td>

                      {/* Remove */}
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
              <Link href="/shop" className="btn btn--ghost">
                ← Continue Shopping
              </Link>
              <button
                className="btn btn--ghost"
                onClick={clearCart}
                style={{ fontSize: ".85rem" }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            {items.map((item) => {
              const price = effectivePrice(item);
              return (
                <div className="summary-row" key={item.id}>
                  <span>
                    {item.name}
                    {item.size ? ` (${item.size})` : ""}
                    {" ×"}{item.quantity}
                  </span>
                  <strong>{fmtPrice(price * item.quantity)}</strong>
                </div>
              );
            })}

            <div className="summary-row" style={{ marginTop: ".5rem" }}>
              <span>Delivery</span>
              <strong>Calculated at checkout</strong>
            </div>

            <div className="summary-row total">
              <span>Subtotal</span>
              <strong>{fmtPrice(subtotal)}</strong>
            </div>

            <Link href="/checkout" className="btn" style={{ display: "flex", marginTop: "1.4rem" }}>
              Proceed to Checkout
              <svg className="arw" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>

            <p style={{ fontSize: ".78rem", color: "var(--ink-soft)", textAlign: "center", marginTop: ".8rem" }}>
              Secure checkout via Paystack
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
