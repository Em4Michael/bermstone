import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  Property, Investment, Booking, BookingPayload,
  InquiryPayload, Review, PropertyFilters, InvestmentFilters,
  PaginatedResponse, ApiResponse,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bermstone-server.onrender.com/api';


//'http://localhost:5000/api';



const api: AxiosInstance = axios.create({
  baseURL:  BASE_URL,
  headers:  { 'Content-Type': 'application/json' },
  timeout:  30000, // Render free tier can take ~30s on cold start
});

api.interceptors.request.use((cfg) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('bermstone_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError<{ message?: string }>) => {
    const config = err.config as (typeof err.config & { _retried?: boolean });
    // Auto-retry once on network error or timeout (handles Render cold-start)
    if (!config?._retried && (err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK' || !err.response)) {
      config._retried = true;
      // Wait 3s then retry
      await new Promise(r => setTimeout(r, 3000));
      return api(config);
    }
    return Promise.reject(new Error(err.response?.data?.message || err.message || 'Something went wrong'));
  }
);

export const propertiesApi = {
  getAll:    (p: PropertyFilters = {}) => api.get<PaginatedResponse<Property>>('/properties', { params: p }).then((r) => r.data),
  getOne:    (id: string)              => api.get<ApiResponse<Property>>(`/properties/${id}`).then((r) => r.data),
  getCities: ()                        => api.get<ApiResponse<string[]>>('/properties/meta/cities').then((r) => r.data),
  create:    (data: Partial<Property>) => api.post<ApiResponse<Property>>('/properties', data).then((r) => r.data),
  update:    (id: string, d: Partial<Property>) => api.put<ApiResponse<Property>>(`/properties/${id}`, d).then((r) => r.data),
  delete:    (id: string)              => api.delete(`/properties/${id}`).then((r) => r.data),
};

export const investmentsApi = {
  getAll:  (p: InvestmentFilters = {}) => api.get<PaginatedResponse<Investment>>('/investments', { params: p }).then((r) => r.data),
  getOne:  (id: string)                => api.get<ApiResponse<Investment>>(`/investments/${id}`).then((r) => r.data),
  create:  (data: Partial<Investment>) => api.post<ApiResponse<Investment>>('/investments', data).then((r) => r.data),
  update:  (id: string, d: Partial<Investment>) => api.put<ApiResponse<Investment>>(`/investments/${id}`, d).then((r) => r.data),
  delete:  (id: string)                => api.delete(`/investments/${id}`).then((r) => r.data),
};

export const bookingsApi = {
  create:        (data: BookingPayload) => api.post<ApiResponse<Booking>>('/bookings', data).then((r) => r.data),
  getByRef:      (ref: string)          => api.get<ApiResponse<Booking>>(`/bookings/${ref}`).then((r) => r.data),
  getMyBookings: ()                     => api.get<ApiResponse<Booking[]>>('/bookings').then((r) => r.data),
};

export const inquiriesApi = {
  submit: (data: InquiryPayload) => api.post<ApiResponse<{ id: string }>>('/inquiries', data).then((r) => r.data),
};

export const reviewsApi = {
  getForProperty: (id: string, page = 1) =>
    api.get<PaginatedResponse<Review>>('/reviews', { params: { property: id, page } }).then((r) => r.data),
  create: (data: Partial<Review> & { property: string }) =>
    api.post<ApiResponse<Review>>('/reviews', data).then((r) => r.data),
};

export const authApi = {
  register: (data: { firstName: string; lastName: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data).then((r) => r.data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  me: () => api.get('/auth/me').then((r) => r.data),
};

export default api;