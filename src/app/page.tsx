import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import { StatsSection, WhySection, TestimonialsSection, OwnerCTA } from '@/components/home/HomeSections';
import { FeaturedProperties, FeaturedInvestments } from '@/components/home/FeaturedSections';

export const metadata: Metadata = { title: 'Bermstone — Premium Real Estate & Shortlets' };

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProperties />
      <WhySection />
      <FeaturedInvestments />
      <TestimonialsSection />
      <OwnerCTA />
    </>
  );
}
