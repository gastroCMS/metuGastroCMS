import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { RestaurantFilter } from '@/components/RestaurantFilter'
import { RestaurantCard } from '@/components/RestaurantCard'

const mockRestaurants = [
  {
    id: '1',
    name: 'Test Restaurant 1',
    description: 'A test restaurant description',
    address: 'Test Address 1',
    phone: '+901234567890',
    latitude: 39.9097,
    longitude: 32.8627,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    cuisine_type: 'Turkish',
    district: 'Kızılay',
    rating: 4.5,
    price_range: '$$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Test Restaurant 2',
    description: 'Another test restaurant description',
    address: 'Test Address 2',
    phone: '+901234567891',
    latitude: 39.9098,
    longitude: 32.8628,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    cuisine_type: 'Italian',
    district: 'Çankaya',
    rating: 4.0,
    price_range: '$$$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

const mockCuisineTypes = ['Turkish', 'Italian', 'Chinese', 'Japanese']
const mockDistricts = ['Kızılay', 'Çankaya', 'Ulus', 'Bahçelievler']

describe('Restaurant Browsing Integration Tests', () => {
  describe('Restaurant Filter Integration', () => {
    it('should filter restaurants by cuisine type', async () => {
      const mockFilters = {
        cuisineType: '',
        district: '',
        minRating: 0,
        priceRange: '',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Expand filters
      const expandButton = screen.getByText('Göster')
      fireEvent.click(expandButton)

      // Select cuisine type
      const cuisineSelect = screen.getByLabelText('Mutfak Türü')
      fireEvent.change(cuisineSelect, { target: { value: 'Turkish' } })

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...mockFilters,
          cuisineType: 'Turkish'
        })
      })
    })

    it('should filter restaurants by district', async () => {
      const mockFilters = {
        cuisineType: '',
        district: '',
        minRating: 0,
        priceRange: '',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Expand filters
      const expandButton = screen.getByText('Göster')
      fireEvent.click(expandButton)

      // Select district
      const districtSelect = screen.getByLabelText('Bölge')
      fireEvent.change(districtSelect, { target: { value: 'Kızılay' } })

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...mockFilters,
          district: 'Kızılay'
        })
      })
    })

    it('should filter restaurants by minimum rating', async () => {
      const mockFilters = {
        cuisineType: '',
        district: '',
        minRating: 0,
        priceRange: '',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Expand filters
      const expandButton = screen.getByText('Göster')
      fireEvent.click(expandButton)

      // Select minimum rating
      const ratingSelect = screen.getByLabelText('Minimum Puan')
      fireEvent.change(ratingSelect, { target: { value: '4' } })

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...mockFilters,
          minRating: 4
        })
      })
    })

    it('should filter restaurants by price range', async () => {
      const mockFilters = {
        cuisineType: '',
        district: '',
        minRating: 0,
        priceRange: '',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Expand filters
      const expandButton = screen.getByText('Göster')
      fireEvent.click(expandButton)

      // Select price range
      const priceSelect = screen.getByLabelText('Fiyat Aralığı')
      fireEvent.change(priceSelect, { target: { value: '$$' } })

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...mockFilters,
          priceRange: '$$'
        })
      })
    })

    it('should search restaurants by query', async () => {
      const mockFilters = {
        cuisineType: '',
        district: '',
        minRating: 0,
        priceRange: '',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Enter search query
      const searchInput = screen.getByPlaceholderText('Restoran, mutfak veya konum ara...')
      fireEvent.change(searchInput, { target: { value: 'Turkish' } })

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...mockFilters,
          searchQuery: 'Turkish'
        })
      })
    })

    it('should clear all filters', async () => {
      const mockFilters = {
        cuisineType: 'Turkish',
        district: 'Kızılay',
        minRating: 4,
        priceRange: '$$',
        searchQuery: 'test'
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Clear filters button should be visible
      const clearButton = screen.getByText('Filtreleri Temizle')
      fireEvent.click(clearButton)

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          cuisineType: '',
          district: '',
          minRating: 0,
          priceRange: '',
          searchQuery: ''
        })
      })
    })
  })

  describe('Restaurant Card Integration', () => {
    it('should display restaurant information correctly', () => {
      render(<RestaurantCard restaurant={mockRestaurants[0]} />)

      expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument()
      expect(screen.getByText('A test restaurant description')).toBeInTheDocument()
      expect(screen.getByText('Turkish')).toBeInTheDocument()
      expect(screen.getByText('Kızılay')).toBeInTheDocument()
      expect(screen.getByText('(4.5)')).toBeInTheDocument()
      expect(screen.getByText('$$')).toBeInTheDocument()
    })

    it('should navigate to restaurant detail page', () => {
      render(<RestaurantCard restaurant={mockRestaurants[0]} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/restaurants/1')
    })

    it('should display star rating correctly', () => {
      render(<RestaurantCard restaurant={mockRestaurants[0]} />)

      // Check that star SVGs are rendered
      const starSvgs = screen.getAllByRole('img', { hidden: true })
      expect(starSvgs.length).toBeGreaterThan(0)
    })

    it('should handle missing image gracefully', () => {
      const restaurantWithoutImage = {
        ...mockRestaurants[0],
        image_url: null
      }

      render(<RestaurantCard restaurant={restaurantWithoutImage} />)

      const image = screen.getByAltText('Test Restaurant 1')
      expect(image).toHaveAttribute('src', '/placeholder-restaurant.jpg')
    })
  })

  describe('Filter State Management', () => {
    it('should show active filter tags', () => {
      const mockFilters = {
        cuisineType: 'Turkish',
        district: 'Kızılay',
        minRating: 4,
        priceRange: '$$',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Check that active filter tags are displayed
      expect(screen.getByText('Turkish')).toBeInTheDocument()
      expect(screen.getByText('Kızılay')).toBeInTheDocument()
      expect(screen.getByText('4+ yıldız')).toBeInTheDocument()
      expect(screen.getByText('$$')).toBeInTheDocument()
    })

    it('should remove individual filter tags', async () => {
      const mockFilters = {
        cuisineType: 'Turkish',
        district: '',
        minRating: 0,
        priceRange: '',
        searchQuery: ''
      }
      
      const mockOnFiltersChange = vi.fn()

      render(
        <RestaurantFilter
          filters={mockFilters}
          onFiltersChange={mockOnFiltersChange}
          cuisineTypes={mockCuisineTypes}
          districts={mockDistricts}
        />
      )

      // Find and click the remove button for cuisine type
      const removeButton = screen.getByText('×')
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
          ...mockFilters,
          cuisineType: ''
        })
      })
    })
  })
}) 