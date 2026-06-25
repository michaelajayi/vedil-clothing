"use client";

import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, effectivePrice, fmtPrice } from "@/contexts/CartContext";

export default function CartDrawer() {
  const { items, isOpen, itemCount, subtotal, removeItem, setQty, closeCart } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-overlay${isOpen ? " open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`cart-drawer${isOpen ? " open" : ""}`}
        aria-label="Shopping cart"
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="cart-drawer-head">
          <h2>
            Cart
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <X strokeWidth={2} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag strokeWidth={1.5} />
              <p>Your cart is empty.</p>
              <button className="btn" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => {
              const price = effectivePrice(item);
              const isWholesale =
                item.wholesalePrice !== null && item.quantity >= item.moq;
              const moqLeft =
                item.wholesalePrice !== null && !isWholesale
                  ? item.moq - item.quantity
                  : 0;

              return (
                <div key={item.id} className="cart-item">
                  {/* Thumbnail placeholder */}
                  <div className="cart-item-img ph" aria-hidden="true" />

                  <div>
                    <div className="cart-item-top">
                      <div>
                        <p className="cart-item-name">{item.name}</p>
                        {item.size && (
                          <p className="cart-item-size">Size: {item.size}</p>
                        )}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p className={`cart-item-price${isWholesale ? " ws" : ""}`}>
                          {fmtPrice(price)}
                        </p>
                        {isWholesale && (
                          <span className="cart-item-old">
                            {fmtPrice(item.retailPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="cart-item-footer">
                      {/* Qty control */}
                      <div className="qty-ctrl">
                        <button
                          className="qty-btn"
                          onClick={() => setQty(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => setQty(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="cart-remove"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>

                    {/* MOQ hint */}
                    {moqLeft > 0 && (
                      <p className="cart-moq-tip">
                        Add {moqLeft} more for wholesale price ({fmtPrice(item.wholesalePrice!)})
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-subtotal-row">
              <span>Subtotal</span>
              <strong>{fmtPrice(subtotal)}</strong>
            </div>
            <div className="cart-foot-btns">
              <Link href="/checkout" className="btn" onClick={closeCart}>
                Checkout
                <ArrowRight className="arw" size={16} strokeWidth={2} />
              </Link>
              <Link href="/cart" className="btn btn--outline" onClick={closeCart}>
                View Cart
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
