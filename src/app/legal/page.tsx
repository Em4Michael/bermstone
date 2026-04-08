import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Legal Notice' };
export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-10 px-4"><div className="max-w-3xl mx-auto"><h1 className="font-display text-4xl font-semibold text-white mb-2">Legal Notice</h1></div></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-8 text-slate-600 leading-relaxed">
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">Company Information</h2><p><strong>Bermstone Real Estate Ltd</strong><br />Registered in the Federal Republic of Morocco<br />Registered Address: Marrakech, Marrakech-Safi, Morocco</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">Disclaimer</h2><p>The information on this website is for general informational purposes only. We make no warranties about completeness or accuracy of the content.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">Investment Disclaimer</h2><p>Investment information does not constitute financial advice. Past performance is not indicative of future results.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">Contact</h2><p>Email: <a href="mailto:Realdelly@yahoo.com" className="text-[#1E5FBE]">Realdelly@yahoo.com</a></p></div>
      </div>
    </div>
  );
}