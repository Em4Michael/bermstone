'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQS = [
  { cat: 'Keyneets & Booking', items: [
    { q: 'How do I book a keyneet apartment?', a: 'Browse our properties, select your apartment, choose dates and guests, then fill in your details. Our team confirms within a few hours.' },
    { q: 'What is included in the nightly rate?', a: 'All properties include WiFi, electricity, and water. Specific amenities are listed on each property page.' },
    { q: 'What is your cancellation policy?', a: 'Cancellations 48+ hours before check-in receive a full refund. Within 48 hours, a one-night fee is charged.' },
  ]},
  { cat: 'Investments', items: [
    { q: 'How do I invest in a Bermstone project?', a: 'Browse the Investments page, select a project, review the business and building plans, then submit an expression of interest.' },
    { q: 'What is the minimum investment amount?', a: 'Minimum amounts vary by project, starting from MAD 2,000,000. Each listing clearly states the minimum.' },
    { q: 'Are my investments secure?', a: 'All projects are legally structured with proper documentation. Investors receive formal agreements and regular progress reports.' },
  ]},
  { cat: 'Property Owners', items: [
    { q: 'How do I list my property with Bermstone?', a: 'Visit the Owner Support page, submit your property details, and our team will be in touch within 48 hours.' },
    { q: 'Will I still have access to my property?', a: 'Yes. You retain full ownership and can request blackout dates for personal use with appropriate notice.' },
  ]},
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-left gap-4 group">
        <span className="font-medium text-sm text-[#0B1F3A] group-hover:text-[#1E5FBE] transition-colors">{q}</span>
        <ChevronDown size={16} className={cn('shrink-0 text-slate-400 transition-transform', open && 'rotate-180 text-[#1E5FBE]')} />
      </button>
      <div className={cn('overflow-hidden transition-all duration-300', open ? 'max-h-48 pb-4' : 'max-h-0')}>
        <p className="text-slate-500 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-label text-[#3B9EE0]">FAQs</span>
          <h1 className="font-display text-4xl font-semibold text-white mt-2 mb-3">Frequently Asked Questions</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
        <div className="space-y-10">
          {FAQS.map(({ cat, items }) => (
            <div key={cat}>
              <h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-1 pb-3 border-b-2 border-[#1E5FBE]/20">{cat}</h2>
              <div className="bg-white rounded-xl shadow-card divide-y divide-slate-50 px-6">
                {items.map((item) => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12 bg-[#EBF2FF] rounded-2xl p-8">
          <h3 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm mb-5">Our team is happy to help.</p>
          <a href="/contact" className="btn-primary inline-flex">Contact Us</a>
        </div>
      </div>
    </div>
  );
}
