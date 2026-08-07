"use client";

import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

// Define a unique ID for this specific announcement for local storage dismissal
const ANNOUNCEMENT_ID = "no-designs-aug-10";

// This will likely be passed as props later from backend data
interface AnnouncementContent {
	id: string;
	newTag?: string;
	date?: string;
	headline: string;
	imageSrc?: string;
	imageAlt?: string;
	body: string[];
	ctaText?: string;
	ctaLink?: string;
}

const defaultAnnouncementContent: AnnouncementContent = {
	id: ANNOUNCEMENT_ID,
	newTag: "NEW",
	date: "Jul 31, 2026",
	headline: "No Available Designs on the Website",
	imageSrc: "/announcements/we-are-back.png", // Add image URL when available
	imageAlt: "WE WILL BE BACK 10TH OF AUGUST",
	body: [
		"THERE ARE CURRENTLY NO AVAILABLE DESIGNS ON OUR WEBSITE.",
		"From 10th August, our website will once again be filled with available designs.",
		"We look forward to welcoming you back. See you soon!",
	],
	ctaText: "Got It",
	ctaLink: "#", // Placeholder
};

export function AnnouncementModal() {
	const [hasBeenDismissed, setHasBeenDismissed] = useState(() => {
		if (typeof window !== "undefined") {
			// Ensure localStorage is available
			return (
				localStorage.getItem(`announcement-${ANNOUNCEMENT_ID}-dismissed`) ===
				"true"
			);
		}
		return false; // Default for SSR
	});
	const [isOpen, setIsOpen] = useState(!hasBeenDismissed);

	const handleDismiss = useCallback(() => {
		localStorage.setItem(`announcement-${ANNOUNCEMENT_ID}-dismissed`, "true");
		setHasBeenDismissed(true);
		setIsOpen(false);
	}, []);

	if (hasBeenDismissed) {
		return null; // Don't render anything if dismissed
	}

	const { newTag, date, headline, imageSrc, imageAlt, body, ctaText, ctaLink } =
		defaultAnnouncementContent;

	return (
		<Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
			<Dialog.Portal>
				<Dialog.Overlay className="announcement-overlay" />
				<Dialog.Content className="announcement-content">
					<Dialog.Close asChild>
						<button
							className="announcement-close-button"
							aria-label="Close"
							onClick={handleDismiss}
						>
							<X size={20} />
						</button>
					</Dialog.Close>

					{newTag && date && (
						<div className="announcement-tag-date">
							<span className="announcement-new-tag">{newTag}</span>
							<span className="announcement-date">{date}</span>
						</div>
					)}

					{/* Announcement image/graphic at top */}
					{imageSrc && (
						<div className="announcement-image-wrap">
							<img
								src={imageSrc}
								alt={imageAlt || ""}
								className="announcement-image"
							/>
						</div>
					)}

					<Dialog.Title className="announcement-headline">
						{headline}
					</Dialog.Title>

					<div className="announcement-body">
						{body.map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>

					{ctaText && (
						<div className="announcement-actions">
							{ctaLink && ctaText && ctaLink !== "#" ? (
								<a href={ctaLink} className="btn" onClick={handleDismiss}>
									{ctaText}
								</a>
							) : (
								<button className="btn" onClick={handleDismiss}>
									{ctaText}
								</button>
							)}
						</div>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
