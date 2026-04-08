import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import {
  StatsSection,
  WhySection,
  TestimonialsSection,
  OwnerCTA,
} from "@/components/home/HomeSections";
import {
  FeaturedKeyneets,
  FeaturedInvestments,
} from "@/components/home/FeaturedSections";

export const metadata: Metadata = {
  title: "Bermstone — Premium Real Estate & Keyneets",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedKeyneets />
      <WhySection />
      <FeaturedInvestments />
      <TestimonialsSection />
      <OwnerCTA />
    </>
  );
}
