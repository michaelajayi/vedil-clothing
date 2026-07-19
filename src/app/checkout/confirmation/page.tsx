"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
	Check,
	Loader,
	ArrowRight,
	Truck,
	MapPin,
	HelpCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import { orderOptions } from "@/lib/queries/checkout";
import { useCart } from "@/contexts/CartContext";
import { fmtPrice } from "@/lib/products";
import type { CheckoutStatusResponse } from "@/types/api";

// ─── Inner component ─────────────────────────────────────

function ConfirmationContent() {
	const searchParams = useSearchParams();
	const [orderRef, setOrderRef] = useState<string | null>(null);
	const [status, setStatus] = useState<
		"loading" | "paid" | "failed" | "not-found"
	>("loading");
	const { resetCart } = useCart();
	const cartResetDone = useRef(false);

	// ── Resolve orderReference ────────────────────────────────
	useEffect(() => {
		const fromSession = sessionStorage.getItem("vedil_last_order_ref");
		const fromUrl = searchParams.get("reference");
		const ref = fromSession ?? fromUrl;
		if (ref) {
			setOrderRef(ref);
			sessionStorage.removeItem("vedil_last_order_ref");
		} else {
			setStatus("not-found");
		}
	}, [searchParams]);

	// ── Poll payment status ──────────────────────────────────
	const {
		data: statusData,
		isError,
		error,
	} = useQuery({
		queryKey: ["checkout", "status", orderRef],
		queryFn: () =>
			api.get<CheckoutStatusResponse>(`/api/checkout/status/${orderRef}`),
		enabled: !!orderRef,
		// No retries — 404 is definitive (wrong reference), and the
		// refetchInterval below handles polling for pending payments.
		retry: false,
		refetchInterval: (query) => {
			if (query.state.error) return false;
			const d = query.state.data;
			if (d?.status === "PAID" || d?.status === "FAILED") return false;
			return 3_000;
		},
		staleTime: 0,
	});

	// ── Fetch full order details (once paid) ─────────────────
	const { data: order } = useQuery({
		...orderOptions(orderRef ?? ""),
		enabled: statusData?.status === "PAID" && !!orderRef,
	});

	// ── Resolve status ───────────────────────────────────────
	useEffect(() => {
		if (isError) {
			// 404 from backend = order not found, show helpful "not-found" state
			if (error instanceof ApiError && error.status === 404) {
				setStatus("not-found");
			} else {
				setStatus("failed");
			}
			return;
		}
		if (!statusData) return;
		if (statusData.status === "PAID") setStatus("paid");
		if (statusData.status === "FAILED" || statusData.status === "CANCELED") {
			setStatus("failed");
		}
	}, [statusData, isError, error]);

	// ── Reset cart on successful payment ────────────────────
	useEffect(() => {
		if (status === "paid" && !cartResetDone.current) {
			cartResetDone.current = true;
			resetCart();
		}
	}, [status, resetCart]);

	// ── Detect item kinds ────────────────────────────────────
	const hasCourse = order?.items.some(
		(i) => i.productKindSnapshot === "COURSE",
	);
	const hasPhysical = order?.items.some(
		(i) => i.productKindSnapshot === "PHYSICAL",
	);

	// ── Format delivery info ─────────────────────────────────
	const deliveryInfo = (() => {
		if (!order) return null;
		// Course-only orders don't have shipping — show course details instead
		if (hasCourse && !hasPhysical) return null;
		const addr = order.shippingAddress;
		if (!addr)
			return {
				method: "Self Pick-up",
				detail: "No. 95 Ago Palace Way, Okota, Lagos",
			};
		const parts = [addr.street, addr.city, addr.state].filter(Boolean);
		return { method: "Delivery", detail: parts.join(", ") };
	})();

	// ── What happens next ────────────────────────────────────
	const nextSteps = (() => {
		if (!order) return [];
		const steps: string[] = [];
		if (hasPhysical) {
			steps.push(
				deliveryInfo?.method === "Self Pick-up"
					? "Someone from our team will reach out to you about your order."
					: "We'll prepare your order for dispatch or shipping.",
			);
		}
		if (hasCourse) {
			steps.push(
				"Someone from our team will reach out to you with your course access details.",
			);
		}
		steps.push("A payment receipt has been sent to your email.");
		return steps;
	})();

	// ── Not found ───────────────────────────────────────────
	if (status === "not-found") {
		return (
			<main style={{ paddingBlock: "clamp(4rem,10vw,8rem)" }}>
				<div className="wrap" style={{ maxWidth: 520, textAlign: "center" }}>
					<div
						className="confirm-icon"
						style={{ color: "var(--ink-soft)", margin: "0 auto 1.2rem" }}
					>
						<HelpCircle size={36} strokeWidth={1.5} />
					</div>
					<h1
						style={{
							fontSize: "clamp(1.8rem,4vw,2.4rem)",
							marginBottom: ".8rem",
							fontFamily: "var(--font-display)",
						}}
					>
						No order reference found
					</h1>
					<p style={{ color: "var(--ink-soft)", marginBottom: ".6rem" }}>
						We couldn&apos;t locate your order. If you have a payment receipt
						from Paystack, your order is being processed and we&apos;ll follow
						up shortly.
					</p>
					<p style={{ color: "var(--ink-soft)", marginBottom: "2.4rem" }}>
						Need help? Chat with us on WhatsApp.
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
						</a>
					</div>
				</div>
			</main>
		);
	}

	// ── Verifying payment ──────────────────────────────────
	if (status === "loading") {
		return (
			<main style={{ paddingBlock: "clamp(4rem,10vw,8rem)" }}>
				<div className="wrap" style={{ maxWidth: 480, textAlign: "center" }}>
					<div
						className="confirm-icon"
						style={{ color: "var(--burgundy)", margin: "0 auto 1.2rem" }}
					>
						<Loader size={32} strokeWidth={2} className="confirm-spin" />
					</div>
					<h1
						style={{
							fontSize: "clamp(1.5rem,3.5vw,2rem)",
							marginBottom: ".8rem",
							fontFamily: "var(--font-display)",
						}}
					>
						Verifying payment…
					</h1>
					<p style={{ color: "var(--ink-soft)", lineHeight: 1.6 }}>
						Please wait while we confirm your transaction with Paystack.
					</p>
					{orderRef && (
						<p
							style={{
								fontSize: ".82rem",
								color: "var(--ink-soft)",
								marginTop: ".8rem",
							}}
						>
							Reference: <strong>{orderRef}</strong>
						</p>
					)}
				</div>
			</main>
		);
	}

	// ── Paid ✅ ─────────────────────────────────────────────
	if (status === "paid") {
		return (
			<main style={{ paddingBlock: "clamp(4rem,10vw,8rem)" }}>
				<div className="wrap" style={{ maxWidth: 580 }}>
					{/* ── Header ─────────────────────────────────── */}
					<div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
						<div
							className="confirm-icon"
							style={{
								color: "var(--gold)",
								margin: "0 auto 1.2rem",
							}}
						>
							<Check size={40} strokeWidth={2} />
						</div>
						<h1
							style={{
								fontSize: "clamp(2rem,4vw,2.8rem)",
								marginBottom: ".4rem",
								fontFamily: "var(--font-display)",
							}}
						>
							Payment Successful
						</h1>
						<p style={{ color: "var(--ink-soft)", fontSize: ".95rem" }}>
							Thank you
							{order?.customerEmail ? `, ${order.customerEmail}` : ""}
						</p>
					</div>

					{/* ── Order reference card ──────────────────── */}
					{orderRef && (
						<div className="confirm-card" style={{ marginBottom: "1rem" }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "baseline",
								}}
							>
								<span style={{ fontSize: ".82rem", color: "var(--ink-soft)" }}>
									Order reference
								</span>
								<strong
									style={{
										fontFamily: "var(--font-display)",
										letterSpacing: ".02em",
										wordBreak: "break-all",
										overflowWrap: "break-word",
										maxWidth: "60%",
										textAlign: "right",
									}}
								>
									{orderRef}
								</strong>
							</div>
							{statusData && (
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "baseline",
										marginTop: ".6rem",
									}}
								>
									<span
										style={{ fontSize: ".82rem", color: "var(--ink-soft)" }}
									>
										Total paid
									</span>
									<strong style={{ fontSize: "1.2rem" }}>
										{fmtPrice((statusData.totalAmount ?? 0) / 100)}
									</strong>
								</div>
							)}
						</div>
					)}

					{/* ── Order items ─────────────────────────── */}
					{order && order.items.length > 0 && (
						<div className="confirm-card" style={{ marginBottom: "1rem" }}>
							<h3
								style={{
									fontFamily: "var(--font-display)",
									fontSize: "1rem",
									marginBottom: ".8rem",
								}}
							>
								Items ordered
							</h3>
							{order.items.map((item) => (
								<div
									key={item.id}
									style={{
										display: "flex",
										justifyContent: "space-between",
										padding: ".4rem 0",
										borderBottom: "1px solid var(--line)",
									}}
								>
									<div>
										<p style={{ fontSize: ".9rem" }}>
											{item.productNameSnapshot}
										</p>
										<p
											style={{
												fontSize: ".78rem",
												color: "var(--ink-soft)",
											}}
										>
											{item.productKindSnapshot === "COURSE"
												? "Course"
												: "Physical"}{" "}
											· Qty {item.quantity}
										</p>
									</div>
									<strong
										style={{
											fontSize: ".9rem",
											whiteSpace: "nowrap",
										}}
									>
										{fmtPrice(item.lineAmountSnapshot / 100)}
									</strong>
								</div>
							))}
						</div>
					)}

					{/* ── Delivery info ───────────────────────── */}
					{deliveryInfo && (
						<div className="confirm-card" style={{ marginBottom: "1rem" }}>
							<div
								style={{
									display: "flex",
									gap: ".8rem",
									alignItems: "flex-start",
								}}
							>
								{deliveryInfo.method === "Self Pick-up" ? (
									<MapPin
										size={20}
										strokeWidth={1.5}
										style={{
											color: "var(--burgundy)",
											flexShrink: 0,
											marginTop: 2,
										}}
									/>
								) : (
									<Truck
										size={20}
										strokeWidth={1.5}
										style={{
											color: "var(--burgundy)",
											flexShrink: 0,
											marginTop: 2,
										}}
									/>
								)}
								<div>
									<p
										style={{
											fontWeight: 600,
											fontSize: ".9rem",
											marginBottom: ".2rem",
										}}
									>
										{deliveryInfo.method}
									</p>
									<p style={{ fontSize: ".82rem", color: "var(--ink-soft)" }}>
										{deliveryInfo.detail}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* ── What happens next ───────────────────── */}
					{nextSteps.length > 0 && (
						<div className="confirm-card" style={{ marginBottom: "2rem" }}>
							<h3
								style={{
									fontFamily: "var(--font-display)",
									fontSize: "1rem",
									marginBottom: ".8rem",
								}}
							>
								What happens next
							</h3>
							<ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
								{nextSteps.map((step, i) => (
									<li
										key={i}
										style={{
											display: "flex",
											gap: ".6rem",
											alignItems: "flex-start",
											padding: ".3rem 0",
											fontSize: ".88rem",
											color: "var(--ink-soft)",
										}}
									>
										<span style={{ color: "var(--gold)", flexShrink: 0 }}>
											✓
										</span>
										{step}
									</li>
								))}
							</ul>
						</div>
					)}

					{/* ── CTAs ────────────────────────────────── */}
					<div
						style={{
							display: "flex",
							gap: "1rem",
							justifyContent: "center",
							flexWrap: "wrap",
						}}
					>
						<Link
							href={hasCourse && !hasPhysical ? "/fun-to-sew" : "/shop"}
							className="btn"
						>
							{hasCourse && !hasPhysical
								? "Browse More Courses"
								: "Continue Shopping"}
							<ArrowRight className="arw" size={16} strokeWidth={2} />
						</Link>
						<a
							href="https://wa.me/2348138683171"
							target="_blank"
							rel="noopener noreferrer"
							className="btn btn--ghost"
						>
							Chat on WhatsApp
						</a>
					</div>
				</div>
			</main>
		);
	}

	// ── Failed / Canceled ─────────────────────────────────
	return (
		<main style={{ paddingBlock: "clamp(4rem,10vw,8rem)" }}>
			<div className="wrap" style={{ maxWidth: 520, textAlign: "center" }}>
				<div
					className="confirm-icon"
					style={{ color: "var(--burgundy)", margin: "0 auto 1.2rem" }}
				>
					<Check
						size={36}
						strokeWidth={1.5}
						style={{ transform: "rotate(45deg)" }}
					/>
				</div>
				<h1
					style={{
						fontSize: "clamp(1.8rem,4vw,2.4rem)",
						marginBottom: ".8rem",
						fontFamily: "var(--font-display)",
					}}
				>
					Payment {statusData?.status === "CANCELED" ? "Canceled" : "Failed"}
				</h1>
				<p style={{ color: "var(--ink-soft)", marginBottom: ".6rem" }}>
					{statusData?.status === "CANCELED"
						? "You closed the payment window before completing the transaction."
						: "The payment could not be processed."}
				</p>
				{orderRef && (
					<p
						style={{
							fontSize: ".82rem",
							color: "var(--ink-soft)",
							marginBottom: "2.4rem",
						}}
					>
						Reference: <strong>{orderRef}</strong>
					</p>
				)}
				<div
					style={{
						display: "flex",
						gap: "1rem",
						justifyContent: "center",
						flexWrap: "wrap",
					}}
				>
					<Link href="/checkout" className="btn">
						Try Again
					</Link>
					<a
						href="https://wa.me/2348138683171"
						target="_blank"
						rel="noopener noreferrer"
						className="btn btn--ghost"
					>
						Contact Us on WhatsApp
					</a>
				</div>
			</div>
		</main>
	);
}

// ─── Page wrapper ────────────────────────────────────────

export default function CheckoutConfirmationPage() {
	return (
		<Suspense
			fallback={
				<main style={{ paddingBlock: "clamp(4rem,10vw,8rem)" }}>
					<div className="wrap" style={{ maxWidth: 480, textAlign: "center" }}>
						<div
							className="confirm-icon"
							style={{ color: "var(--burgundy)", margin: "0 auto 1.2rem" }}
						>
							<Loader size={32} strokeWidth={2} className="confirm-spin" />
						</div>
						<p style={{ color: "var(--ink-soft)" }}>Loading payment details…</p>
					</div>
				</main>
			}
		>
			<ConfirmationContent />
		</Suspense>
	);
}
