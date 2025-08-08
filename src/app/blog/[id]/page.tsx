import { BaseLayout } from '@/components/BaseLayout';
import { CommentList } from '@/components/CommentList';
import { mockData } from '@/lib/mockData';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = mockData.blogPosts.find(p => p.id === id);

  if (!post) {
    notFound();
  }

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Link href="/blog" className="hover:text-emerald-600">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 line-clamp-1">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>
                {new Date(post.created_at).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>•</span>
              <span>5 dk okuma</span>
            </div>
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {post.image_url && (
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">{post.content}</p>

            {/* Placeholder content for demonstration */}
            <p className="text-gray-700 leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Sonuç
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Bu yazıda Ankara&apos;daki restoran kültürü hakkında detaylı
              bilgiler paylaştık. Umarız bu bilgiler size yardımcı olur ve yeni
              lezzetler keşfetmenize katkıda bulunur.
            </p>
          </div>
        </article>

        {/* Comments Section */}
        <CommentList blogPostId={post.id} comments={[]} />

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            İlgili Yazılar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockData.blogPosts
              .filter(p => p.id !== post.id)
              .slice(0, 2)
              .map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="block bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h4>
                  {relatedPost.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
