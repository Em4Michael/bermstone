import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Privacy Policy' };
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      <div className="bg-[#0B1F3A] pt-14 pb-10 px-4"><div className="max-w-3xl mx-auto"><h1 className="font-display text-4xl font-semibold text-white mb-2">Privacy Policy</h1><p className="text-blue-200 text-sm">Last updated: March 2026</p></div></div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-8 text-slate-600 leading-relaxed">
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">1. Information We Collect</h2><p>We collect information you provide when making a booking or submitting an inquiry — including name, email, phone, and payment details.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">2. How We Use Your Information</h2><p>We use your information to process bookings, respond to inquiries, and improve our services. We do not sell your personal data.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">3. Data Security</h2><p>All data is encrypted in transit. Passwords are hashed. We follow industry best practices for data security.</p></div>
        <div><h2 className="font-display text-xl font-semibold text-[#0B1F3A] mb-3">4. Your Rights</h2><p>You have the right to access, correct, or delete your personal data. Contact us at <a href="mailto:privacy@bermstone.com" className="text-[#1E5FBE]">privacy@bermstone.com</a>.</p></div>
      </div>
    </div>
  );
}
