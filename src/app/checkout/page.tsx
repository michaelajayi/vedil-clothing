"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { Check, ArrowRight } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { useCart, effectivePrice, fmtPrice } from "@/contexts/CartContext";
import Combobox from "@/components/ui/Combobox";
import { NIGERIA_STATES } from "@/lib/nigeria-states";

// Delivery fees — will be fetched from GET /api/config/public
// See docs/api-contract.md (Site Config section) for the field mapping
const DELIVERY_FEES: Record<string, number> = {
	pickup: 0,
	dispatch: 0,
	dhl: 0,
};

const DELIVERY_LABELS: Record<string, string> = {
	pickup: "Self Pick-up: No. 95 Ago Palace Way, Okota (Free)",
	dispatch: "Your Dispatch Rider ",
	dhl: "Vedil Ships via DHL ",
};

type FormData = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	delivery: "pickup" | "dispatch" | "dhl";
	note: string;
};

declare const PaystackPop: {
	setup(opts: {
		key: string;
		email: string;
		amount: number;
		currency: string;
		ref: string;
		metadata?: Record<string, unknown>;
		callback: (response: { reference: string }) => void;
		onClose: () => void;
	}): { openIframe(): void };
};

export default function CheckoutPage() {
	const { items, subtotal, clearCart } = useCart();
	const [form, setForm] = useState<FormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		address: "",
		city: "",
		state: "",
		delivery: "pickup",
		note: "",
	});
	const [loading, setLoading] = useState(false);
	const [done, setDone] = useState(false);
	const [paystackReady, setPaystackReady] = useState(false);

	const deliveryFee = DELIVERY_FEES[form.delivery];
	const total = subtotal + deliveryFee;

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!paystackReady) {
			alert("Payment system is loading. Please try again in a moment.");
			return;
		}

		const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
		if (!key) {
			alert(
				"Payment is not configured yet. Please contact us via WhatsApp to place your order.",
			);
			return;
		}

		setLoading(true);

		const handler = PaystackPop.setup({
			key,
			email: form.email,
			amount: total * 100, // Paystack uses kobo
			currency: "NGN",
			ref: `vedil_${Date.now()}`,
			metadata: {
				custom_fields: [
					{
						display_name: "Customer",
						variable_name: "customer",
						value: `${form.firstName} ${form.lastName}`,
					},
					{ display_name: "Phone", variable_name: "phone", value: form.phone },
					{
						display_name: "Delivery",
						variable_name: "delivery",
						value: DELIVERY_LABELS[form.delivery],
					},
					{
						display_name: "Address",
						variable_name: "address",
						value: `${form.address}, ${form.city}, ${form.state}`,
					},
				],
			},
			callback(response) {
				setLoading(false);
				clearCart();
				setDone(true);
				console.log("Paystack ref:", response.reference);
			},
			onClose() {
				setLoading(false);
			},
		});

		handler.openIframe();
	}

	// ─── Empty cart ───────────────────────────────────────────────
	if (items.length === 0 && !done) {
		return (
			<main
				style={{ paddingBlock: "clamp(4rem,10vw,8rem)", textAlign: "center" }}
			>
				<div className="wrap" style={{ maxWidth: 480 }}>
					<h1
						style={{
							fontSize: "clamp(1.8rem,4vw,2.4rem)",
							marginBottom: ".8rem",
						}}
					>
						Nothing to checkout
					</h1>
					<p style={{ color: "var(--ink-soft)", marginBottom: "2rem" }}>
						Add items to your cart before checking out.
					</p>
					<Link href="/shop" className="btn">
						Browse Shop
					</Link>
				</div>
			</main>
		);
	}

	// ─── Order confirmed ──────────────────────────────────────────
	if (done) {
		return (
			<main
				style={{ paddingBlock: "clamp(4rem,10vw,8rem)", textAlign: "center" }}
			>
				<div className="wrap" style={{ maxWidth: 520 }}>
					<div
						style={{
							width: 72,
							height: 72,
							borderRadius: "50%",
							background: "rgba(110,31,42,.1)",
							display: "grid",
							placeItems: "center",
							margin: "0 auto 1.6rem",
							color: "var(--burgundy)",
						}}
					>
						<Check size={32} strokeWidth={2} />
					</div>
					<h1
						style={{
							fontSize: "clamp(1.8rem,4vw,2.6rem)",
							marginBottom: ".8rem",
						}}
					>
						Order Confirmed!
					</h1>
					<p style={{ color: "var(--ink-soft)", marginBottom: ".6rem" }}>
						Thank you, {form.firstName}. Your payment was successful and your
						order is being processed.
					</p>
					<p style={{ color: "var(--ink-soft)", marginBottom: "2.4rem" }}>
						A confirmation will be sent to <strong>{form.email}</strong>.
					</p>
					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "center",
							flexWrap: "wrap",
						}}
					>
						<Link href="/shop" className="btn">
							Continue Shopping
						</Link>
						<a
							href="https://wa.me/2348138683171"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn--ghost"
						>
							Chat on WhatsApp
							<WhatsappIcon size={17} />
						</a>
					</div>
				</div>
			</main>
		);
	}

	// ─── Checkout form ────────────────────────────────────────────
	return (
		<>
			<Script
				src="https://js.paystack.co/v1/inline.js"
				onReady={() => setPaystackReady(true)}
			/>

			<main style={{ paddingBlock: "clamp(2.5rem,6vw,4.5rem)" }}>
				<div className="wrap">
					<h1
						style={{
							fontSize: "clamp(2rem,4vw,2.8rem)",
							marginBottom: "2.5rem",
						}}
					>
						Checkout
					</h1>

					<form className="checkout-layout" onSubmit={handleSubmit}>
						{/* ── Billing form ── */}
						<div>
							{/* Contact */}
							<div
								className="checkout-form-card"
								style={{ marginBottom: "1.4rem" }}
							>
								<h2>Contact &amp; Billing</h2>
								<div className="field-row">
									<div className="field">
										<label htmlFor="firstName">First name *</label>
										<input
											id="firstName"
											name="firstName"
											type="text"
											value={form.firstName}
											onChange={handleChange}
											required
											autoComplete="given-name"
										/>
									</div>
									<div className="field">
										<label htmlFor="lastName">Last name *</label>
										<input
											id="lastName"
											name="lastName"
											type="text"
											value={form.lastName}
											onChange={handleChange}
											required
											autoComplete="family-name"
										/>
									</div>
								</div>
								<div className="field-row">
									<div className="field">
										<label htmlFor="email">Email *</label>
										<input
											id="email"
											name="email"
											type="email"
											value={form.email}
											onChange={handleChange}
											required
											autoComplete="email"
										/>
									</div>
									<div className="field">
										<label htmlFor="phone">Phone / WhatsApp *</label>
										<input
											id="phone"
											name="phone"
											type="tel"
											value={form.phone}
											onChange={handleChange}
											required
											autoComplete="tel"
											placeholder="+234"
										/>
									</div>
								</div>
							</div>

							{/* Delivery */}
							<div
								className="checkout-form-card"
								style={{ marginBottom: "1.4rem" }}
							>
								<h2>Delivery Method</h2>
								<div className="delivery-options">
									{(["pickup", "dispatch", "dhl"] as const).map((method) => (
										<label className="delivery-option" key={method}>
											<input
												type="radio"
												name="delivery"
												value={method}
												checked={form.delivery === method}
												onChange={handleChange}
											/>
											<div>
												<span className="delivery-option-label">
													{method === "pickup" && "Self Pick-up"}
													{method === "dispatch" && "Your Dispatch Rider"}
													{method === "dhl" && "Vedil Ships (DHL + others)"}
												</span>
												<span className="delivery-option-desc">
													{method === "pickup" &&
														"No. 95 Ago Palace Way, Okota, Lagos · Free"}
													{method === "dispatch" &&
														"Send your rider to our store · ₦3,500"}
													{method === "dhl" &&
														"We book delivery to your door · ₦7,500"}
												</span>
											</div>
										</label>
									))}
								</div>

								{form.delivery !== "pickup" && (
									<>
										<div className="field">
											<label htmlFor="address">Street address *</label>
											<input
												id="address"
												name="address"
												type="text"
												value={form.address}
												onChange={handleChange}
												required
												autoComplete="street-address"
											/>
										</div>
										<div className="field-row">
											<div className="field">
												<label htmlFor="city">City *</label>
												<input
													id="city"
													name="city"
													type="text"
													value={form.city}
													onChange={handleChange}
													required
													autoComplete="address-level2"
												/>
											</div>
											<div className="field">
												<label htmlFor="state">State *</label>
												<Combobox
													id="state"
													options={NIGERIA_STATES}
													placeholder="Select state…"
													searchPlaceholder="Search states…"
													value={form.state}
													onValueChange={(v) =>
														setForm((prev) => ({ ...prev, state: v }))
													}
												/>
											</div>
										</div>
									</>
								)}
							</div>

							{/* Order note */}
							<div className="checkout-form-card">
								<h2>
									Order Notes{" "}
									<span
										style={{
											fontWeight: 400,
											fontSize: ".85rem",
											color: "var(--ink-soft)",
										}}
									>
										(optional)
									</span>
								</h2>
								<div className="field" style={{ marginBottom: 0 }}>
									<textarea
										id="note"
										name="note"
										value={form.note}
										onChange={handleChange}
										rows={3}
										placeholder="Size preferences, special requests, colour substitutions…"
									/>
								</div>
							</div>
						</div>

						{/* ── Order summary ── */}
						<div>
							<div className="order-summary">
								<h3>Your Order</h3>

								{items.map((item) => {
									const price = effectivePrice(item);
									const isWholesale =
										item.wholesalePrice !== null && item.quantity >= item.moq;
									return (
										<div className="summary-row" key={item.id}>
											<span>
												{item.name}
												{item.size ? ` (${item.size})` : ""} ×{item.quantity}
												{isWholesale && " · WS"}
											</span>
											<strong>{fmtPrice(price * item.quantity)}</strong>
										</div>
									);
								})}

								<div className="summary-row">
									<span>Delivery</span>
									<strong>
										{deliveryFee === 0 ? "Free" : fmtPrice(deliveryFee)}
									</strong>
								</div>

								<div className="summary-row total">
									<span>Total</span>
									<strong>{fmtPrice(total)}</strong>
								</div>

								<button
									type="submit"
									className="btn"
									style={{
										display: "flex",
										width: "100%",
										marginTop: "1.4rem",
										justifyContent: "center",
									}}
									disabled={loading}
								>
									{loading ? "Processing…" : `Pay ${fmtPrice(total)}`}
									{!loading && (
										<ArrowRight className="arw" size={16} strokeWidth={2} />
									)}
								</button>

								<p
									style={{
										fontSize: ".75rem",
										color: "var(--ink-soft)",
										textAlign: "center",
										marginTop: ".7rem",
									}}
								>
									Secured by Paystack · SSL encrypted
								</p>
							</div>

							<p
								style={{
									fontSize: ".82rem",
									color: "var(--ink-soft)",
									textAlign: "center",
									marginTop: "1rem",
								}}
							>
								Questions?{" "}
								<a
									href="https://wa.me/2348138683171"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "var(--burgundy)" }}
								>
									Chat on WhatsApp
								</a>
							</p>
						</div>
					</form>
				</div>
			</main>
		</>
	);
}
