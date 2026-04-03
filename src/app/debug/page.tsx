'use client';
import { useState, useEffect } from 'react';

interface Check {
  label: string;
  status: 'loading' | 'ok' | 'error' | 'warn';
  detail: string;
}

export default function DebugPage() {
  const [checks, setChecks] = useState<Check[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '(not set — using fallback)';
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://bermstone-server.onrender.com/api';

    const results: Check[] = [
      {
        label:  'NEXT_PUBLIC_API_URL env var',
        status: process.env.NEXT_PUBLIC_API_URL ? 'ok' : 'warn',
        detail: apiUrl,
      },
    ];

    setChecks([
      ...results,
      { label: 'Checking backend /health…', status: 'loading', detail: backendUrl.replace('/api', '/health') },
      { label: 'Checking /api/properties…', status: 'loading', detail: `${backendUrl}/properties?limit=1` },
      { label: 'Checking /api/investments…', status: 'loading', detail: `${backendUrl}/investments?limit=1` },
    ]);

    // Test backend health
    fetch(backendUrl.replace('/api', '/health'))
      .then(r => r.json())
      .then(data => {
        setChecks(prev => prev.map(c =>
          c.label.includes('/health')
            ? { ...c, status: 'ok', detail: `✅ ${data.message} — env: ${data.env}` }
            : c
        ));
      })
      .catch(err => {
        setChecks(prev => prev.map(c =>
          c.label.includes('/health')
            ? { ...c, status: 'error', detail: `❌ ${err.message}` }
            : c
        ));
      });

    // Test properties endpoint
    fetch(`${backendUrl}/properties?limit=1`)
      .then(r => r.json())
      .then(data => {
        setChecks(prev => prev.map(c =>
          c.label.includes('/api/properties')
            ? { ...c, status: data.success ? 'ok' : 'error', detail: data.success ? `✅ ${data.pagination?.total ?? 0} properties in DB` : `❌ ${data.message}` }
            : c
        ));
      })
      .catch(err => {
        setChecks(prev => prev.map(c =>
          c.label.includes('/api/properties')
            ? { ...c, status: 'error', detail: `❌ ${err.message}` }
            : c
        ));
      });

    // Test investments endpoint
    fetch(`${backendUrl}/investments?limit=1`)
      .then(r => r.json())
      .then(data => {
        setChecks(prev => prev.map(c =>
          c.label.includes('/api/investments')
            ? { ...c, status: data.success ? 'ok' : 'error', detail: data.success ? `✅ ${data.pagination?.total ?? 0} investments in DB` : `❌ ${data.message}` }
            : c
        ));
      })
      .catch(err => {
        setChecks(prev => prev.map(c =>
          c.label.includes('/api/investments')
            ? { ...c, status: 'error', detail: `❌ ${err.message}` }
            : c
        ));
      });
  }, []);

  const COLOR: Record<string, string> = {
    loading: 'bg-slate-100 text-slate-500',
    ok:      'bg-green-100 text-green-700',
    error:   'bg-red-100   text-red-700',
    warn:    'bg-yellow-100 text-yellow-700',
  };
  const ICON: Record<string, string> = {
    loading: '⏳', ok: '✅', error: '❌', warn: '⚠️',
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-semibold text-[#0B1F3A] mb-2">API Diagnostics</h1>
        <p className="text-slate-500 text-sm mb-8">Run this page to diagnose why data isn&apos;t loading.</p>

        <div className="space-y-3">
          {checks.map((check, i) => (
            <div key={i} className={`rounded-xl p-4 border ${COLOR[check.status]} border-current/20`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{ICON[check.status]}</span>
                <div>
                  <div className="font-semibold text-sm">{check.label}</div>
                  <div className="text-xs mt-0.5 font-mono opacity-80 break-all">{check.detail}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-white rounded-2xl p-6 border border-slate-200">
          <h2 className="font-semibold text-[#0B1F3A] mb-4">Fix Checklist</h2>
          <ol className="space-y-3 text-sm text-slate-600">
            {[
              ['Render env vars set?', 'Dashboard → your service → Environment: MONGO_URI, JWT_SECRET, CLIENT_URL, NODE_ENV=production, PORT=5000'],
              ['CLIENT_URL correct?', 'Must be exactly: https://bermstone.vercel.app (no trailing slash)'],
              ['nodemailer installed?', 'SSH into Render or trigger a redeploy after adding nodemailer to package.json'],
              ['Vercel env var set?', 'Vercel → Project → Settings → Environment Variables: NEXT_PUBLIC_API_URL = https://bermstone-server.onrender.com/api'],
              ['Backend awake?', 'Render free tier sleeps after 15min. First request takes ~30s. Upgrade or use a cron to ping /health every 10min'],
              ['DB seeded?', 'Run: cd backend && node src/seed.js (requires MONGO_URI in .env)'],
            ].map(([title, desc], i) => (
              <li key={i} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-[#1E5FBE] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <div>
                  <strong className="text-[#0B1F3A]">{title}</strong>
                  <br /><span className="text-slate-400 text-xs">{desc}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}