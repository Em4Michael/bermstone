'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Trash2, Eye, Pencil, Star } from 'lucide-react';
import api from '@/lib/api';
import type { Property } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading,    setLoading]    = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties', { params: { limit: 100 } });
      setProperties(res.data.data);
    } catch { setProperties([]); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleFeatured = async (id: string, cur: boolean) => {
    await api.put(`/properties/${id}`, { isFeatured: !cur });
    load();
  };

  const toggleActive = async (id: string, cur: boolean) => {
    await api.put(`/properties/${id}`, { isActive: !cur });
    load();
  };

  const deleteProperty = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.delete(`/properties/${id}`);
    load();
  };

  const columns = [
    {
      key: 'name',
      label: 'Property',
      render: (row: Property) => (
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0">
            {row.coverImage
              ? <Image src={row.coverImage} alt={row.name} fill className="object-cover" />
              : <div className="w-full h-full bg-slate-100" />}
          </div>
          <div>
            <div className="font-medium text-[#0B1F3A]">{row.name}</div>
            <div className="text-xs text-slate-400">{row.location?.city}, {row.location?.state}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'pricePerNight',
      label: 'Price/Night',
      render: (row: Property) => (
        <span className="font-semibold">{formatCurrency(row.pricePerNight, row.currency)}</span>
      ),
    },
    {
      key: 'bedrooms',
      label: 'Beds',
      render: (row: Property) => <span>{row.bedrooms} bd</span>,
    },
    {
      key: 'averageRating',
      label: 'Rating',
      render: (row: Property) =>
        row.totalReviews > 0 ? (
          <span className="flex items-center gap-1">
            <Star size={12} className="fill-[#C9A84C] text-[#C9A84C]" />
            {row.averageRating.toFixed(1)} ({row.totalReviews})
          </span>
        ) : (
          <span className="text-slate-400 text-xs">No reviews</span>
        ),
    },
    {
      key: 'isFeatured',
      label: 'Featured',
      render: (row: Property) => (
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
      label: 'Status',
      render: (row: Property) => (
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
      render: (row: Property) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/properties/${row._id}`}
            target="_blank"
            className="p-1.5 text-slate-400 hover:text-[#1E5FBE] transition-colors"
            title="View on site"
          >
            <Eye size={15} />
          </Link>
          <Link
            href={`/admin/properties/${row._id}`}
            className="p-1.5 text-slate-400 hover:text-[#1E5FBE] transition-colors"
            title="Edit property"
          >
            <Pencil size={15} />
          </Link>
          <button
            onClick={() => deleteProperty(row._id, row.name)}
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
          <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Properties</h1>
          <p className="text-slate-500 text-sm">{properties.length} shortlet properties</p>
        </div>
        <Link href="/admin/properties/new" className="btn-primary text-sm py-2.5 px-5">
          <Plus size={15} /> Add Property
        </Link>
      </div>

      <AdminTable
        columns={columns as never[]}
        data={properties as never[]}
        loading={loading}
        emptyMessage="No properties yet. Add your first one."
      />
    </div>
  );
}