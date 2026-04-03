'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Eye, Pencil, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import type { Investment } from '@/types';
import { formatCurrency, PROJECT_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS, cn } from '@/lib/utils';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading,     setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/investments', { params: { limit: 100, admin: 'true' } });
      setInvestments(res.data.data);
    } catch { setInvestments([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleFeatured = async (id: string, cur: boolean) => {
    await api.put(`/investments/${id}`, { isFeatured: !cur });
    load();
  };

  const toggleActive = async (id: string, cur: boolean) => {
    await api.put(`/investments/${id}`, { isActive: !cur });
    load();
  };

  const del = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/investments/${id}`);
    load();
  };

  const columns = [
    {
      key: 'name',
      label: 'Project',
      render: (row: Investment) => (
        <div>
          <div className="font-medium text-[#0B1F3A]">{row.name}</div>
          <div className="text-xs text-slate-400">
            {row.location?.city} · {PROJECT_TYPE_LABELS[row.projectType]}
          </div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total Target',
      render: (row: Investment) => (
        <span className="font-semibold">{formatCurrency(row.totalAmount, row.currency)}</span>
      ),
    },
    {
      key: 'minimumInvestment',
      label: 'Min. Invest',
      render: (row: Investment) => formatCurrency(row.minimumInvestment, row.currency),
    },
    {
      key: 'expectedROI',
      label: 'ROI',
      render: (row: Investment) => (
        <span className="text-[#1E5FBE] font-semibold">{row.expectedROI}%</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: Investment) => (
        <span className={cn('badge', STATUS_COLORS[row.status] || 'bg-slate-100 text-slate-600')}>
          {STATUS_LABELS[row.status]}
        </span>
      ),
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (row: Investment) => (
        <button
          onClick={() => toggleFeatured(row._id, row.isFeatured)}
          className={cn('badge cursor-pointer', row.isFeatured ? 'bg-[#C9A84C] text-white' : 'bg-slate-100 text-slate-500')}
        >
          {row.isFeatured ? 'Featured' : 'Normal'}
        </button>
      ),
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: Investment) => (
        <button
          onClick={() => toggleActive(row._id, row.isActive)}
          className={cn('badge cursor-pointer', row.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}
        >
          {row.isActive ? 'Active' : 'Hidden'}
        </button>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: Investment) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/investments/${row._id}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-[#1E5FBE] transition-colors"
            title="View on site"
          >
            <Eye size={15} />
          </Link>
          <Link
            href={`/admin/investments/${row._id}`}
            className="p-1.5 text-slate-400 hover:text-[#1E5FBE] transition-colors"
            title="Edit investment"
          >
            <Pencil size={15} />
          </Link>
          <Link
            href={`/admin/investments/${row._id}/payments`}
            className="p-1.5 text-slate-400 hover:text-green-600 transition-colors"
            title="View payments"
          >
            <CreditCard size={15} />
          </Link>
          <button
            onClick={() => del(row._id, row.name)}
            className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Investments</h1>
          <p className="text-slate-500 text-sm">{investments.length} investment projects</p>
        </div>
        <Link href="/admin/investments/new" className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> Add Investment
        </Link>
      </div>

      <AdminTable
        columns={columns as never[]}
        data={investments as never[]}
        loading={loading}
        emptyMessage="No investment projects yet."
      />
    </div>
  );
}
