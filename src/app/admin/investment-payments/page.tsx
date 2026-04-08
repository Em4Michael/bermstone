'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, X, Search } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface Payment {
  _id: string;
  investment: { _id: string; name: string; currency: string };
  investor: { name: string; email: string; phone?: string };
  amount: number; currency: string;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  paymentMethod: string; paymentReference?: string;
  notes?: string; createdAt: string; paymentDate?: string;
}

const STATUS = {
  pending:   { bg: 'bg-yellow-100 text-yellow-700', Icon: Clock },
  confirmed: { bg: 'bg-green-100  text-green-700',  Icon: CheckCircle },
  rejected:  { bg: 'bg-red-100    text-red-600',    Icon: XCircle },
};

export default function AllInvestmentPaymentsPage() {
  const [payments,   setPayments]   = useState<Payment[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<'all'|'pending'|'confirmed'|'rejected'>('all');
  const [search,     setSearch]     = useState('');
  const [confirming, setConfirming] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/investment-payments?limit=200');
      setPayments(res.data.data || []);
    } catch { setPayments([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirm = async (id: string) => {
    const ref = window.prompt('Enter payment reference (optional):') ?? '';
    if (ref === null) return; // cancelled
    setConfirming(id);
    try {
      await api.patch(`/investment-payments/${id}/confirm`, { paymentReference: ref });
      load();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Failed'); }
    finally { setConfirming(null); }
  };

  const reject = async (id: string) => {
    if (!window.confirm('Reject this payment?')) return;
    await api.patch(`/investment-payments/${id}/reject`);
    load();
  };

  const display = payments
    .filter(p => filter === 'all' || p.paymentStatus === filter)
    .filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.investor.name.toLowerCase().includes(q) ||
             p.investor.email.toLowerCase().includes(q) ||
             p.investment?.name?.toLowerCase().includes(q);
    });

  const totals = {
    confirmed: payments.filter(p => p.paymentStatus === 'confirmed').reduce((s, p) => s + p.amount, 0),
    pending:   payments.filter(p => p.paymentStatus === 'pending').reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Investment Payments</h1>
          <p className="text-slate-500 text-sm">Confirm investor payments to update project funding progress</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Payments', value: payments.length,                              color: 'text-[#0B1F3A]' },
          { label: 'Pending',        value: payments.filter(p => p.paymentStatus === 'pending').length,   color: 'text-yellow-600' },
          { label: 'Confirmed ₦',    value: formatCurrency(totals.confirmed, 'NGN'),       color: 'text-green-600' },
          { label: 'Pending ₦',      value: formatCurrency(totals.pending, 'NGN'),         color: 'text-yellow-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
            <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white">
          <Search size={15} className="text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search investor or project…"
            className="flex-1 text-sm outline-none bg-transparent placeholder:text-slate-400" />
          {search && <button onClick={() => setSearch('')}><X size={13} className="text-slate-400" /></button>}
        </div>
        <div className="flex gap-2">
          {(['all','pending','confirmed','rejected'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('px-4 py-2.5 rounded-xl border text-sm capitalize transition-all',
                filter === f ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-slate-200 text-slate-600 hover:border-[#0B1F3A]')}>
              {f === 'all' ? `All (${payments.length})` : `${f} (${payments.filter(p=>p.paymentStatus===f).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#1E5FBE] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : display.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-slate-400 text-sm">No payments found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Investor','Project','Amount','Method','Reference','Status','Date','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {display.map(p => {
                const { bg, Icon } = STATUS[p.paymentStatus];
                return (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#0B1F3A]">{p.investor.name}</div>
                      <div className="text-xs text-slate-400">{p.investor.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Link href={`/investments/${p.investment?._id}/payments`}
                        className="text-[#1E5FBE] hover:underline text-sm font-medium">
                        {p.investment?.name || '—'}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-[#0B1F3A]">{formatCurrency(p.amount, p.currency)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 capitalize text-xs">{p.paymentMethod?.replace('_',' ')}</td>
                    <td className="px-4 py-3.5"><span className="font-mono text-xs text-slate-500">{p.paymentReference || '—'}</span></td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', bg)}>
                        <Icon size={11} />{p.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(p.paymentDate || p.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      {p.paymentStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button onClick={() => confirm(p._id)} disabled={confirming === p._id}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg disabled:opacity-50 transition-colors">
                            {confirming === p._id ? '…' : <><CheckCircle size={11} />Confirm</>}
                          </button>
                          <button onClick={() => reject(p._id)}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-medium rounded-lg transition-colors">
                            <XCircle size={11} />Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
