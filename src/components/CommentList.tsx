'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  blog_post_id: string;
  content: string;
  created_at: string;
}

interface CommentListProps {
  blogPostId: string;
  comments: Comment[];
  onCommentAdded?: (comment: Comment) => void;
}

export function CommentList({
  blogPostId,
  comments,
  onCommentAdded,
}: CommentListProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(comments);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual Supabase call
      const comment: Comment = {
        id: Date.now().toString(),
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email || 'Anonim',
        blog_post_id: blogPostId,
        content: newComment.trim(),
        created_at: new Date().toISOString(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add comment to local state
      setLocalComments(prev => [comment, ...prev]);
      onCommentAdded?.(comment);
      setNewComment('');
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Yorumlar</h3>
          {localComments.length > 0 && (
            <span className="text-sm text-gray-600">
              ({localComments.length} yorum)
            </span>
          )}
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {showForm ? 'İptal' : 'Yorum Yaz'}
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && user && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 bg-gray-50 rounded-lg"
        >
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Yorumunuz
            </label>
            <textarea
              id="comment"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Düşüncelerinizi paylaşın..."
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      {localComments.length > 0 ? (
        <div className="space-y-6">
          {localComments.map(comment => (
            <div
              key={comment.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {comment.user_name}
                  </h4>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Henüz yorum yok
          </h4>
          <p className="text-gray-600">
            Bu yazı hakkında ilk yorumu siz yazın!
          </p>
        </div>
      )}
    </div>
  );
}
