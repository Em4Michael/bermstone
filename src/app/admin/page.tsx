'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, TrendingUp, CalendarCheck, MessageSquare, DollarSign, Users, Star, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, cn } from '@/lib/utils';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface OverviewData {
  properties:  { total: number; active: number };
  investments: { total: number; totalTarget?: number; totalRaised?: number };
  bookings:    { total: number; pending: number; confirmed: number };
  inquiries:   { total: number; new: number };
  users:       { total: number };
  reviews:     { total: number };
  revenue:     { total: number };
  charts: {
    bookingsByMonth: { _id: { year: number; month: number }; count: number; revenue: number }[];
    topProperties:   { property: { name: string }; bookings: number }[];
    inquiryByType:   { _id: string; count: number }[];
  };
}

export default function AdminOverviewPage() {
  const [data,    setData]    = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics/overview')
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 bg-white rounded-xl" />)}
      </div>
    </div>
  );

  const stats = [
    { label: 'Active Properties', value: data?.properties.active ?? 0, sub: `${data?.properties.total} total`, Icon: Building2, color: 'text-[#1E5FBE]', bg: 'bg-blue-50', href: '/admin/properties' },
    { label: 'Investments', value: data?.investments.total ?? 0, sub: data?.investments.totalRaised ? `₦${((data.investments.totalRaised || 0) / 1e9).toFixed(1)}B raised` : '', Icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/investments' },
    { label: 'Total Bookings', value: data?.bookings.total ?? 0, sub: `${data?.bookings.pending} pending`, Icon: CalendarCheck, color: 'text-violet-600', bg: 'bg-violet-50', href: '/admin/bookings' },
    { label: 'Inquiries', value: data?.inquiries.total ?? 0, sub: `${data?.inquiries.new} new`, Icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/inquiries' },
    { label: 'Total Revenue', value: formatCurrency(data?.revenue.total ?? 0), sub: 'from bookings', Icon: DollarSign, color: 'text-[#C9A84C]', bg: 'bg-yellow-50', href: '/admin/bookings' },
    { label: 'Total Users', value: data?.users.total ?? 0, sub: 'registered', Icon: Users, color: 'text-sky-600', bg: 'bg-sky-50', href: '#' },
    { label: 'Reviews', value: data?.reviews.total ?? 0, sub: 'published', Icon: Star, color: 'text-amber-500', bg: 'bg-amber-50', href: '/admin/reviews' },
    { label: 'Confirmed', value: data?.bookings.confirmed ?? 0, sub: 'bookings', Icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50', href: '/admin/bookings' },
  ];

  const maxBookings = Math.max(...(data?.charts.bookingsByMonth.map((b) => b.count) ?? [1]), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back. Here&apos;s what&apos;s happening at Bermstone.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, Icon, color, bg, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-3">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', bg)}>
                <Icon size={17} className={color} />
              </div>
              <ArrowUpRight size={14} className="text-slate-300 group-hover:text-[#1E5FBE] transition-colors" />
            </div>
            <div className="font-display font-bold text-2xl text-[#0B1F3A]">{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
            {sub && <div className="text-slate-400 text-xs">{sub}</div>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-[#0B1F3A] mb-5">Bookings — Last 12 Months</h3>
          {data?.charts.bookingsByMonth?.length ? (
            <div className="flex items-end gap-3 h-36">
              {data.charts.bookingsByMonth.map((b) => {
                const pct = Math.round((b.count / maxBookings) * 100);
                return (
                  <div key={`${b._id.year}-${b._id.month}`} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-[#1E5FBE]">{b.count}</span>
                    <div className="w-full rounded-t-md bg-[#1E5FBE]" style={{ height: `${Math.max(pct, 8)}%` }} />
                    <span className="text-[10px] text-slate-400">{MONTH_NAMES[b._id.month - 1]}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-36 flex items-center justify-center text-slate-400 text-sm">No bookings data yet.</div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-[#0B1F3A] mb-5">Inquiries by Type</h3>
          <div className="space-y-3">
            {data?.charts.inquiryByType?.length ? (
              data.charts.inquiryByType.map(({ _id, count }) => {
                const labels: Record<string, string> = { owner_listing: 'Owner Listing', investor: 'Investor', general_contact: 'General Contact' };
                const colors: Record<string, string> = { owner_listing: 'bg-[#1E5FBE]', investor: 'bg-[#C9A84C]', general_contact: 'bg-[#3B9EE0]' };
                const pct = Math.round((count / (data.inquiries.total || 1)) * 100);
                return (
                  <div key={_id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{labels[_id] || _id}</span>
                      <span className="font-semibold text-[#0B1F3A]">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full">
                      <div className={cn('h-full rounded-full', colors[_id] || 'bg-slate-400')} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            ) : <p className="text-slate-400 text-sm text-center py-8">No inquiries yet.</p>}
          </div>
        </div>
      </div>

      {data?.charts.topProperties?.length ? (
        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-semibold text-[#0B1F3A] mb-4">Top Properties by Bookings</h3>
          <div className="space-y-3">
            {data.charts.topProperties.map(({ property, bookings }, i) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0">
                <span className="text-slate-400 text-sm w-5 text-right">{i + 1}</span>
                <div className="flex-1 text-sm font-medium text-[#0B1F3A]">{property?.name}</div>
                <span className="text-[#1E5FBE] font-semibold text-sm">{bookings} bookings</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
