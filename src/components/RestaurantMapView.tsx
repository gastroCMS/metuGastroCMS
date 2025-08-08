'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Database } from '@/lib/supabase';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantMapViewProps {
  restaurants: Restaurant[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showPopup?: boolean;
  className?: string;
}

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(
  () => import('./RestaurantMap').then(mod => ({ default: mod.RestaurantMap })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
            />
          </svg>
          <p className="text-gray-500">Harita yükleniyor...</p>
        </div>
      </div>
    ),
  }
);

export function RestaurantMapView({
  restaurants,
  center = [39.9334, 32.8597], // Ankara center
  zoom = 12,
  height = '400px',
  showPopup = true,
  className = '',
}: RestaurantMapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
            />
          </svg>
          <p className="text-gray-500">Harita yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg overflow-hidden border ${className}`}
      style={{ height }}
    >
      <DynamicMap
        restaurants={restaurants}
        center={center}
        zoom={zoom}
        height={height}
        showPopup={showPopup}
      />
    </div>
  );
}
