"use client";

import Link from "next/link";
import { ShoppingBag, X, ArrowRight } from "lucide-react";
import { useCart, effectivePrice, fmtPrice } from "@/contexts/CartContext";

/**
 * Render a formatted list of selected variant options,
 * e.g. "Size: XL, Color: Red"
 */
function formatOptions(options?: Record<string, string>): string | null {
	if (!options) return null;
	const entries = Object.entries(options);
	if (entries.length === 0) return null;
	return entries.map(([key, val]) => `${key}: ${val}`).join(", ");
}

export default function CartPage() {
	const { items, subtotal, removeItem, setQty, clearCart } = useCart();

	if (items.length === 0) {
		return (
			<main
				style={{ paddingBlock: "clamp(4rem,10vw,8rem)", textAlign: "center" }}
			>
				<div className="wrap" style={{ maxWidth: 560 }}>
					<ShoppingBag
						size={56}
						strokeWidth={1.4}
						style={{ margin: "0 auto 1.4rem", opacity: 0.3 }}
					/>
					<h1
						style={{
							fontSize: "clamp(1.8rem,4vw,2.4rem)",
							marginBottom: ".8rem",
						}}
					>
						Your cart is empty
					</h1>
					<p style={{ color: "var(--ink-soft)", marginBottom: "2rem" }}>
						Browse the shop and add something you love.
					</p>
					<Link href="/shop" className="btn">
						Shop Now
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main style={{ paddingBlock: "clamp(2.5rem,6vw,4.5rem)" }}>
			<div className="wrap">
				<h1
					style={{ fontSize: "clamp(2rem,4vw,2.8rem)", marginBottom: "2.5rem" }}
				>
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
											<td data-label="Product">
												<div className="product-cell">
													<div
														className="product-thumb ph"
														aria-hidden="true"
													/>
													<div>
														{item.productId && item.category ? (
															<Link
																href={`/shop/${item.category}/${item.productId}`}
																className="product-name-link"
															>
																<p className="product-name">{item.name}</p>
															</Link>
														) : (
															<p className="product-name">{item.name}</p>
														)}
														{/* Show all selected options */}
														{(() => {
															const opts = formatOptions(item.options);
															return opts ? (
																<p className="product-size">{opts}</p>
															) : null;
														})()}
														<div className="product-price-row">
															<span
																className={`cell-price${isWholesale ? " ws" : ""}`}
															>
																{fmtPrice(price)}
																{isWholesale && (
																	<span className="ws-label">Wholesale</span>
																)}
															</span>
														</div>
														{moqLeft > 0 && (
															<p className="moq-tip">
																Add {moqLeft} more for wholesale (
																{fmtPrice(item.wholesalePrice!)})
															</p>
														)}
													</div>
												</div>
											</td>

											{/* Qty */}
											<td data-label="Qty">
												<div className="qty-total-row">
													<div className="qty-ctrl">
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
													<span
														className={`cell-price${isWholesale ? " ws" : ""}`}
														style={{ fontSize: ".95rem" }}
													>
														{fmtPrice(price * item.quantity)}
													</span>
												</div>
											</td>

											{/* Unit price */}
											<td data-label="Unit Price">
												<span
													className={`cell-price${isWholesale ? " ws" : ""}`}
												>
													{fmtPrice(price)}
													{isWholesale && (
														<span className="ws-label">Wholesale</span>
													)}
												</span>
											</td>

											{/* Line total */}
											<td data-label="Total">
												<span
													className={`cell-price${isWholesale ? " ws" : ""}`}
												>
													{fmtPrice(price * item.quantity)}
												</span>
											</td>

											{/* Remove */}
											<td data-label="Remove">
												<button
													className="remove-btn"
													onClick={() => removeItem(item.id)}
													aria-label={`Remove ${item.name}`}
												>
													<X size={18} strokeWidth={2} />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginTop: "1.5rem",
							}}
						>
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
										{(() => {
											const opts = formatOptions(item.options);
											return opts
												? ` (${opts})`
												: item.size
													? ` (${item.size})`
													: "";
										})()}
										{" ×"}
										{item.quantity}
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

						<Link
							href="/checkout"
							className="btn"
							style={{ display: "flex", marginTop: "1.4rem" }}
						>
							Proceed to Checkout
							<ArrowRight className="arw" size={16} strokeWidth={2} />
						</Link>

						<p
							style={{
								fontSize: ".78rem",
								color: "var(--ink-soft)",
								textAlign: "center",
								marginTop: ".8rem",
							}}
						>
							Secure checkout via Paystack
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
