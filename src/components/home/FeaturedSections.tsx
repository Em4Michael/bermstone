'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PropertyCard from '@/components/properties/PropertyCard';
import InvestmentCard from '@/components/investments/InvestmentCard';
import { propertiesApi, investmentsApi } from '@/lib/api';
import type { Property, Investment } from '@/types';

function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden">
          <div className="skeleton h-52" />
          <div className="p-5 space-y-3 bg-white">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    propertiesApi.getAll({ featured: true, limit: 3 })
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-[#FAFBFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">Shortlet Apartments</span>
            <h2 className="section-title">Handpicked Stays</h2>
            <p className="section-subtitle mt-3">Curated premium apartments for executives, families, and travellers.</p>
          </div>
          <Link href="/properties" className="btn-secondary shrink-0 self-start md:self-auto">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? <SkeletonGrid /> : properties.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">No featured properties yet.</p>
            <p className="text-sm">Add properties via the admin panel and mark them as featured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {properties.map((p) => <PropertyCard key={p._id} property={p} featured={p.isFeatured} />)}
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
    investmentsApi.getAll({ featured: true, limit: 3 })
      .then((res) => setInvestments(res.data))
      .catch(() => setInvestments([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-[#F3F7FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="section-label">Investment Opportunities</span>
            <h2 className="section-title">Fund. Build. Profit.</h2>
            <p className="section-subtitle mt-3">Invest in high-yield real estate developments alongside experienced partners.</p>
          </div>
          <Link href="/investments" className="btn-secondary shrink-0 self-start md:self-auto">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {loading ? <SkeletonGrid /> : investments.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-2">No featured investments yet.</p>
            <p className="text-sm">Add investments via the admin panel and mark them as featured.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {investments.map((inv) => <InvestmentCard key={inv._id} investment={inv} />)}
          </div>
        )}
      </div>
    </section>
  );
}
