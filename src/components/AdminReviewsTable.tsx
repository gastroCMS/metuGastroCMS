'use client'

import { useState, useEffect } from 'react'

interface Review {
  id: string
  user_id: string
  restaurant_id: string
  restaurant_name: string
  user_name: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

// Mock reviews data
const mockReviews: Review[] = [
  {
    id: '1',
    user_id: '1',
    restaurant_id: '1',
    restaurant_name: 'Trilye Restaurant',
    user_name: 'Ahmet Yılmaz',
    rating: 4,
    comment: 'Harika bir deneyimdi, kesinlikle tavsiye ederim!',
    status: 'approved',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    user_id: '2',
    restaurant_id: '2',
    restaurant_name: 'Aspava',
    user_name: 'Fatma Demir',
    rating: 3,
    comment: 'Orta seviyede bir deneyim, yemekler iyiydi ama servis yavaştı.',
    status: 'pending',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    user_id: '3',
    restaurant_id: '3',
    restaurant_name: 'Liva Pastacılık',
    user_name: 'Mehmet Kaya',
    rating: 5,
    comment: 'Mükemmel tatlılar ve çok güzel bir atmosfer!',
    status: 'approved',
    created_at: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    user_id: '4',
    restaurant_id: '4',
    restaurant_name: 'Kebapçı Selim Usta',
    user_name: 'Ayşe Özkan',
    rating: 2,
    comment: 'Çok kötü bir deneyim, yemekler soğuktu ve servis berbat.',
    status: 'rejected',
    created_at: '2024-01-18T16:45:00Z'
  }
]

export function AdminReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  useEffect(() => {
    setReviews(mockReviews)
  }, [])

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    return review.status === filter
  })

  const handleStatusChange = (reviewId: string, newStatus: 'approved' | 'rejected') => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, status: newStatus }
        : review
    ))
  }

  const handleDelete = (reviewId: string) => {
    setReviews(reviews.filter(review => review.id !== reviewId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı'
      case 'rejected':
        return 'Reddedildi'
      case 'pending':
        return 'Beklemede'
      default:
        return 'Bilinmiyor'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Değerlendirme Yönetimi</h2>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
          >
            <option value="all">Tümü</option>
            <option value="pending">Bekleyen</option>
            <option value="approved">Onaylanan</option>
            <option value="rejected">Reddedilen</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Restoran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Puan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Yorum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Tarih
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReviews.map((review) => (
              <tr key={review.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{review.user_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{review.restaurant_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-900">{review.rating}</span>
                    <span className="text-yellow-400 ml-1">★</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">
                    {review.comment}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(review.status)}`}>
                    {getStatusText(review.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(review.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {review.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(review.id, 'approved')}
                        className="text-green-600 hover:text-green-900"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleStatusChange(review.id, 'rejected')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reddet
                      </button>
                    </div>
                  )}
                  {review.status !== 'pending' && (
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Bu kategoride değerlendirme bulunamadı.</p>
        </div>
      )}
    </div>
  )
} 