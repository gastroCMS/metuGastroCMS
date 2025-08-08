import { BaseLayout } from '@/components/BaseLayout';
import { RestaurantMapView } from '@/components/RestaurantMapView';
import { ReviewList } from '@/components/ReviewList';
import { mockData } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface RestaurantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  const restaurant = mockData.restaurants.find(r => r.id === id);

  if (!restaurant) {
    notFound();
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-lg text-gray-600 ml-2">({rating})</span>
      </div>
    );
  };

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-emerald-600">
                Ana Sayfa
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/restaurants" className="hover:text-emerald-600">
                Restoranlar
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">{restaurant.name}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
            <Image
              src={restaurant.image_url || '/placeholder-restaurant.jpg'}
              alt={restaurant.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {restaurant.name}
              </h1>
              <p className="text-gray-600 mb-4 max-w-2xl">
                {restaurant.description}
              </p>
              <div className="flex items-center space-x-4 mb-4">
                {renderStars(restaurant.rating)}
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{restaurant.cuisine_type}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{restaurant.district}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{restaurant.price_range}</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                Değerlendir
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Favorilere Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              İletişim Bilgileri
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-gray-400 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-gray-600">{restaurant.address}</span>
              </div>
              {restaurant.phone && (
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span className="text-gray-600">{restaurant.phone}</span>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                    />
                  </svg>
                  <a
                    href={restaurant.website}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Web Sitesi
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Konum</h3>
            <RestaurantMapView
              restaurants={[restaurant]}
              center={[restaurant.latitude, restaurant.longitude]}
              zoom={15}
              height="300px"
              showPopup={false}
            />
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewList restaurantId={restaurant.id} reviews={[]} />
      </div>
    </BaseLayout>
  );
}
