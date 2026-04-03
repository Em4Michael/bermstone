'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MapPin, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import type { Investment } from '@/types';
import { formatCurrency, PROJECT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, cn } from '@/lib/utils';

export default function InvestmentCard({ investment }: { investment: Investment }) {
  const [hovered, setHovered] = useState(false);
  const pct = investment.totalAmount > 0
    ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100) : 0;

  return (
    <Link
      href={`/investments/${investment.slug || investment._id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group block bg-white rounded-3xl overflow-hidden border border-blue-50 shadow-[0_4px_24px_rgba(11,31,58,0.07)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(11,31,58,0.18)]"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={investment.coverImage || investment.images?.[0]?.url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'}
          alt={investment.name} fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/80 via-[#0B1F3A]/30 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className={cn('badge shadow-md', STATUS_COLORS[investment.status] || 'bg-slate-100 text-slate-600')}>
            {STATUS_LABELS[investment.status]}
          </span>
        </div>

        {/* Featured */}
        {investment.isFeatured && (
          <div className="absolute top-3.5 right-3.5">
            <span className="bg-[#C9A84C] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
              FEATURED
            </span>
          </div>
        )}

        {/* ROI pill */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 text-center shadow-lg group-hover:bg-[#C9A84C] transition-colors duration-300">
          <div className="font-display font-bold text-lg text-[#1E5FBE] group-hover:text-white leading-none transition-colors">
            {investment.expectedROI}%
          </div>
          <div className="text-slate-400 group-hover:text-white/80 text-[9px] font-medium mt-0.5 transition-colors">
            Expected ROI
          </div>
        </div>

        {/* Location bottom left */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 text-white/80 text-xs">
            <MapPin size={11} />
            {investment.location.city}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-[#3B9EE0] text-xs font-medium mb-1.5">
          <TrendingUp size={11} />
          <span>{PROJECT_TYPE_LABELS[investment.projectType]}</span>
          {investment.projectPeriod?.durationMonths && (
            <>
              <span className="text-slate-200">·</span>
              <Clock size={10} className="text-slate-400" />
              <span className="text-slate-400">{investment.projectPeriod.durationMonths}mo</span>
            </>
          )}
        </div>

        <h3 className="font-display font-semibold text-[#0B1F3A] text-xl leading-snug mb-2 group-hover:text-[#1E5FBE] transition-colors duration-300">
          {investment.name}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-5 min-h-[2.5rem] leading-relaxed">
          {investment.summary}
        </p>

        {/* Animated progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-500">{pct}% funded</span>
            <span className="text-[#0B1F3A]">{formatCurrency(investment.currentlyRaised, investment.currency)}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] transition-all duration-1000 ease-out"
              style={{ width: hovered ? `${pct}%` : `${Math.max(pct - 15, 0)}%` }}
            />
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Min. Investment</div>
            <div className="font-semibold text-[#0B1F3A] text-sm mt-0.5">
              {formatCurrency(investment.minimumInvestment, investment.currency)}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[#1E5FBE] text-sm font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            View Project <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
