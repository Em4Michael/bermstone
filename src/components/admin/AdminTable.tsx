import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface Props<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyField?: string;
}

export default function AdminTable<T extends Record<string, unknown>>({
  columns, data, loading, emptyMessage = 'No data found.', keyField = '_id',
}: Props<T>) {
  if (loading) return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-5 py-4 border-b border-slate-50 animate-pulse">
          {columns.map((c) => <div key={c.key} className="flex-1 h-4 bg-slate-100 rounded" />)}
        </div>
      ))}
    </div>
  );

  if (!data.length) return (
    <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
      <p className="text-slate-400 text-sm">{emptyMessage}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-x-auto shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            {columns.map((col) => (
              <th key={col.key} className={cn('text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider', col.className)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((row, i) => (
            <tr key={String(row[keyField] ?? i)} className="hover:bg-slate-50/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className={cn('px-5 py-3.5 text-[#0B1F3A]', col.className)}>
                  {col.render ? col.render(row) : String(row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
