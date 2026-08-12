import { IntroProvider } from "@/components/loader/IntroContext";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { HeroSection } from "@/components/hero/HeroSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { CapabilityMarquee } from "@/components/marquee/CapabilityMarquee";
import { CredibilitySection } from "@/components/credibility/CredibilitySection";
import { FoundersSection } from "@/components/founders/FoundersSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <IntroProvider>
      <FloatingNav />
      <main id="top">
        <HeroSection />
        <CapabilityMarquee />
        <ServicesSection />
        <CredibilitySection />
        <FoundersSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </IntroProvider>
  );
}
