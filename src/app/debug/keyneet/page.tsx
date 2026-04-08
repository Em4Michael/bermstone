import { Suspense } from 'react';
import KeyneetClient from './KeyneetClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Keyneet Apartments — Bermstone' };

export default function KeyneetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-20 bg-[#FAFBFF] flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#1E5FBE] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Loading keyneets…</p>
          </div>
        </div>
      }
    >
      <KeyneetClient />
    </Suspense>
  );
}
