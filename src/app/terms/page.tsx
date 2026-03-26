import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Terms & Conditions' };
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-10 px-4"><div className="max-w-3xl mx-auto"><h1 className="font-display text-4xl font-semibold text-white mb-2">Terms &amp; Conditions</h1><p className="text-blue-200 text-sm">Last updated: March 2026</p></div></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-8 text-slate-600 leading-relaxed">
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">1. Acceptance of Terms</h2><p>By accessing and using Bermstone, you accept these Terms. If you do not agree, please do not use our services.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">2. Booking Terms</h2><p>A booking is confirmed only once you receive written confirmation from Bermstone. We reserve the right to decline any booking.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">3. Cancellations &amp; Refunds</h2><p>Cancellations 48+ hours before check-in are eligible for a full refund. Within 48 hours, a one-night fee is charged.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">4. Investment Disclaimer</h2><p>Investment information does not constitute financial advice. Returns are projected and not guaranteed. All investments carry risk.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">5. Governing Law</h2><p>These Terms are governed by the laws of the Federal Republic of Nigeria.</p></div>
      </div>
    </div>
  );
}
