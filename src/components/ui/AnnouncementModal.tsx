"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { X } from "lucide-react";
import { api } from "@/lib/api";

// ─── Types matching backend PopupDto ────────────────────
// NOTE: `newTag` / `date` / `priority` were removed from the backend
// contract — do not reintroduce them.

interface PopupDto {
	id: string;
	title: string;
	body: string;
	imageUrl: string | null;
	imageAlt: string | null;
	ctaText: string | null;
	ctaLnk: string | null;
	activeFrom: string;
	activeUntil: string;
	updatedAt: string;
}

interface ActivePopupResponseDto {
	popup: PopupDto | null;
}

// ─── Dismissal store (localStorage) ─────────────────────
// Source of truth for "has this visitor seen this popup?". The backend's
// `dismissedIds` query param is intentionally NOT sent: with single-active
// enforcement the backend would skip the only live popup, which would hide
// version-stale dismissals (admin edits) — breaking the "edited popup shows
// again" rule. So the client gates entirely against the fetched popup:
//
//   dismissed ⇔ store[id] exists
//     && dismissedUntil  > now          (window hasn't ended — else expired)
//     && versionAt       === updatedAt  (content unchanged since dismissal)

const DISMISSED_STORAGE_KEY = "announcement-dismissed";

type Dismissal = {
	dismissedUntil: string; // ISO 8601 — expires when the popup's window ends
	versionAt: string; // ISO 8601 — the popup's updatedAt at dismissal time
};

type DismissalStore = Record<string, Dismissal>;

/** Read + prune by expiry only. Entries from the legacy format (no
 *  `versionAt`) are treated as stale and removed — those visitors see the
 *  popup once after this deploy, which is acceptable and self-healing. */
function readDismissalStore(): DismissalStore {
	if (typeof window === "undefined") return {};
	try {
		const raw = localStorage.getItem(DISMISSED_STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw) as DismissalStore;
		const now = Date.now();
		const valid: DismissalStore = {};
		for (const [id, d] of Object.entries(parsed)) {
			if (!d || typeof d !== "object") continue;
			if (typeof d.versionAt !== "string") continue; // legacy entry
			if (new Date(d.dismissedUntil).getTime() > now) valid[id] = d;
		}
		if (Object.keys(valid).length !== Object.keys(parsed).length) {
			writeDismissalStore(valid);
		}
		return valid;
	} catch {
		return {};
	}
}

function writeDismissalStore(store: DismissalStore): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(DISMISSED_STORAGE_KEY, JSON.stringify(store));
	} catch {
		// Storage unavailable (private mode / quota) — dismissal won't
		// persist. The popup may show again next load; acceptable.
	}
}

/** True when the popup is currently dismissed. Also prunes the store when
 *  the dismissal is stale (window ended or content changed since dismissal). */
function isDismissed(id: string, updatedAt: string): boolean {
	const store = readDismissalStore();
	const entry = store[id];
	if (!entry) return false;
	if (entry.versionAt !== updatedAt) {
		// Admin edited the popup — the announcement is "new"; give it a
		// fresh chance. Prune and treat as not dismissed.
		delete store[id];
		writeDismissalStore(store);
		return false;
	}
	return true;
}

function recordDismissal(popup: PopupDto): void {
	const store = readDismissalStore();
	store[popup.id] = {
		dismissedUntil: popup.activeUntil,
		versionAt: popup.updatedAt,
	};
	writeDismissalStore(store);
}

// ─── CTA URL handling ───────────────────────────────────
// Defense-in-depth: even though the backend validates links, the storefront
// must never render a `javascript:` / `data:` / etc. href.

const EXTERNAL_URL_RE = /^(https?:)?\/\//i;
const MAILTO_TEL_RE = /^(mailto:|tel:)/i;

function isSafeCtaUrl(value: string): boolean {
	const v = value.trim();
	if (v === "" || v === "#" || v.startsWith("/")) return true;
	if (MAILTO_TEL_RE.test(v)) return true;
	try {
		const protocol = new URL(v, window.location.origin).protocol;
		return protocol === "http:" || protocol === "https:";
	} catch {
		return false;
	}
}

function isExternalCtaUrl(value: string): boolean {
	const v = value.trim();
	if (EXTERNAL_URL_RE.test(v)) return true; // incl. protocol-relative //host
	if (MAILTO_TEL_RE.test(v)) return false; // mailto/tel act in-tab
	try {
		return new URL(v, window.location.origin).origin !== window.location.origin;
	} catch {
		return false;
	}
}

// ─── Component ──────────────────────────────────────────

const DISPLAY_DELAY_MS = 2000; // ~2s after the popup is ready

export function AnnouncementModal() {
	const [popup, setPopup] = useState<PopupDto | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [imageError, setImageError] = useState(false);

	// Mirrors `popup` so event handlers / timers never read stale closures.
	const popupRef = useRef<PopupDto | null>(null);
	const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const hasLoadedRef = useRef(false);

	// ─── Fetch ───────────────────────────────────────────
	// Returns `undefined` on network/parse errors so callers can leave the
	// current state untouched (silent failure per spec §9); `null` means the
	// backend says no popup is live.
	const fetchActivePopup = useCallback(async (): Promise<
		PopupDto | null | undefined
	> => {
		try {
			const res = await api.get<ActivePopupResponseDto>("/api/popups/active", {
				cache: "no-store",
			});
			return res.popup ?? null;
		} catch {
			return undefined;
		}
	}, []);

	// ─── Show / close ────────────────────────────────────
	const scheduleShow = useCallback((p: PopupDto) => {
		if (showTimerRef.current) clearTimeout(showTimerRef.current);
		showTimerRef.current = setTimeout(() => {
			showTimerRef.current = null;
			// Re-check at fire time: the popup may have been superseded or
			// dismissed (e.g. another tab) during the delay.
			if (popupRef.current?.id !== p.id) return;
			if (isDismissed(p.id, p.updatedAt)) return;
			setIsOpen(true);
		}, DISPLAY_DELAY_MS);
	}, []);

	const closeAndRecord = useCallback((p: PopupDto) => {
		recordDismissal(p);
		popupRef.current = null;
		setPopup(null);
		setIsOpen(false);
	}, []);

	/** Apply a fetch result to the dialog. */
	const applyPopupResult = useCallback(
		(next: PopupDto | null) => {
			const current = popupRef.current;

			if (next === null) {
				// The displayed popup is gone (window ended / paused / deleted) —
				// close it ("close on gone").
				if (current) closeAndRecord(current);
				return;
			}

			if (current && current.id === next.id) {
				// Same popup, possibly edited — hold the open dialog untouched
				// ("hold on edit"). Content never mutates under the user.
				return;
			}

			if (current) {
				// A different popup replaced this one (replaceActive) — close
				// the current one before showing the new one.
				closeAndRecord(current);
			}

			if (isDismissed(next.id, next.updatedAt)) {
				// Still a valid dismissal (window live + version unchanged).
				return;
			}

			popupRef.current = next;
			setPopup(next);
			setImageError(false);
			scheduleShow(next);
		},
		[closeAndRecord, scheduleShow],
	);

	const applyResult = useCallback(
		(next: PopupDto | null | undefined) => {
			if (next === undefined) return; // network error — stay put
			applyPopupResult(next);
		},
		[applyPopupResult],
	);

	// ─── Initial load ────────────────────────────────────
	useEffect(() => {
		let cancelled = false;
		(async () => {
			const next = await fetchActivePopup();
			if (cancelled) return;
			hasLoadedRef.current = true;
			applyResult(next);
		})();
		return () => {
			cancelled = true;
		};
	}, [fetchActivePopup, applyResult]);

	// ─── Re-fetch on tab focus / visibility ──────────────
	// Catches a popup that activates mid-session and clears one that expired
	// while the visitor was away. No polling.
	useEffect(() => {
		const refetch = () => {
			if (!hasLoadedRef.current) return;
			fetchActivePopup().then((next) => {
				if (next !== undefined) applyPopupResult(next);
			});
		};
		const onVisibility = () => {
			if (document.visibilityState === "visible") refetch();
		};
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("focus", onVisibility);
		return () => {
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("focus", onVisibility);
		};
	}, [fetchActivePopup, applyPopupResult]);

	// ─── Cross-tab consistency ───────────────────────────
	// Dismissing in one tab closes the popup in every other open tab.
	useEffect(() => {
		const handler = (e: StorageEvent) => {
			if (e.key !== DISMISSED_STORAGE_KEY) return;
			const current = popupRef.current;
			if (current && isDismissed(current.id, current.updatedAt)) {
				popupRef.current = null;
				setPopup(null);
				setIsOpen(false);
			}
		};
		window.addEventListener("storage", handler);
		return () => window.removeEventListener("storage", handler);
	}, []);

	// ─── Cleanup ─────────────────────────────────────────
	useEffect(
		() => () => {
			if (showTimerRef.current) clearTimeout(showTimerRef.current);
		},
		[],
	);

	// Every close path (✕, ESC, overlay, CTA) funnels through here and
	// records the dismissal — no nagging.
	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				const current = popupRef.current;
				if (current) closeAndRecord(current);
				setIsOpen(false);
			}
		},
		[closeAndRecord],
	);

	const handleCtaClick = useCallback(() => {
		const current = popupRef.current;
		if (current) closeAndRecord(current);
	}, [closeAndRecord]);

	if (!popup) return null;

	const paragraphs = popup.body
		.split(/\n{2,}/)
		.map((p) => p.trim())
		.filter(Boolean);

	const ctaLink = popup.ctaLnk?.trim() ?? "";
	const showCtaAsLink =
		ctaLink !== "" && ctaLink !== "#" && isSafeCtaUrl(ctaLink);
	const ctaExternal = showCtaAsLink && isExternalCtaUrl(ctaLink);

	return (
		<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="announcement-overlay" />
				<Dialog.Content className="announcement-content">
					<Dialog.Close asChild>
						<button className="announcement-close-button" aria-label="Close">
							<X size={20} />
						</button>
					</Dialog.Close>

					{popup.imageUrl && !imageError && (
						<div className="announcement-image-wrap">
							<Image
								src={popup.imageUrl}
								alt={popup.imageAlt || ""}
								fill
								sizes="(max-width: 540px) calc(100vw - 1.5rem), 440px"
								className="announcement-image"
								loading="lazy"
								priority={false}
								onError={() => setImageError(true)}
							/>
						</div>
					)}

					<Dialog.Title className="announcement-headline">
						{popup.title}
					</Dialog.Title>

					<div className="announcement-body">
						{paragraphs.map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>

					{popup.ctaText && (
						<div className="announcement-actions">
							{showCtaAsLink ? (
								<a
									href={ctaLink}
									className="btn"
									onClick={handleCtaClick}
									target={ctaExternal ? "_blank" : undefined}
									rel={ctaExternal ? "noopener noreferrer" : undefined}
								>
									{popup.ctaText}
								</a>
							) : (
								<button className="btn" onClick={handleCtaClick}>
									{popup.ctaText}
								</button>
							)}
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
