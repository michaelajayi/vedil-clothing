"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CallbackRedirect() {
	const searchParams = useSearchParams();

	useEffect(() => {
		const params = searchParams.toString();
		const dest = params
			? `/checkout/confirmation?${params}`
			: "/checkout/confirmation";
		window.location.replace(dest);
	}, [searchParams]);

	return null;
}

/**
 * Redirect old /checkout/callback → /checkout/confirmation
 * preserving query params so Paystack's callback still works.
 */
export default function CheckoutCallbackPage() {
	return (
		<Suspense fallback={null}>
			<CallbackRedirect />
		</Suspense>
	);
}
