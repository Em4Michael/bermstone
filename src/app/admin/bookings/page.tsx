'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, CheckCircle, CreditCard, RefreshCw, Search, X } from 'lucide-react';
import api from '@/lib/api';
import type { Booking } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

const BOOKING_STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-600',
  completed: 'bg-blue-100   text-blue-700',
  no_show:   'bg-slate-100  text-slate-500',
};
const PAYMENT_COLORS: Record<string, string> = {
  unpaid:         'bg-red-100    text-red-600',
  partially_paid: 'bg-yellow-100 text-yellow-700',
  paid:           'bg-green-100  text-green-700',
  refunded:       'bg-slate-100  text-slate-500',
};

interface Property { _id: string; name: string; pricePerNight: number; currency: string; maxGuests: number; }

export default function AdminBookingsPage() {
  const [bookings,    setBookings]    = useState<Booking[]>([]);
  const [properties,  setProperties]  = useState<Property[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [filter,      setFilter]      = useState('');
  const [search,      setSearch]      = useState('');
  const [showAdd,     setShowAdd]     = useState(false);
  const [addSaving,   setAddSaving]   = useState(false);
  const [addError,    setAddError]    = useState('');

  // Payment confirm modal
  const [payModal,    setPayModal]    = useState<Booking | null>(null);
  const [payRef,      setPayRef]      = useState('');
  const [paySaving,   setPaySaving]   = useState(false);

  const [addForm, setAddForm] = useState({
    property: '', checkIn: '', checkOut: '', guests: '1',
    firstName: '', lastName: '', email: '', phone: '',
    totalAmount: '', paymentStatus: 'unpaid', specialRequests: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [bookRes, propRes] = await Promise.all([
        api.get('/bookings', { params: filter ? { status: filter } : {} }),
        api.get('/properties', { params: { limit: 100, admin: 'true' } }),
      ]);
      setBookings(bookRes.data.data || []);
      setProperties(propRes.data.data || []);
    } catch { setBookings([]); }
    finally  { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/bookings/${id}/status`, { status });
    load();
  };

  const confirmPayment = async () => {
    if (!payModal) return;
    setPaySaving(true);
    try {
      await api.patch(`/bookings/${payModal._id}/payment`, {
        paymentStatus:    'paid',
        paymentReference: payRef,
      });
      setPayModal(null); setPayRef('');
      load();
    } catch (e: unknown) { alert(e instanceof Error ? e.message : 'Failed'); }
    finally { setPaySaving(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddSaving(true); setAddError('');
    try {
      await api.post('/bookings/admin', {
        property:  addForm.property,
        checkIn:   addForm.checkIn,
        checkOut:  addForm.checkOut,
        guests:    Number(addForm.guests),
        guestInfo: {
          firstName: addForm.firstName,
          lastName:  addForm.lastName,
          email:     addForm.email,
          phone:     addForm.phone,
        },
        totalAmount:   addForm.totalAmount ? Number(addForm.totalAmount) : undefined,
        paymentStatus: addForm.paymentStatus,
        specialRequests: addForm.specialRequests,
      });
      setShowAdd(false);
      setAddForm({ property:'', checkIn:'', checkOut:'', guests:'1', firstName:'', lastName:'', email:'', phone:'', totalAmount:'', paymentStatus:'unpaid', specialRequests:'' });
      load();
    } catch (err: unknown) { setAddError(err instanceof Error ? err.message : 'Failed'); }
    finally { setAddSaving(false); }
  };

  const selectedProperty = properties.find(p => p._id === addForm.property);

  // Search filter
  const filtered = bookings.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.bookingReference?.toLowerCase().includes(q) ||
      b.guestInfo?.firstName?.toLowerCase().includes(q) ||
      b.guestInfo?.lastName?.toLowerCase().includes(q) ||
      b.guestInfo?.email?.toLowerCase().includes(q)
    );
  });

  // Stats
  const stats = {
    total:     bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    unpaid:    bookings.filter(b => b.paymentStatus === 'unpaid').length,
    revenue:   bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Bookings</h1>
          <p className="text-slate-500 text-sm">{bookings.length} total bookings</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2.5 text-slate-400 hover:text-[#1E5FBE] border border-slate-200 rounded-xl transition-colors">
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setShowAdd(!showAdd)} className="btn-primary text-sm py-2.5">
            <Plus size={15} />Add Booking
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total',     value: stats.total,     color: 'text-[#0B1F3A]' },
          { label: 'Pending',   value: stats.pending,   color: 'text-yellow-600' },
          { label: 'Confirmed', value: stats.confirmed, color: 'text-green-600' },
          { label: 'Unpaid',    value: stats.unpaid,    color: 'text-red-500' },
          { label: 'Revenue',   value: formatCurrency(stats.revenue, 'NGN'), color: 'text-[#1E5FBE]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
            <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
            <div className="text-slate-400 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Add booking form */}
      {showAdd && (
        <div className="bg-white rounded-2xl p-6 border border-[#1E5FBE]/20 shadow-md animate-fade-down">
          <h3 className="font-semibold text-[#0B1F3A] mb-4">Add Booking Manually</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="form-label">Property *</label>
                <select value={addForm.property} onChange={e => setAddForm(f => ({ ...f, property: e.target.value }))} required className="form-input text-sm">
                  <option value="">Select property</option>
                  {properties.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Guests</label>
                <input type="number" min={1} value={addForm.guests} onChange={e => setAddForm(f => ({ ...f, guests: e.target.value }))} className="form-input text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Check-in *</label><input type="date" required value={addForm.checkIn} onChange={e => setAddForm(f => ({ ...f, checkIn: e.target.value }))} className="form-input text-sm" /></div>
              <div><label className="form-label">Check-out *</label><input type="date" required value={addForm.checkOut} onChange={e => setAddForm(f => ({ ...f, checkOut: e.target.value }))} className="form-input text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">First Name *</label><input required value={addForm.firstName} onChange={e => setAddForm(f => ({ ...f, firstName: e.target.value }))} className="form-input text-sm" /></div>
              <div><label className="form-label">Last Name *</label><input required value={addForm.lastName} onChange={e => setAddForm(f => ({ ...f, lastName: e.target.value }))} className="form-input text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="form-label">Email *</label><input type="email" required value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} className="form-input text-sm" /></div>
              <div><label className="form-label">Phone *</label><input required value={addForm.phone} onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))} className="form-input text-sm" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="form-label">
                  Total Amount
                  {selectedProperty && <span className="text-slate-400 font-normal"> (₦{selectedProperty.pricePerNight.toLocaleString()}/night default)</span>}
                </label>
                <input type="number" min={0} value={addForm.totalAmount} onChange={e => setAddForm(f => ({ ...f, totalAmount: e.target.value }))} placeholder="Leave blank to auto-calculate" className="form-input text-sm" />
              </div>
              <div>
                <label className="form-label">Payment Status</label>
                <select value={addForm.paymentStatus} onChange={e => setAddForm(f => ({ ...f, paymentStatus: e.target.value }))} className="form-input text-sm">
                  <option value="unpaid">Unpaid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
            <div><label className="form-label">Special Requests</label><textarea value={addForm.specialRequests} onChange={e => setAddForm(f => ({ ...f, specialRequests: e.target.value }))} rows={2} className="form-input text-sm resize-none" /></div>
            {addError && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{addError}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={addSaving} className="btn-primary text-sm">{addSaving ? 'Saving…' : 'Create Booking'}</button>
              <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Payment confirm modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-scale-in">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-[#0B1F3A]">Confirm Payment</h3>
              <button onClick={() => setPayModal(null)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm space-y-1.5">
              <div className="flex justify-between"><span className="text-slate-500">Booking Ref</span><span className="font-mono font-semibold text-[#1E5FBE]">{payModal.bookingReference}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Guest</span><span className="font-medium">{payModal.guestInfo.firstName} {payModal.guestInfo.lastName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold text-green-600">{formatCurrency(payModal.totalAmount, payModal.currency)}</span></div>
            </div>
            <div className="mb-4">
              <label className="form-label">Payment Reference (optional)</label>
              <input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder="Bank ref / transaction ID" className="form-input text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={confirmPayment} disabled={paySaving}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50">
                {paySaving ? 'Confirming…' : <><CheckCircle size={16} />Mark as Paid</>}
              </button>
              <button onClick={() => setPayModal(null)} className="btn-secondary px-6">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white">
          <Search size={15} className="text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by reference, name or email…"
            className="flex-1 text-sm outline-none placeholder:text-slate-400 bg-transparent" />
          {search && <button onClick={() => setSearch('')}><X size={14} className="text-slate-400" /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('px-3 py-2.5 rounded-xl border text-sm capitalize transition-all',
                filter === s ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-slate-200 text-slate-600 hover:border-[#0B1F3A]')}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-4 border-b border-slate-50 animate-pulse">
              {Array.from({ length: 6 }).map((_, j) => <div key={j} className="flex-1 h-4 bg-slate-100 rounded" />)}
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-slate-400 text-sm">No bookings found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Reference','Guest','Property','Dates','Amount','Status','Payment','Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(b => (
                <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-[#1E5FBE] font-semibold">{b.bookingReference}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#0B1F3A] whitespace-nowrap">{b.guestInfo?.firstName} {b.guestInfo?.lastName}</div>
                    <div className="text-xs text-slate-400">{b.guestInfo?.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 whitespace-nowrap">
                      {(b.property as unknown as { name: string })?.name || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                    <div>{formatDate(b.checkIn)}</div>
                    <div className="text-slate-300">→ {formatDate(b.checkOut)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-[#0B1F3A]">{formatCurrency(b.totalAmount, b.currency)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select value={b.status} onChange={e => updateStatus(b._id, e.target.value)}
                      className={cn('text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer appearance-none',
                        BOOKING_STATUS_COLORS[b.status] || 'bg-slate-100')}>
                      {['pending','confirmed','cancelled','completed','no_show'].map(s => (
                        <option key={s} value={s}>{s.replace('_',' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('badge text-xs', PAYMENT_COLORS[b.paymentStatus] || 'bg-slate-100')}>
                      {b.paymentStatus?.replace('_',' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.paymentStatus !== 'paid' && b.paymentStatus !== 'refunded' && (
                      <button
                        onClick={() => { setPayModal(b); setPayRef(''); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition-colors whitespace-nowrap">
                        <CreditCard size={11} />Confirm Pay
                      </button>
                    )}
                    {b.paymentStatus === 'paid' && (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={11} />Paid
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
