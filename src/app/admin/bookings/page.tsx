'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Booking } from '@/types';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import AdminTable from '@/components/admin/AdminTable';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100  text-green-700',
  cancelled: 'bg-red-100    text-red-700',
  completed: 'bg-blue-100   text-blue-700',
  no_show:   'bg-slate-100  text-slate-600',
};
const PAY_COLORS: Record<string, string> = {
  unpaid:         'bg-red-100    text-red-700',
  partially_paid: 'bg-yellow-100 text-yellow-700',
  paid:           'bg-green-100  text-green-700',
  refunded:       'bg-slate-100  text-slate-600',
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings', { params: filter ? { status: filter } : {} });
      setBookings(res.data.data);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/bookings/${id}/status`, { status }); load();
  };

  const columns = [
    { key: 'bookingReference', label: 'Reference', render: (row: Booking) => <span className="font-mono text-xs text-[#1E5FBE] font-semibold">{row.bookingReference}</span> },
    { key: 'property', label: 'Property', render: (row: Booking) => <span className="font-medium">{(row.property as unknown as { name: string })?.name || '—'}</span> },
    { key: 'guestInfo', label: 'Guest', render: (row: Booking) => (
      <div>
        <div className="font-medium">{row.guestInfo.firstName} {row.guestInfo.lastName}</div>
        <div className="text-xs text-slate-400">{row.guestInfo.email}</div>
      </div>
    ) },
    { key: 'checkIn', label: 'Dates', render: (row: Booking) => (
      <div className="text-xs">
        <div>{formatDate(row.checkIn)}</div>
        <div className="text-slate-400">→ {formatDate(row.checkOut)}</div>
      </div>
    ) },
    { key: 'totalAmount', label: 'Total', render: (row: Booking) => <span className="font-semibold">{formatCurrency(row.totalAmount, row.currency)}</span> },
    { key: 'status', label: 'Status', render: (row: Booking) => (
      <select value={row.status} onChange={(e) => updateStatus(row._id, e.target.value)}
        className={cn('text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer', STATUS_COLORS[row.status] || 'bg-slate-100')}>
        {['pending','confirmed','cancelled','completed','no_show'].map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
      </select>
    ) },
    { key: 'paymentStatus', label: 'Payment', render: (row: Booking) => (
      <span className={cn('badge', PAY_COLORS[row.paymentStatus] || 'bg-slate-100')}>{row.paymentStatus?.replace('_',' ')}</span>
    ) },
    { key: 'createdAt', label: 'Created', render: (row: Booking) => <span className="text-xs text-slate-400">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Bookings</h1>
        <p className="text-slate-500 text-sm">{bookings.length} total bookings</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['','pending','confirmed','cancelled','completed'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-4 py-1.5 rounded-full text-sm border capitalize transition-all',
              filter === s ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]' : 'border-slate-200 text-slate-600 hover:border-[#1E5FBE]')}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <AdminTable columns={columns as never[]} data={bookings as never[]} loading={loading} emptyMessage="No bookings found." />
    </div>
  );
}
