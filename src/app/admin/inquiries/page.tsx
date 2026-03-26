'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Inquiry } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import AdminTable from '@/components/admin/AdminTable';

const TYPE_LABELS: Record<string, string>   = { owner_listing: 'Owner Listing', investor: 'Investor', general_contact: 'General Contact' };
const STATUS_COLORS: Record<string, string> = { new: 'bg-blue-100 text-blue-700', in_review: 'bg-yellow-100 text-yellow-700', contacted: 'bg-green-100 text-green-700', closed: 'bg-slate-100 text-slate-500' };

export default function AdminInquiriesPage() {
  const [inquiries,    setInquiries]    = useState<Inquiry[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [typeFilter,   setTypeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expanded,     setExpanded]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (typeFilter)   params.type   = typeFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/inquiries', { params });
      setInquiries(res.data.data);
    } catch { setInquiries([]); }
    finally { setLoading(false); }
  }, [typeFilter, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await api.patch(`/inquiries/${id}`, { status }); load();
  };

  const columns = [
    { key: 'type', label: 'Type', render: (row: Inquiry) => (
      <span className={cn('badge', row.type === 'investor' ? 'bg-[#C9A84C] text-white' : row.type === 'owner_listing' ? 'bg-[#1E5FBE] text-white' : 'bg-slate-100 text-slate-600')}>
        {TYPE_LABELS[row.type] || row.type}
      </span>
    ) },
    { key: 'name', label: 'Contact', render: (row: Inquiry) => (
      <div>
        <div className="font-medium text-[#0B1F3A]">{row.firstName} {row.lastName}</div>
        <div className="text-xs text-slate-400">{row.email}</div>
        <div className="text-xs text-slate-400">{row.phone}</div>
      </div>
    ) },
    { key: 'message', label: 'Message', render: (row: Inquiry) => (
      <div className="max-w-xs">
        <p className="text-xs text-slate-500 line-clamp-1">{row.message}</p>
        <button onClick={() => setExpanded(expanded === row._id ? null : row._id)} className="text-[#1E5FBE] text-xs mt-0.5 hover:underline">
          {expanded === row._id ? 'Show less' : 'Read more'}
        </button>
        {expanded === row._id && <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{row.message}</p>}
      </div>
    ) },
    { key: 'status', label: 'Status', render: (row: Inquiry) => (
      <select value={row.status} onChange={(e) => updateStatus(row._id, e.target.value)}
        className={cn('text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer', STATUS_COLORS[row.status] || 'bg-slate-100')}>
        {['new','in_review','contacted','closed'].map((s) => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
      </select>
    ) },
    { key: 'createdAt', label: 'Date', render: (row: Inquiry) => <span className="text-xs text-slate-400">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Inquiries</h1>
        <p className="text-slate-500 text-sm">{inquiries.length} inquiries</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {['','owner_listing','investor','general_contact'].map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={cn('px-3 py-1.5 rounded-full text-xs border transition-all',
                typeFilter === t ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]' : 'border-slate-200 text-slate-600 hover:border-[#1E5FBE]')}>
              {t ? TYPE_LABELS[t] : 'All Types'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {['','new','in_review','contacted','closed'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn('px-3 py-1.5 rounded-full text-xs border capitalize transition-all',
                statusFilter === s ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]' : 'border-slate-200 text-slate-600 hover:border-slate-400')}>
              {s || 'All Status'}
            </button>
          ))}
        </div>
      </div>
      <AdminTable columns={columns as never[]} data={inquiries as never[]} loading={loading} emptyMessage="No inquiries yet." />
    </div>
  );
}
