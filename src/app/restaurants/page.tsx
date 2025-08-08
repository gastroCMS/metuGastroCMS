'use client';

import { BaseLayout } from '@/components/BaseLayout';
import { RestaurantCard } from '@/components/RestaurantCard';
import { RestaurantFilter } from '@/components/RestaurantFilter';
import { Pagination } from '@/components/Pagination';
import { RestaurantListSkeleton } from '@/components/SkeletonLoader';
import { RestaurantMapView } from '@/components/RestaurantMapView';
import { mockData } from '@/lib/mockData';
import { useState, useMemo, useEffect } from 'react';

export default function RestaurantsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    cuisineType: '',
    district: '',
    minRating: 0,
    priceRange: '',
    searchQuery: '',
  });
  const [isLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const itemsPerPage = 9;

  // Extract unique cuisine types and districts for filter options
  const cuisineTypes = useMemo(() => {
    const types = [...new Set(mockData.restaurants.map(r => r.cuisine_type))];
    return types.sort();
  }, []);

  const districts = useMemo(() => {
    const districts = [...new Set(mockData.restaurants.map(r => r.district))];
    return districts.sort();
  }, []);

  // Filter restaurants based on current filters
  const filteredRestaurants = useMemo(() => {
    return mockData.restaurants.filter(restaurant => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.description?.toLowerCase().includes(query) ||
          restaurant.cuisine_type.toLowerCase().includes(query) ||
          restaurant.district.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Cuisine type filter
      if (
        filters.cuisineType &&
        restaurant.cuisine_type !== filters.cuisineType
      ) {
        return false;
      }

      // District filter
      if (filters.district && restaurant.district !== filters.district) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && restaurant.rating < filters.minRating) {
        return false;
      }

      // Price range filter
      if (filters.priceRange && restaurant.price_range !== filters.priceRange) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Paginate filtered results
  const paginatedRestaurants = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRestaurants.slice(startIndex, endIndex);
  }, [filteredRestaurants, currentPage]);

  const totalPages = Math.ceil(filteredRestaurants.length / itemsPerPage);

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  if (!isClient) {
    return (
      <BaseLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RestaurantListSkeleton />
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Restoranlar</h1>
          <p className="text-gray-600">
            Ankara&apos;daki en iyi restoranları keşfedin ve deneyimlerinizi
            paylaşın
          </p>
        </div>

        {/* Filters */}
        <RestaurantFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          cuisineTypes={cuisineTypes}
          districts={districts}
        />

        {/* Results Count and View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredRestaurants.length} restoran bulundu
          </p>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Liste
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
                />
              </svg>
              Harita
            </button>
          </div>
        </div>

        {/* Restaurant Content */}
        {isLoading ? (
          <RestaurantListSkeleton />
        ) : (
          <>
            {viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedRestaurants.map(restaurant => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      totalItems={filteredRestaurants.length}
                      itemsPerPage={itemsPerPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="mb-6">
                <RestaurantMapView
                  restaurants={filteredRestaurants}
                  height="600px"
                  showPopup={true}
                  className="w-full"
                />
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!isLoading && filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Restoran bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun restoran bulunamadı. Filtreleri
              değiştirmeyi deneyin.
            </p>
          </div>
        )}
      </div>
    </BaseLayout>
  );
}
