'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { propertiesApi } from '@/lib/api';
import type { Property } from '@/types';
import PropertyCard from '@/components/properties/PropertyCard';
import { cn } from '@/lib/utils';

const AMENITIES   = ['WiFi','Pool','Gym','Parking','Air Conditioning','Kitchen','Generator','Security','Balcony','Sea View'];
const SORT_OPTIONS = [
  { value: '',            label: 'Recommended' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Top Rated' },
  { value: 'newest',     label: 'Newest' },
];

export default function PropertiesClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [total,      setTotal]      = useState(0);
  const [pages,      setPages]      = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [showFilters, setShow]      = useState(false);
  const [page,       setPage]       = useState(1);

  const [filters, setFilters] = useState({
    city:      searchParams.get('city')      || '',
    minPrice:  searchParams.get('minPrice')  || '',
    maxPrice:  searchParams.get('maxPrice')  || '',
    bedrooms:  searchParams.get('bedrooms')  || '',
    maxGuests: searchParams.get('maxGuests') || '',
    amenities: searchParams.get('amenities') || '',
    sortBy:    searchParams.get('sortBy')    || '',
    search:    searchParams.get('search')    || '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12 };
      if (filters.city)      params.city      = filters.city;
      if (filters.minPrice)  params.minPrice  = Number(filters.minPrice);
      if (filters.maxPrice)  params.maxPrice  = Number(filters.maxPrice);
      if (filters.bedrooms)  params.bedrooms  = Number(filters.bedrooms);
      if (filters.maxGuests) params.maxGuests = Number(filters.maxGuests);
      if (filters.amenities) params.amenities = filters.amenities;
      if (filters.sortBy)    params.sortBy    = filters.sortBy;

      const res = await propertiesApi.getAll(params as never);
      let list   = res.data || [];

      // Client-side text search (matches your PropertiesClient approach)
      if (filters.search) {
        const term = filters.search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name?.toLowerCase().includes(term) ||
            p.location?.city?.toLowerCase().includes(term)
        );
      }

      setProperties(list);
      setTotal(res.pagination.total);
      setPages(res.pagination.pages);
    } catch (e) {
      console.error('Failed to load properties:', e);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { load(); }, [load]);

  const set = (key: string, val: string) => {
    setFilters((f) => ({ ...f, [key]: val }));
    setPage(1);
  };

  const toggleAmenity = (a: string) => {
    const list = filters.amenities ? filters.amenities.split(',') : [];
    const next = list.includes(a) ? list.filter((x) => x !== a) : [...list, a];
    set('amenities', next.join(','));
  };

  const clear = () => {
    setFilters({ city:'', minPrice:'', maxPrice:'', bedrooms:'', maxGuests:'', amenities:'', sortBy:'', search:'' });
    setPage(1);
  };

  const hasActive = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-[#FAFBFF] pt-20">
      {/* Header */}
      <div className="bg-[#0B1F3A] pt-14 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl font-semibold text-white mb-2">Shortlet Apartments</h1>
          <p className="text-blue-200 text-sm">
            {total > 0 ? `${total} properties available` : 'Browse our collection'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="bg-white rounded-2xl shadow-card border border-blue-50 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-3">

            {/* Text search */}
            <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                value={filters.search}
                onChange={(e) => set('search', e.target.value)}
                placeholder="Search by name or city..."
                className="flex-1 text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* City filter */}
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 md:w-44">
              <input
                value={filters.city}
                onChange={(e) => set('city', e.target.value)}
                placeholder="City"
                className="flex-1 text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Sort */}
            <div className="relative flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2.5 min-w-[180px]">
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
              <select
                value={filters.sortBy}
                onChange={(e) => set('sortBy', e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Toggle filters */}
            <button
              onClick={() => setShow(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors',
                showFilters
                  ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]'
                  : 'border-slate-200 text-slate-700 hover:border-[#1E5FBE]'
              )}
            >
              <SlidersHorizontal size={16} />
              Filters
              {hasActive && <span className="w-2 h-2 bg-[#C9A84C] rounded-full" />}
            </button>

            {hasActive && (
              <button onClick={clear} className="flex items-center gap-1 px-3 py-2.5 text-sm text-red-500 hover:text-red-700">
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Min Price (₦)</label>
                <input type="number" value={filters.minPrice} onChange={(e) => set('minPrice', e.target.value)} className="form-input" placeholder="30000" />
              </div>
              <div>
                <label className="form-label">Max Price (₦)</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => set('maxPrice', e.target.value)} className="form-input" placeholder="200000" />
              </div>
              <div>
                <label className="form-label">Min Bedrooms</label>
                <select value={filters.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} className="form-input">
                  <option value="">Any</option>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Min Guests</label>
                <select value={filters.maxGuests} onChange={(e) => set('maxGuests', e.target.value)} className="form-input">
                  <option value="">Any</option>
                  {[1,2,4,6,8,10].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </div>
              <div className="col-span-2 md:col-span-4">
                <label className="form-label">Amenities</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {AMENITIES.map((a) => {
                    const active = filters.amenities.split(',').includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
                          active
                            ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]'
                            : 'border-slate-200 text-slate-600 hover:border-[#1E5FBE]'
                        )}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick city tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['Port Harcourt','Lagos','Abuja','Lekki','Victoria Island'].map((c) => (
            <button
              key={c}
              onClick={() => set('city', filters.city === c ? '' : c)}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs border font-medium transition-all',
                filters.city === c
                  ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                  : 'border-slate-200 text-slate-600 hover:border-[#0B1F3A]'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-56" />
                <div className="p-5 space-y-3 bg-white">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏘️</div>
            <h3 className="font-display text-xl font-semibold text-[#0B1F3A] mb-2">No properties found</h3>
            <p className="text-slate-500 text-sm mb-5">Try adjusting your filters or search term.</p>
            <button onClick={clear} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">{properties.length} of {total} properties</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:border-[#1E5FBE] transition-colors">
                  Previous
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={cn('w-10 h-10 text-sm rounded-lg border transition-all',
                      p === page ? 'bg-[#1E5FBE] text-white border-[#1E5FBE]' : 'border-slate-200 hover:border-[#1E5FBE]')}>
                    {p}
                  </button>
                ))}
                <button disabled={page === pages} onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-200 disabled:opacity-40 hover:border-[#1E5FBE] transition-colors">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
