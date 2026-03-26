// ─── Property ─────────────────────────────────────────────────────
export interface PropertyImage {
  url: string;
  publicId?: string;
  caption?: string;
}
export interface Discount {
  label: string;
  percentage: number;
  minNights: number;
}
export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}
export interface Property {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  location: PropertyLocation;
  pricePerNight: number;
  currency: string;
  discounts: Discount[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  rules: string[];
  images: PropertyImage[];
  coverImage: string;
  bookingLink?: string;
  isFeatured: boolean;
  isActive: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Investment ────────────────────────────────────────────────────
export type ProjectType = 'skyscraper' | 'duplex' | 'flat' | 'hotel' | 'mixed_use' | 'commercial' | 'residential_complex' | 'other';
export type ProjectStatus = 'upcoming' | 'active' | 'funded' | 'completed';

export interface Investment {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  location: { address: string; city: string; state: string; country: string };
  totalAmount: number;
  minimumInvestment: number;
  currentlyRaised: number;
  currency: string;
  projectType: ProjectType;
  status: ProjectStatus;
  projectPeriod: { startDate: string; endDate: string; durationMonths: number };
  expectedROI: number;
  businessPlan?: string;
  buildingPlan?: string;
  images: { url: string; publicId?: string }[];
  coverImage: string;
  similarProjects: Investment[];
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

// ─── Booking ──────────────────────────────────────────────────────
export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
export interface BookingPayload {
  property: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestInfo: GuestInfo;
  specialRequests?: string;
}
export interface Booking {
  _id: string;
  property: Property;
  guestInfo: GuestInfo;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  bookingReference: string;
  externalBookingLink?: string;
  createdAt: string;
}

// ─── Inquiry ──────────────────────────────────────────────────────
export type InquiryType = 'owner_listing' | 'investor' | 'general_contact';
export interface InquiryPayload {
  type: InquiryType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  propertyDetails?: {
    propertyName?: string;
    address?: string;
    city?: string;
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
  };
  investmentDetails?: {
    investmentAmount?: number;
    projectOfInterest?: string;
    timeline?: string;
  };
}
export interface Inquiry {
  _id: string;
  type: InquiryType;
  status: 'new' | 'in_review' | 'contacted' | 'closed';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ───────────────────────────────────────────────────────
export interface Review {
  _id: string;
  property: string;
  reviewer: { name: string; email: string; country?: string; avatar?: string };
  rating: number;
  title?: string;
  comment: string;
  categories: { cleanliness: number; location: number; value: number; communication: number; accuracy: number };
  isPublished: boolean;
  createdAt: string;
}

// ─── Auth ─────────────────────────────────────────────────────────
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'guest' | 'owner' | 'investor' | 'admin';
  phone?: string;
  avatar?: string;
}

// ─── API Responses ────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: { page: number; limit: number; total: number; pages: number };
}

// ─── Filters ──────────────────────────────────────────────────────
export interface PropertyFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  maxGuests?: number;
  amenities?: string;
  sortBy?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}
export interface InvestmentFilters {
  status?: ProjectStatus;
  projectType?: ProjectType;
  featured?: boolean;
  page?: number;
  limit?: number;
}
