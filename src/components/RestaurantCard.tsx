import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/supabase'

type Restaurant = Database['public']['Tables']['restaurants']['Row']

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    )
  }

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div data-testid="restaurant-card" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={restaurant.image_url || '/placeholder-restaurant.jpg'}
            alt={restaurant.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{restaurant.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{restaurant.description}</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{restaurant.cuisine_type}</span>
            <span className="text-sm font-medium text-gray-900">{restaurant.price_range}</span>
          </div>
          <div className="flex items-center justify-between">
            {renderStars(restaurant.rating)}
            <span className="text-sm text-gray-500">{restaurant.district}</span>
          </div>
        </div>
      </div>
    </Link>
  )
} 