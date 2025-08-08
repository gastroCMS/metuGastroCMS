'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { BaseLayout } from '@/components/BaseLayout';
import { AdminRestaurantsTable } from '@/components/AdminRestaurantsTable';
import { AdminBlogTable } from '@/components/AdminBlogTable';
import { AdminReviewsTable } from '@/components/AdminReviewsTable';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      // Verify against admins table
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Admin kontrolü başarısız:', error);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(!!data);
    };

    void checkAdminStatus();
  }, [user]);

  if (loading) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
        </div>
      </BaseLayout>
    );
  }

  if (!user) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Erişim Reddedildi
            </h1>
            <p className="text-gray-600">
              Bu sayfaya erişmek için giriş yapmanız gerekiyor.
            </p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  if (!isAdmin) {
    return (
      <BaseLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Yetkisiz Erişim
            </h1>
            <p className="text-gray-600">
              Bu sayfaya erişim yetkiniz bulunmuyor.
            </p>
          </div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Paneli
          </h1>
          <p className="text-gray-600">Sistem yönetimi ve içerik düzenleme</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'restaurants'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Restoranlar
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'blog'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Blog Yazıları
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Değerlendirmeler
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'restaurants' && <AdminRestaurantsTable />}
          {activeTab === 'blog' && <AdminBlogTable />}
          {activeTab === 'reviews' && <AdminReviewsTable />}
        </div>
      </div>
    </BaseLayout>
  );
}
