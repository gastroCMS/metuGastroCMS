import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/utils'
import { RestaurantCard } from '../RestaurantCard'

const mockRestaurant = {
  id: '1',
  name: 'Test Restaurant',
  description: 'A test restaurant description',
  address: 'Test Address',
  phone: '+901234567890',
  latitude: 39.9097,
  longitude: 32.8627,
  image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
  cuisine_type: 'Test Cuisine',
  district: 'Test District',
  rating: 4.5,
  price_range: '$$',
  website: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
}

describe('RestaurantCard', () => {
  it('renders restaurant information correctly', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    expect(screen.getByText('A test restaurant description')).toBeInTheDocument()
    expect(screen.getByText('Test Cuisine')).toBeInTheDocument()
    expect(screen.getByText('Test District')).toBeInTheDocument()
    expect(screen.getByText('(4.5)')).toBeInTheDocument()
    expect(screen.getByText('$$')).toBeInTheDocument()
  })

  it('displays restaurant image with correct alt text', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    const image = screen.getByAltText('Test Restaurant')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockRestaurant.image_url)
  })

  it('renders star rating correctly', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Check that star SVGs are rendered
    const starSvgs = screen.getAllByRole('img', { hidden: true })
    expect(starSvgs.length).toBeGreaterThan(0)
  })

  it('has correct link to restaurant detail page', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/restaurants/1')
  })

  it('applies correct styling classes', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    const card = screen.getByTestId('restaurant-card')
    expect(card).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden')
  })
}) 