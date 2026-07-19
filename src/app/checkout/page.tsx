"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCart, effectivePrice, fmtPrice } from "@/contexts/CartContext";
import {
	useInitiateCheckout,
	useSendOtp,
	useVerifyOtp,
} from "@/lib/queries/checkout";
import { getCartSessionId } from "@/lib/cart-session";
import { ApiError } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import PhoneInput from "@/components/ui/PhoneInput";

type FormData = {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	delivery: "pickup" | "dispatch";
	note: string;
};

export default function CheckoutPage() {
	const { items, subtotal } = useCart();
	const { toast } = useToast();
	const [form, setForm] = useState<FormData>({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		delivery: "pickup",
		note: "",
	});
	const [loading, setLoading] = useState(false);

	// ─── OTP / Verification states ───────────────────────────
	const requiresOtp = useMemo(
		() => items.some((item) => item.kind === "COURSE"),
		[items],
	);
	const [otpSent, setOtpSent] = useState(false);
	const [otpCode, setOtpCode] = useState("");
	const [isEmailVerified, setIsEmailVerified] = useState(false);
	const [emailVerificationToken, setEmailVerificationToken] = useState<
		string | null
	>(null);
	const [otpError, setOtpError] = useState<string | null>(null);
	const [cooldown, setCooldown] = useState(0);

	const sendOtp = useSendOtp();
	const verifyOtp = useVerifyOtp();

	// Resend cooldown timer
	useEffect(() => {
		if (cooldown <= 0) return;
		const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
		return () => clearTimeout(timer);
	}, [cooldown]);

	// Invalidate verification if the email field is edited
	useEffect(() => {
		setIsEmailVerified(false);
		setEmailVerificationToken(null);
		setOtpSent(false);
		setOtpCode("");
		setOtpError(null);
	}, [form.email]);

	async function handleSendOtp() {
		setOtpError(null);
		if (!form.email || !form.email.includes("@")) {
			setOtpError("Please enter a valid email address.");
			return;
		}

		try {
			await sendOtp.mutateAsync({ email: form.email });
			setOtpSent(true);
			setCooldown(60);
		} catch (err: unknown) {
			const msg =
				err instanceof Error
					? err.message
					: "Failed to send verification code.";
			setOtpError(msg);
		}
	}

	async function handleVerifyOtp() {
		setOtpError(null);
		if (otpCode.length !== 6) {
			setOtpError("Please enter a 6-digit code.");
			return;
		}

		try {
			const res = await verifyOtp.mutateAsync({
				email: form.email,
				otp: otpCode,
			});
			if (res.verificationToken) {
				setEmailVerificationToken(res.verificationToken);
				setIsEmailVerified(true);
				setOtpError(null);
			} else {
				setOtpError("Invalid response from server.");
			}
		} catch (err: unknown) {
			const msg =
				err instanceof Error ? err.message : "Incorrect verification code.";
			setOtpError(msg);
		}
	}

	// ── Both delivery methods are free for now ────────────────
	const deliveryFees: Record<string, number> = {
		pickup: 0,
		dispatch: 0,
	};

	const deliveryFee = deliveryFees[form.delivery];
	const total = subtotal + deliveryFee;

	// ─── Checkout mutation ─────────────────────────────────
	const initiateCheckout = useInitiateCheckout();

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (requiresOtp && !isEmailVerified) {
			toast("Email verification required", {
				description: "Please verify your email address before proceeding.",
				variant: "error",
			});
			const emailEl = document.getElementById("email");
			if (emailEl) {
				emailEl.scrollIntoView({ behavior: "smooth", block: "center" });
				emailEl.focus();
			}
			return;
		}

		setLoading(true);

		try {
			const sessionId = getCartSessionId();
			if (!sessionId) {
				throw new Error("Could not initialise checkout session.");
			}

			const result = await initiateCheckout.mutateAsync({
				cartSessionId: sessionId,
				customerEmail: form.email,
				customerPhone: form.phone || undefined,
				deliveryFeeAmount: deliveryFee * 100, // naira → kobo
				emailVerificationToken: emailVerificationToken || undefined,
			});

			// Store order reference so the callback page can find it
			sessionStorage.setItem("vedil_last_order_ref", result.orderReference);

			// Redirect to Paystack hosted checkout
			window.location.href = result.authorizationUrl;
		} catch (err: unknown) {
			setLoading(false);
			const message =
				err instanceof ApiError
					? err.readableMessage()
					: err instanceof Error
						? err.message
						: "Something went wrong. Please try again.";
			toast("Checkout failed", { description: message, variant: "error" });
		}
	}

	// ─── Empty cart ───────────────────────────────────────────
	if (items.length === 0) {
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

	// ─── Checkout form ─────────────────────────────────────────
	return (
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
									{requiresOtp && isEmailVerified && (
										<div
											style={{
												color: "green",
												fontSize: ".82rem",
												marginTop: ".45rem",
												fontWeight: 600,
											}}
										>
											✓ Email verified
										</div>
									)}
								</div>
								<div className="field">
									<label htmlFor="phone">Phone / WhatsApp *</label>
									<PhoneInput
										id="phone"
										value={form.phone}
										onChange={(v) => setForm((prev) => ({ ...prev, phone: v }))}
										autoComplete="tel"
									/>
								</div>

								{/* OTP Verification Box */}
								{requiresOtp && !isEmailVerified && (
									<div
										className="otp-verification-section"
										style={{
											gridColumn: "span 2",
											marginTop: "-0.4rem",
											marginBottom: "0.8rem",
											padding: "1.2rem",
											background: "rgba(176,122,60,.06)",
											borderRadius: "8px",
											border: "1px solid rgba(176,122,60,.18)",
										}}
									>
										{!otpSent ? (
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: ".5rem",
												}}
											>
												<p
													style={{
														fontSize: ".82rem",
														color: "var(--ink-soft)",
														margin: 0,
													}}
												>
													Email verification is required to enroll in courses.
												</p>
												<button
													type="button"
													onClick={handleSendOtp}
													className="btn btn--ghost"
													style={{
														alignSelf: "flex-start",
														padding: ".4rem .8rem",
														fontSize: ".82rem",
														minHeight: "auto",
													}}
													disabled={
														sendOtp.isPending ||
														!form.email ||
														!form.email.includes("@")
													}
												>
													{sendOtp.isPending
														? "Sending code..."
														: "Send Verification Code"}
												</button>
											</div>
										) : (
											<div
												style={{
													display: "flex",
													flexDirection: "column",
													gap: ".6rem",
												}}
											>
												<p
													style={{
														fontSize: ".82rem",
														color: "var(--ink-soft)",
														margin: 0,
													}}
												>
													We sent a 6-digit verification code to{" "}
													<strong>{form.email}</strong>. Enter it below:
												</p>
												<div
													style={{
														display: "flex",
														gap: ".5rem",
														alignItems: "center",
														flexWrap: "wrap",
													}}
												>
													<input
														type="text"
														inputMode="numeric"
														pattern="[0-9]*"
														maxLength={6}
														placeholder="000000"
														value={otpCode}
														onChange={(e) =>
															setOtpCode(e.target.value.replace(/\D/g, ""))
														}
														style={{
															width: "120px",
															textAlign: "center",
															letterSpacing: ".15em",
															fontSize: "1.1rem",
															height: "2.4rem",
															border: "1px solid var(--line)",
															borderRadius: "4px",
															background: "var(--cream)",
														}}
													/>
													<button
														type="button"
														onClick={handleVerifyOtp}
														className="btn"
														style={{
															padding: ".4rem .8rem",
															fontSize: ".82rem",
															minHeight: "auto",
														}}
														disabled={
															verifyOtp.isPending || otpCode.length !== 6
														}
													>
														{verifyOtp.isPending
															? "Verifying..."
															: "Verify Code"}
													</button>
													<button
														type="button"
														onClick={handleSendOtp}
														className="btn btn--ghost"
														style={{
															padding: ".4rem .8rem",
															fontSize: ".82rem",
															minHeight: "auto",
														}}
														disabled={cooldown > 0 || sendOtp.isPending}
													>
														{cooldown > 0
															? `Resend (${cooldown}s)`
															: "Resend Code"}
													</button>
												</div>
											</div>
										)}
										{otpError && (
											<p className="field-error" style={{ marginTop: ".4rem" }}>
												{otpError}
											</p>
										)}
									</div>
								)}
							</div>
						</div>

						{/* Delivery */}
						<div
							className="checkout-form-card"
							style={{ marginBottom: "1.4rem" }}
						>
							<h2>Delivery Method</h2>
							<div className="delivery-options">
								{(["pickup", "dispatch"] as const).map((method) => {
									return (
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
												</span>
												<span className="delivery-option-desc">
													{method === "pickup" &&
														"No. 95 Ago Palace Way, Okota, Lagos"}
													{method === "dispatch" &&
														"Send your rider to pick up from our store"}
												</span>
											</div>
										</label>
									);
								})}
							</div>
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
								<strong>Free</strong>
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
								{loading
									? "Redirecting to Paystack…"
									: `Pay ${fmtPrice(total)}`}
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
	);
}
