'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  restaurant_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewListProps {
  restaurantId: string;
  reviews: Review[];
  onReviewAdded?: (review: Review) => void;
}

export function ReviewList({
  restaurantId,
  reviews,
  onReviewAdded,
}: ReviewListProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState(reviews);

  // Update local reviews when props change
  useEffect(() => {
    setLocalReviews(reviews);
  }, [reviews]);

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (rating: number) => void
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={
              interactive && onChange ? () => onChange(i + 1) : undefined
            }
            className={interactive ? 'focus:outline-none' : ''}
            disabled={!interactive}
          >
            <svg
              className={`w-5 h-5 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              } ${interactive ? 'hover:text-yellow-300 cursor-pointer' : ''}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Mock API call - replace with actual Supabase call
      const review: Review = {
        id: Date.now().toString(),
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email || 'Anonim',
        restaurant_id: restaurantId,
        rating: newReview.rating,
        comment: newReview.comment,
        created_at: new Date().toISOString(),
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add review to local state
      setLocalReviews(prev => [review, ...prev]);
      onReviewAdded?.(review);
      setNewReview({ rating: 5, comment: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    localReviews.length > 0
      ? localReviews.reduce((sum, review) => sum + review.rating, 0) /
        localReviews.length
      : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Değerlendirmeler
          </h3>
          {localReviews.length > 0 && (
            <div className="flex items-center space-x-2 mt-1">
              {renderStars(Math.round(averageRating))}
              <span className="text-sm text-gray-600">
                ({localReviews.length} değerlendirme)
              </span>
            </div>
          )}
        </div>
        {user && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            {showForm ? 'İptal' : 'Değerlendirme Yaz'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 bg-gray-50 rounded-lg"
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puanınız
            </label>
            {renderStars(newReview.rating, true, rating =>
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Yorumunuz
            </label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={e =>
                setNewReview(prev => ({ ...prev, comment: e.target.value }))
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Deneyiminizi paylaşın..."
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {localReviews.length > 0 ? (
        <div className="space-y-6">
          {localReviews.map(review => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {review.user_name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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
            Henüz değerlendirme yok
          </h4>
          <p className="text-gray-600">
            Bu restoran için ilk değerlendirmeyi siz yazın!
          </p>
        </div>
      )}
    </div>
  );
}
