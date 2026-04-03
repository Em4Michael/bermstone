'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, TrendingUp, Shield, FileText, ChevronRight } from 'lucide-react';
import InvestmentCard from '@/components/investments/InvestmentCard';
import { investmentsApi } from '@/lib/api';
import type { Investment, ProjectStatus } from '@/types';
import { cn, PROJECT_TYPE_LABELS } from '@/lib/utils';

const STATUSES: { value: ProjectStatus | ''; label: string }[] = [
  { value: '',           label: 'All Projects' },
  { value: 'active',    label: 'Active' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'funded',    label: 'Fully Funded' },
  { value: 'completed', label: 'Completed' },
];
const TYPES = [
  { value: '', label: 'All Types' },
  ...Object.entries(PROJECT_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [page,        setPage]        = useState(1);
  const [status,      setStatus]      = useState<ProjectStatus | ''>('');
  const [type,        setType]        = useState('');
  const [search,      setSearch]      = useState('');
  const [showFilters, setShow]        = useState(false);

  const hasActive = !!(status || type || search);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 50 };
      if (status) params.status      = status;
      if (type)   params.projectType = type;
      if (search) params.search      = search;

      const res = await investmentsApi.getAll(params as never);
      setInvestments(res.data || []);
      setTotal(res.pagination?.total || 0);
      setPages(res.pagination?.pages || 1);
    } catch { setInvestments([]); }
    finally  { setLoading(false); }
  }, [status, type, search, page]);

  useEffect(() => { load(); }, [load]);

  const clear = () => { setStatus(''); setType(''); setSearch(''); setPage(1); };

  return (
    <div className="min-h-screen bg-[#FAFBFF]">

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-animated-gradient noise min-h-[60vh] flex items-end pb-14">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #C9A84C, transparent)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1E5FBE, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 w-full">
          <div className="animate-fade-up max-w-3xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 border border-[#C9A84C]/30 flex items-center justify-center animate-float">
                <TrendingUp size={20} className="text-[#C9A84C]" />
              </div>
              <span className="text-[#C9A84C] text-sm font-medium uppercase tracking-widest">Real Estate Investment</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-white leading-[1.05] mb-5">
              Build Wealth <br />
              <span className="italic font-light text-white/80">Through Property</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed mb-6">
              High-yield developments backed by detailed business plans and built by proven management.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: <Shield size={14} className="text-green-400" />, label: 'Legally Structured' },
                { icon: <FileText size={14} className="text-[#3B9EE0]" />, label: 'Full Documentation' },
                { icon: <TrendingUp size={14} className="text-[#C9A84C]" />, label: 'Up to 45% ROI' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 text-xs font-medium">
                  {icon}{label}
                </div>
              ))}
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
            {[['₦2B+','Managed Assets'],['35–45%','Expected ROI'],['100%','Transparency']].map(([val, lbl]) => (
              <div key={lbl} className="text-center">
                <div className="font-display text-2xl font-bold text-[#C9A84C]">{val}</div>
                <div className="text-white/40 text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ─────────────────────────── */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">

            {/* Search */}
            <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search projects…"
                className="flex-1 text-sm outline-none placeholder:text-slate-400 bg-transparent" />
            </div>

            {/* Status tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {STATUSES.map(s => (
                <button key={s.value} onClick={() => { setStatus(s.value); setPage(1); }}
                  className={cn('px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200',
                    status === s.value
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A] shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A]')}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* More filters */}
            <button onClick={() => setShow(!showFilters)}
              className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all shrink-0',
                showFilters ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-slate-200 text-slate-700 hover:border-[#0B1F3A]')}>
              <SlidersHorizontal size={15} />More
            </button>

            {hasActive && (
              <button onClick={clear} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 hover:text-red-700 font-medium shrink-0">
                <X size={13} />Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 animate-fade-down">
              <label className="form-label">Project Type</label>
              <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
                className="form-input text-sm max-w-xs">
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Listings ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {!loading && (
          <p className="text-sm text-slate-400 mb-6">
            <strong className="text-[#0B1F3A]">{investments.length}</strong> project{investments.length !== 1 ? 's' : ''}
            {hasActive && <span className="text-[#1E5FBE]"> (filtered)</span>}
          </p>
        )}

        {/* Cards — no reveal class, animate-fade-up per card */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <div className="shimmer" style={{ aspectRatio: '16/9' }} />
                <div className="p-5 space-y-3 bg-white rounded-b-3xl">
                  <div className="shimmer h-3 w-1/3 rounded-full" />
                  <div className="shimmer h-5 w-4/5 rounded-lg" />
                  <div className="shimmer h-2 w-full rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-5 animate-float inline-block">🏗️</div>
            <h3 className="font-display text-2xl font-semibold text-[#0B1F3A] mb-2">No projects found</h3>
            <p className="text-slate-400 mb-5">
              {hasActive ? 'Try adjusting or clearing your filters.' : 'No investment projects available yet.'}
            </p>
            {hasActive && <button onClick={clear} className="btn-primary">Clear Filters</button>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {investments.map((inv, i) => (
                <div key={inv._id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 60, 360)}ms` }}>
                  <InvestmentCard investment={inv} />
                </div>
              ))}
            </div>

            {pages > 1 && !hasActive && (
              <div className="flex justify-center gap-2 mt-14">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 disabled:opacity-30 hover:border-[#0B1F3A] transition-all">
                  ← Prev
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-10 h-10 text-sm rounded-xl border transition-all',
                      p === page ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-slate-200 hover:border-[#0B1F3A]')}>
                    {p}
                  </button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(page + 1)}
                  className="px-5 py-2.5 text-sm rounded-xl border border-slate-200 disabled:opacity-30 hover:border-[#0B1F3A] transition-all">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* How it works */}
      <section className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="section-label">Process</span>
            <h2 className="section-title">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step:'01', title:'Browse Projects',  desc:'Review business plans and projected ROI.',  icon:'🔍' },
              { step:'02', title:'Express Interest', desc:'Submit inquiry. No commitment yet.',         icon:'✋' },
              { step:'03', title:'Sign Agreement',   desc:'Receive and sign formal documentation.',    icon:'📝' },
              { step:'04', title:'Earn Returns',     desc:'Receive ROI on project completion.',        icon:'💰' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="relative group">
                <div className="absolute -top-3 -left-1 text-[#0B1F3A]/5 font-display font-bold text-7xl leading-none select-none group-hover:text-[#1E5FBE]/10 transition-colors">{step}</div>
                <div className="relative bg-[#F8FAFF] rounded-2xl p-6 border border-blue-50 hover:border-[#1E5FBE]/30 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-4 animate-float" style={{ display:'inline-block' }}>{icon}</div>
                  <h3 className="font-semibold text-[#0B1F3A] mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  <ChevronRight size={14} className="text-[#1E5FBE] mt-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}