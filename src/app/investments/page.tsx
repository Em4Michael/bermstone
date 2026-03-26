'use client';
import { useState, useEffect, useCallback } from 'react';
import InvestmentCard from '@/components/investments/InvestmentCard';
import { investmentsApi } from '@/lib/api';
import type { Investment, ProjectStatus } from '@/types';
import { cn, PROJECT_TYPE_LABELS } from '@/lib/utils';

const STATUSES = [
  { value: '',          label: 'All' },
  { value: 'upcoming',  label: 'Upcoming' },
  { value: 'active',    label: 'Active' },
  { value: 'funded',    label: 'Fully Funded' },
  { value: 'completed', label: 'Completed' },
];
const TYPES = [
  { value: '', label: 'All Types' },
  ...Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [page,        setPage]        = useState(1);
  const [status,      setStatus]      = useState('');
  const [type,        setType]        = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 9 };
      if (status) params.status      = status;
      if (type)   params.projectType = type;
      const res = await investmentsApi.getAll(params as never);
      setInvestments(res.data);
      setTotal(res.pagination.total);
      setPages(res.pagination.pages);
    } catch { setInvestments([]); }
    finally { setLoading(false); }
  }, [status, type, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-10 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#1E5FBE]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <span className="text-[#3B9EE0] text-sm font-medium uppercase tracking-wider">Real Estate Investments</span>
          <h1 className="font-display text-4xl font-semibold text-white mt-2 mb-2">Build Wealth with Bermstone</h1>
          <p className="text-blue-200 text-sm max-w-xl">High-yield property developments backed by transparent plans and proven management.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s.value} onClick={() => { setStatus(s.value); setPage(1); }}
                  className={cn('px-4 py-1.5 rounded-full text-sm border transition-all',
                    status === s.value ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]' : 'border-slate-200 text-slate-600 hover:border-[#1E5FBE]')}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:ml-auto">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type</p>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="form-input text-sm min-w-[180px]">
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
        </div>

        {!loading && <p className="text-sm text-slate-500 mb-6">{total} investment{total !== 1 ? 's' : ''} available</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-48" />
                <div className="p-5 space-y-3 bg-white">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-2 w-full rounded-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : investments.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">No investments found</h3>
            <p className="text-slate-500 text-sm">Try changing the filters above.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {investments.map((inv) => <InvestmentCard key={inv._id} investment={inv} />)}
            </div>
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:border-[#1E5FBE] transition-colors">Previous</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-10 h-10 text-sm rounded-lg border transition-all', p === page ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]' : 'border-slate-200 hover:border-[#1E5FBE]')}>{p}</button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:border-[#1E5FBE] transition-colors">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
