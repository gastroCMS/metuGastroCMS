import { BaseLayout } from '@/components/BaseLayout'
import { RestaurantCard } from '@/components/RestaurantCard'
import { BlogCard } from '@/components/BlogCard'
import { mockData } from '@/lib/mockData'
import Link from 'next/link'

export default function Home() {
  const featuredRestaurants = mockData.restaurants.slice(0, 3)
  const latestBlogPosts = mockData.blogPosts.slice(0, 2)

  return (
    <BaseLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 turkish-text">
              LezzetKeşif
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto turkish-text">
              Ankara'nın en iyi restoranlarını keşfedin, deneyimlerinizi paylaşın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/restaurants"
                className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Restoranları Keşfet
              </Link>
              <Link
                href="/blog"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
              >
                Blog'u Oku
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Öne Çıkan Restoranlar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok beğenilen ve yüksek puanlı restoranlarımızı keşfedin
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/restaurants"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Tüm Restoranları Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Son Blog Yazıları
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Yemek kültürü ve restoran deneyimleri hakkında en güncel yazılar
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestBlogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/blog"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              Tüm Yazıları Oku
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">50+</div>
              <div className="text-gray-700 turkish-text">Restoran</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">1000+</div>
              <div className="text-gray-700 turkish-text">Değerlendirme</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-gray-700 turkish-text">Mutlu Müşteri</div>
            </div>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}
