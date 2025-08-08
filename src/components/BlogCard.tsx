import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/supabase'

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.id}`}>
      <article data-testid="blog-card" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image
            src={post.image_url || '/placeholder-blog.jpg'}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(post.created_at).toLocaleDateString('tr-TR')}</span>
            <span>Devamını Oku →</span>
          </div>
        </div>
      </article>
    </Link>
  )
} 