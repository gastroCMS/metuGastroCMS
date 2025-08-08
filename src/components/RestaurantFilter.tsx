'use client'

import { useState } from 'react'

interface FilterOptions {
  cuisineType: string
  district: string
  minRating: number
  priceRange: string
  searchQuery: string
}

interface RestaurantFilterProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  cuisineTypes: string[]
  districts: string[]
}

export function RestaurantFilter({ 
  filters, 
  onFiltersChange, 
  cuisineTypes, 
  districts 
}: RestaurantFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      cuisineType: '',
      district: '',
      minRating: 0,
      priceRange: '',
      searchQuery: ''
    })
  }

  const hasActiveFilters = filters.cuisineType || filters.district || filters.minRating > 0 || filters.priceRange

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Restoran, mutfak veya konum ara..."
            value={filters.searchQuery}
            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
        <div className="flex items-center space-x-4">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              Filtreleri Temizle
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <span>{isExpanded ? 'Gizle' : 'Göster'}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.cuisineType && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
              {filters.cuisineType}
              <button
                onClick={() => handleFilterChange('cuisineType', '')}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.district && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
              {filters.district}
              <button
                onClick={() => handleFilterChange('district', '')}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.minRating > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
              {filters.minRating}+ yıldız
              <button
                onClick={() => handleFilterChange('minRating', 0)}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.priceRange && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-800">
              {filters.priceRange}
              <button
                onClick={() => handleFilterChange('priceRange', '')}
                className="ml-2 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter Options */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cuisine Type */}
          <div>
            <label htmlFor="cuisine-type" className="block text-sm font-medium text-gray-700 mb-2">
              Mutfak Türü
            </label>
            <select
              id="cuisine-type"
              value={filters.cuisineType}
              onChange={(e) => handleFilterChange('cuisineType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              <option value="">Tümü</option>
              {cuisineTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
              Bölge
            </label>
            <select
              id="district"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              <option value="">Tümü</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="min-rating" className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Puan
            </label>
            <select
              id="min-rating"
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              <option value={0}>Tümü</option>
              <option value={4}>4+ yıldız</option>
              <option value={4.5}>4.5+ yıldız</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat Aralığı
            </label>
            <select
              id="price-range"
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            >
              <option value="">Tümü</option>
              <option value="$">$ (Ekonomik)</option>
              <option value="$$">$$ (Orta)</option>
              <option value="$$$">$$$ (Yüksek)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
} 