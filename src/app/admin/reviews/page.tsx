'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { Review } from '@/types';
import { formatDate, cn } from '@/lib/utils';
import AdminTable from '@/components/admin/AdminTable';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews', { params: { limit: 100 } });
      setReviews(res.data.data);
    } catch { setReviews([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const togglePublish = async (id: string) => {
    await api.patch(`/reviews/${id}/publish`); load();
  };
  const del = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await api.delete(`/reviews/${id}`); load();
  };

  const columns = [
    { key: 'reviewer', label: 'Reviewer', render: (row: Review) => (
      <div>
        <div className="font-medium text-[#0B1F3A]">{row.reviewer.name}</div>
        <div className="text-xs text-slate-400">{row.reviewer.country}</div>
      </div>
    ) },
    { key: 'rating', label: 'Rating', render: (row: Review) => (
      <span className="flex items-center gap-1 text-sm">{'★'.repeat(row.rating)}<span className="text-slate-300">{'★'.repeat(5 - row.rating)}</span></span>
    ) },
    { key: 'comment', label: 'Comment', render: (row: Review) => (
      <p className="text-xs text-slate-600 max-w-sm line-clamp-2">{row.comment}</p>
    ) },
    { key: 'isPublished', label: 'Published', render: (row: Review) => (
      <button onClick={() => togglePublish(row._id)}
        className={cn('badge cursor-pointer', row.isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
        {row.isPublished ? 'Published' : 'Hidden'}
      </button>
    ) },
    { key: 'createdAt', label: 'Date', render: (row: Review) => <span className="text-xs text-slate-400">{formatDate(row.createdAt)}</span> },
    { key: 'actions', label: 'Actions', render: (row: Review) => (
      <button onClick={() => del(row._id)} className="text-xs text-red-400 hover:text-red-600 font-medium">Delete</button>
    ) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#0B1F3A]">Reviews</h1>
        <p className="text-slate-500 text-sm">{reviews.length} total reviews</p>
      </div>
      <AdminTable columns={columns as never[]} data={reviews as never[]} loading={loading} emptyMessage="No reviews yet." />
    </div>
  );
}
