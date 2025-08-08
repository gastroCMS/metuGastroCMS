import { BaseLayout } from '@/components/BaseLayout'
import { BlogCard } from '@/components/BlogCard'
import { mockData } from '@/lib/mockData'

export default function BlogPage() {
  const blogPosts = mockData.blogPosts

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-gray-600">
            Yemek kültürü ve restoran deneyimleri hakkında en güncel yazılar
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Empty State */}
        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz blog yazısı yok
            </h3>
            <p className="text-gray-600">
              Yakında yemek kültürü hakkında harika yazılar ekleyeceğiz.
            </p>
          </div>
        )}
      </div>
    </BaseLayout>
  )
} 