import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import CartDrawer from "@/components/layout/CartDrawer";
import { AnnouncementModal } from "@/components/ui/AnnouncementModal";
import { CartProvider } from "@/contexts/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Providers } from "@/components/Providers";

const fraunces = Fraunces({
	subsets: ["latin"],
	variable: "--font-display",
	weight: "variable",
	style: ["normal", "italic"],
	axes: ["opsz"],
});

const hankenGrotesk = Hanken_Grotesk({
	subsets: ["latin"],
	variable: "--font-body",
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title:
		"Vedil Clothing | Ready-to-Wear, It's Fun to Sew & Garment Factory · Lagos",
	description:
		"Vedil Clothing is a Lagos fashion house: ready-to-wear for men, women and children, It's Fun to Sew, and a garment factory for custom and bulk orders.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${fraunces.variable} ${hankenGrotesk.variable}`}
		>
			<body>
				<Providers>
					<CartProvider>
						<ToastProvider>
							<Header />
							{children}
							<Footer />
							<WhatsAppFloat />
							<CartDrawer />
							<AnnouncementModal />
						</ToastProvider>
					</CartProvider>
				</Providers>
			</body>
		</html>
	);
}
