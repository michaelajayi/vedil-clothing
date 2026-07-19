import HeroSlider from "@/components/home/HeroSlider";
import ShopSection from "@/components/home/ShopSection";
import AcademySection from "@/components/home/AcademySection";
import FactorySection from "@/components/home/FactorySection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ScrollRevealInit from "@/components/home/ScrollRevealInit";

export default function HomePage() {
	return (
		<main>
			<ScrollRevealInit />
			<HeroSlider />
			<ShopSection />
			<AcademySection />
			<FactorySection />
			<TestimonialsSection />
		</main>
	);
}
