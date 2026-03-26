import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar } from 'lucide-react';
import type { Investment } from '@/types';
import { formatCurrency, PROJECT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, cn } from '@/lib/utils';

export default function InvestmentCard({ investment }: { investment: Investment }) {
  const pct = investment.totalAmount > 0
    ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100)
    : 0;

  return (
    <Link href={`/investments/${investment.slug || investment._id}`} className="card group block overflow-hidden">
      <div className="relative overflow-hidden aspect-video">
        <Image
          src={investment.coverImage || investment.images?.[0]?.url || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'}
          alt={investment.name} fill
          sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={cn('badge', STATUS_COLORS[investment.status] || 'bg-slate-100 text-slate-700')}>
            {STATUS_LABELS[investment.status] || investment.status}
          </span>
          {investment.isFeatured && <span className="badge bg-[#C9A84C] text-white">Featured</span>}
        </div>
        <div className="absolute bottom-3 right-3 bg-white/95 rounded-lg px-3 py-1.5 text-center">
          <div className="text-[#1E5FBE] font-display font-bold text-lg leading-none">{investment.expectedROI}%</div>
          <div className="text-slate-500 text-[10px] font-medium">Expected ROI</div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1.5 text-[#3B9EE0] text-xs font-medium mb-1">
          <MapPin size={12} /><span>{investment.location.city}, {investment.location.state}</span>
          <span className="text-slate-300 mx-1">·</span>
          <span className="text-slate-500">{PROJECT_TYPE_LABELS[investment.projectType]}</span>
        </div>
        <h3 className="font-display font-semibold text-[#0B1F3A] text-xl leading-tight mb-2 group-hover:text-[#1E5FBE] transition-colors">{investment.name}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-4">{investment.summary}</p>

        <div className="mb-4">
          <div className="flex justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span>{pct}% funded</span>
            <span>{formatCurrency(investment.currentlyRaised, investment.currency)} raised</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm pt-3 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-400">Min. Investment</div>
            <div className="font-semibold text-[#0B1F3A]">{formatCurrency(investment.minimumInvestment, investment.currency)}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-slate-400">Total Target</div>
            <div className="font-semibold text-[#0B1F3A]">{formatCurrency(investment.totalAmount, investment.currency)}</div>
          </div>
        </div>
        {investment.projectPeriod?.durationMonths && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-3">
            <Calendar size={12} /><span>{investment.projectPeriod.durationMonths} months duration</span>
          </div>
        )}
      </div>
    </Link>
  );
}
