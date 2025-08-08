import { Database } from './supabase'

type Restaurant = Database['public']['Tables']['restaurants']['Row']
type BlogPost = Database['public']['Tables']['blog_posts']['Row']

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Trilye Restaurant',
    description: 'Şık balık restoranı',
    address: 'Haşim İşcan Cd. No:30, 06700 Çankaya/Ankara',
    phone: '+903124471200',
    latitude: 39.9097,
    longitude: 32.8627,
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    cuisine_type: 'Deniz Ürünleri',
    district: 'Çankaya',
    rating: 4.5,
    price_range: '$$$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Aspava',
    description: 'Meşhur kebapçı',
    address: 'Çankaya, Esat',
    phone: '+903124470000',
    latitude: 39.9200,
    longitude: 32.8500,
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    cuisine_type: 'Kebap',
    district: 'Çankaya',
    rating: 4.2,
    price_range: '$$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Liva Pastacılık',
    description: 'Pastane ve kafe',
    address: 'Bahçelievler',
    phone: '+903124473333',
    latitude: 39.9300,
    longitude: 32.8200,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&h=400&fit=crop',
    cuisine_type: 'Kafe',
    district: 'Bahçelievler',
    rating: 4.0,
    price_range: '$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Kebapçı Selim Usta',
    description: 'Geleneksel kebap lezzetleri',
    address: 'Kızılay, Ankara',
    phone: '+903124474444',
    latitude: 39.9180,
    longitude: 32.8590,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    cuisine_type: 'Kebap',
    district: 'Kızılay',
    rating: 4.7,
    price_range: '$$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'Pizza House',
    description: 'İtalyan mutfağından lezzetler',
    address: 'Çankaya, Ankara',
    phone: '+903124475555',
    latitude: 39.9150,
    longitude: 32.8650,
    image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    cuisine_type: 'İtalyan',
    district: 'Çankaya',
    rating: 4.3,
    price_range: '$$',
    website: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Ankara\'nın En İyi Kebap Mekanları',
    content: 'Ankara\'da kebap yemek için gidilebilecek en iyi mekanları sizler için derledik...',
    excerpt: 'Ankara\'da kebap yemek için gidilebilecek en iyi mekanları keşfedin.',
    author_id: '1',
    image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    published: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Deniz Ürünleri Sezonu Başladı',
    content: 'Taze deniz ürünleri ile hazırlanan lezzetli yemekler...',
    excerpt: 'Taze deniz ürünleri ile hazırlanan lezzetli yemekler hakkında bilmeniz gerekenler.',
    author_id: '1',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    published: true,
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z'
  }
]

export const mockData = {
  restaurants: mockRestaurants,
  blogPosts: mockBlogPosts
} 