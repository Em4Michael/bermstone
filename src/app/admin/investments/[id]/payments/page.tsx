'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Clock, RefreshCw, Plus } from 'lucide-react';
import api from '@/lib/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

interface Payment {
  _id: string;
  investor: { name: string; email: string; phone?: string; company?: string };
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'confirmed' | 'rejected';
  paymentMethod: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  paymentDate?: string;
}

interface Investment {
  _id: string; name: string;
  totalAmount: number; currentlyRaised: number; currency: string;
}

const STATUS_STYLES = {
  pending:   { bg: 'bg-yellow-100 text-yellow-700', Icon: Clock },
  confirmed: { bg: 'bg-green-100  text-green-700',  Icon: CheckCircle },
  rejected:  { bg: 'bg-red-100    text-red-600',    Icon: XCircle },
};

export default function InvestmentPaymentsPage({ params }: { params: { id: string } }) {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [payments,   setPayments]   = useState<Payment[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showAdd,    setShowAdd]    = useState(false);

  // Add payment form state
  const [addForm, setAddForm] = useState({
    name: '', email: '', phone: '', company: '', amount: '',
    paymentMethod: 'bank_transfer', paymentReference: '', notes: '',
  });
  const [addSaving, setAddSaving] = useState(false);
  const [addError,  setAddError]  = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [invRes, payRes] = await Promise.all([
        api.get(`/investments/${params.id}`),
        api.get(`/investment-payments?investment=${params.id}&limit=100`),
      ]);
      setInvestment(invRes.data.data);
      setPayments(payRes.data.data);
    } catch { setPayments([]); }
    finally  { setLoading(false); }
  }, [params.id]);

  useEffect(() => { load(); }, [load]);

  const confirm = async (paymentId: string, ref?: string) => {
    setConfirming(paymentId);
    try {
      await api.patch(`/investment-payments/${paymentId}/confirm`, { paymentReference: ref });
      await load();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Failed'); }
    finally { setConfirming(null); }
  };

  const reject = async (paymentId: string) => {
    if (!confirm('Reject this payment?')) return;
    try {
      await api.patch(`/investment-payments/${paymentId}/reject`);
      await load();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Failed'); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSaving(true); setAddError('');
    try {
      await api.post('/investment-payments', {
        investment: params.id,
        name:    addForm.name, email: addForm.email,
        phone:   addForm.phone, company: addForm.company,
        amount:  Number(addForm.amount),
        paymentMethod:    addForm.paymentMethod,
        paymentReference: addForm.paymentReference,
        notes:            addForm.notes,
      });
      setShowAdd(false);
      setAddForm({ name:'', email:'', phone:'', company:'', amount:'', paymentMethod:'bank_transfer', paymentReference:'', notes:'' });
      await load();
    } catch (err: unknown) { setAddError(err instanceof Error ? err.message : 'Failed'); }
    finally { setAddSaving(false); }
  };

  const filtered = filter === 'all' ? payments : payments.filter(p => p.paymentStatus === filter);
  const pct = investment
    ? Math.min(Math.round((investment.currentlyRaised / investment.totalAmount) * 100), 100) : 0;

  const totals = {
    confirmed: payments.filter(p => p.paymentStatus === 'confirmed').reduce((s, p) => s + p.amount, 0),
    pending:   payments.filter(p => p.paymentStatus === 'pending').reduce((s, p) => s + p.amount, 0),
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href={`/admin/investments/${params.id}`} className="text-slate-400 hover:text-[#1E5FBE] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">
            {investment?.name || 'Investment'} — Payments
          </h1>
          <p className="text-slate-500 text-sm">Confirm payments to update the funding progress bar</p>
        </div>
        <button onClick={load} className="p-2 text-slate-400 hover:text-[#1E5FBE] transition-colors" title="Refresh">
          <RefreshCw size={17} />
        </button>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm py-2.5">
          <Plus size={15} />Record Payment
        </button>
      </div>

      {/* Funding summary */}
      {investment && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Target',  value: formatCurrency(investment.totalAmount, investment.currency), color: 'text-[#0B1F3A]' },
              { label: 'Confirmed',     value: formatCurrency(totals.confirmed, investment.currency),        color: 'text-green-600' },
              { label: 'Pending',       value: formatCurrency(totals.pending, investment.currency),          color: 'text-yellow-600' },
              { label: 'Remaining',     value: formatCurrency(Math.max(investment.totalAmount - investment.currentlyRaised, 0), investment.currency), color: 'text-slate-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-4 bg-slate-50 rounded-xl">
                <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
                <div className="text-slate-400 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-[#0B1F3A]">Funding Progress</span>
            <span className="text-[#1E5FBE] font-bold">{pct}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#1E5FBE] to-[#3B9EE0] rounded-full transition-all duration-1000"
              style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      {/* Add payment form */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-6 border border-[#1E5FBE]/20 shadow-md animate-fade-down">
          <h3 className="font-semibold text-[#0B1F3A] mb-4">Record New Payment</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Investor Name *</label><input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))} required className="form-input text-sm" /></div>
              <div><label className="form-label">Email *</label><input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} required className="form-input text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Phone</label><input value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="form-input text-sm" /></div>
              <div><label className="form-label">Company</label><input value={addForm.company} onChange={e => setAddForm(f => ({ ...f, company: e.target.value }))} className="form-input text-sm" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="form-label">Amount (₦) *</label><input type="number" min={1} value={addForm.amount} onChange={e => setAddForm(f => ({ ...f, amount: e.target.value }))} required className="form-input text-sm" /></div>
              <div><label className="form-label">Method</label>
                <select value={addForm.paymentMethod} onChange={e => setAddForm(f => ({ ...f, paymentMethod: e.target.value }))} className="form-input text-sm">
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online Payment</option>
                </select>
              </div>
              <div><label className="form-label">Reference</label><input value={addForm.paymentReference} onChange={e => setAddForm(f => ({ ...f, paymentReference: e.target.value }))} className="form-input text-sm" placeholder="Txn ID / ref" /></div>
            </div>
            <div><label className="form-label">Notes</label><textarea value={addForm.notes} onChange={e => setAddForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="form-input text-sm resize-none" /></div>
            {addError && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{addError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={addSaving} className="btn-primary text-sm">
                {addSaving ? 'Saving…' : 'Save as Pending'}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all','pending','confirmed','rejected'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize',
              filter === f ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-slate-200 text-slate-600 hover:border-[#0B1F3A]')}>
            {f === 'all' ? `All (${payments.length})` : `${f.charAt(0).toUpperCase()+f.slice(1)} (${payments.filter(p=>p.paymentStatus===f).length})`}
          </button>
        ))}
      </div>

      {/* Payments table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-[#1E5FBE] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-slate-400 text-sm">No {filter !== 'all' ? filter : ''} payments yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Investor','Amount','Method','Reference','Status','Date','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => {
                const { bg, Icon } = STATUS_STYLES[p.paymentStatus];
                return (
                  <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-[#0B1F3A]">{p.investor.name}</div>
                      <div className="text-xs text-slate-400">{p.investor.email}</div>
                      {p.investor.phone && <div className="text-xs text-slate-400">{p.investor.phone}</div>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-[#0B1F3A]">{formatCurrency(p.amount, p.currency)}</span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 capitalize">{p.paymentMethod?.replace('_',' ')}</td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-slate-500">{p.paymentReference || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', bg)}>
                        <Icon size={11} />
                        {p.paymentStatus.charAt(0).toUpperCase() + p.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">
                      {p.paymentDate ? formatDate(p.paymentDate) : formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      {p.paymentStatus === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const ref = window.prompt('Enter payment reference (optional):', p.paymentReference || '');
                              if (ref !== null) confirm(p._id, ref);
                            }}
                            disabled={confirming === p._id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50">
                            {confirming === p._id ? '…' : <><CheckCircle size={12} />Confirm</>}
                          </button>
                          <button onClick={() => reject(p._id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-medium rounded-lg transition-colors">
                            <XCircle size={12} />Reject
                          </button>
                        </div>
                      )}
                      {p.paymentStatus === 'confirmed' && (
                        <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                          <CheckCircle size={12} />Confirmed
                        </span>
                      )}
                      {p.paymentStatus === 'rejected' && (
                        <span className="text-xs text-red-400">Rejected</span>
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
