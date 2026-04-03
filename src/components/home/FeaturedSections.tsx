'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import InvestmentCard from '@/components/investments/InvestmentCard';
import { propertiesApi, investmentsApi } from '@/lib/api';
import type { Property, Investment } from '@/types';

function SkeletonCard({ variant = 'property' }: { variant?: 'property' | 'investment' }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-blue-50 shadow-sm">
      <div className={`shimmer ${variant === 'property' ? 'aspect-[4/3]' : 'aspect-video'} w-full`} />
      <div className="p-5 space-y-3">
        <div className="shimmer h-3 w-1/3 rounded-full" />
        <div className="shimmer h-5 w-4/5 rounded-lg" />
        <div className="shimmer h-3 w-full rounded-lg" />
        <div className="shimmer h-3 w-2/3 rounded-lg" />
        {variant === 'investment' && <div className="shimmer h-2 w-full rounded-full mt-4" />}
      </div>
    </div>
  );
}

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    propertiesApi.getAll({ featured: true, limit: 3 } as never)
      .then(res => setProperties(res.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[#FAFBFF] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #1E5FBE, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-14 reveal-scale">
          <div>
            <span className="section-label">Keyneet Apartments</span>
            <h2 className="section-title mt-1">Handpicked Stays</h2>
            <p className="section-subtitle mt-3">
              Curated luxury apartments for executives, families and travellers.
            </p>
          </div>
          <Link href="/properties"
            className="group flex items-center gap-2 text-[#1E5FBE] font-medium text-sm border border-[#1E5FBE]/30 rounded-xl px-4 py-2.5 hover:bg-[#EBF2FF] transition-all duration-200 shrink-0 self-start md:self-auto">
            View All Keyneets
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="property" />)}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-blue-50">
            <div className="text-5xl mb-3 animate-float inline-block">🏠</div>
            <p className="text-slate-400 text-sm mt-2">No featured properties yet.<br />Add them via the admin panel and mark as featured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 reveal-stagger">
            {properties.map(p => <PropertyCard key={p._id} property={p} featured={p.isFeatured} />)}
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    investmentsApi.getAll({ featured: true, limit: 3 } as never)
      .then(res => setInvestments(res.data))
      .catch(() => setInvestments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-[#F3F7FF] to-[#EBF2FF] relative overflow-hidden">
      {/* Background shapes */}
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0B1F3A, transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-14 reveal-scale">
          <div>
            <span className="section-label">Investment Opportunities</span>
            <h2 className="section-title mt-1">Fund. Build. Profit.</h2>
            <p className="section-subtitle mt-3">
              High-yield property developments backed by transparent plans.
            </p>
          </div>
          <Link href="/investments"
            className="group flex items-center gap-2 text-[#C9A84C] font-medium text-sm border border-[#C9A84C]/40 rounded-xl px-4 py-2.5 hover:bg-[#C9A84C]/10 transition-all duration-200 shrink-0 self-start md:self-auto">
            View All Projects
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} variant="investment" />)}
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-blue-50">
            <div className="text-5xl mb-3 animate-float inline-block">🏗️</div>
            <p className="text-slate-400 text-sm mt-2">No featured investments yet.<br />Add them via the admin panel and mark as featured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 reveal-stagger">
            {investments.map(inv => <InvestmentCard key={inv._id} investment={inv} />)}
          </div>
        )}
      </div>
    </section>
  );
}