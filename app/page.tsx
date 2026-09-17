import type { Metadata } from "next";
import { IntroProvider } from "@/components/loader/IntroContext";
import { EnquiryProvider } from "@/components/contact/EnquiryContext";
import { FloatingNav } from "@/components/nav/FloatingNav";
import { HeroSection } from "@/components/hero/HeroSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { CapabilityMarquee } from "@/components/marquee/CapabilityMarquee";
import { CredibilitySection } from "@/components/credibility/CredibilitySection";
import { WorkSection } from "@/components/work/WorkSection";
import { FoundersSection } from "@/components/founders/FoundersSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/footer/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <IntroProvider>
      <EnquiryProvider>
        <FloatingNav />
        <main id="top">
          <HeroSection />
          <CapabilityMarquee />
          {/* Where "Skip to content" in the root layout lands: past the hero,
              at the first section. Every route provides a #content target. */}
          <div id="content" tabIndex={-1} />
          <ServicesSection />
          <CredibilitySection />
          <WorkSection />
          <FoundersSection />
          {/* TestimonialsSection is deliberately not rendered. Every quote in
              TESTIMONIALS is a placeholder (CONTENT-TODO.md §1), and a page
              must not present invented quotes as client testimony. Put
              <TestimonialsSection /> back here once the quotes are real,
              attributed, and published with written permission. */}
          <ContactSection />
        </main>
        <Footer />
      </EnquiryProvider>
    </IntroProvider>
  );
}
