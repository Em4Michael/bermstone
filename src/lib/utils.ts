import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'NGN'): string {
  const sym: Record<string, string> = { NGN: '₦', USD: '$', EUR: '€', GBP: '£' };
  const s = sym[currency] || currency;
  if (amount >= 1_000_000) return `${s}${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `${s}${(amount / 1_000).toFixed(0)}K`;
  return `${s}${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(date));
}

export function calcNights(checkIn: string | Date, checkOut: string | Date): number {
  return Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
}

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  skyscraper: 'Skyscraper', duplex: 'Duplex', flat: 'Flat / Apartment',
  hotel: 'Hotel', mixed_use: 'Mixed Use', commercial: 'Commercial',
  residential_complex: 'Residential Complex', other: 'Other',
};

export const STATUS_LABELS: Record<string, string> = {
  upcoming: 'Upcoming', active: 'Active', funded: 'Fully Funded', completed: 'Completed',
};

export const STATUS_COLORS: Record<string, string> = {
  upcoming:  'bg-sky-100 text-sky-700',
  active:    'bg-green-100 text-green-700',
  funded:    'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
};

export const AMENITY_ICONS: Record<string, string> = {
  'WiFi': '📶', 'Pool': '🏊', 'Gym': '🏋️', 'Parking': '🚗',
  'Air Conditioning': '❄️', 'Kitchen': '🍳', 'Washer': '🫧',
  'TV': '📺', 'Balcony': '🏠', 'Sea View': '🌊',
  'Generator': '⚡', 'Security': '🔐', 'Elevator': '🛗', 'Garden': '🌿',
};
