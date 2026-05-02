'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategorySection from '@/components/home/CategorySection';
import FoodCard from '@/components/home/FoodCard';
import MainLayout from '@/components/layout/MainLayout';
import { api } from '@/lib/api';

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  isVeg: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  items: MenuItem[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.getMenu();
        if (res.success) {
          setCategories((res.data as any).categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch home menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const featuredItems = useMemo(
    () => categories.slice(0, 4).flatMap((cat) => (cat.items || []).slice(0, 2)),
    [categories]
  );

  const trendingItems = useMemo(() => {
    const all = categories.flatMap((cat) => cat.items || []);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [categories]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
        <HeroCarousel />

        {categories.length > 0 && <CategorySection categories={categories} />}

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">Popular Picks</h2>
            <Link href="/menu" className="text-primary font-medium hover:underline">
              View Full Menu
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredItems.map((item: MenuItem) => (
                <FoodCard key={item.id} item={item as any} />
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold">Trending Right Now</h2>
            <button
              onClick={() => setCategories((prev) => [...prev])}
              className="text-sm px-3 py-1.5 rounded-lg bg-primary text-white"
            >
              Shuffle
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trendingItems.map((item: MenuItem) => (
              <FoodCard key={`trend-${item.id}`} item={item as any} />
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Quick Select</h2>
          <div className="flex flex-wrap gap-2">
            {['Spicy', 'Veg', 'Fast Delivery', 'Combos', 'Under Rs.199', 'BBQ Specials'].map((tag) => (
              <Link
                key={tag}
                href="/menu"
                className="px-3 py-2 rounded-lg bg-primary/20 text-white border border-white/20 hover:bg-primary/40 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-bold mb-4">FAQs</h2>
          <div className="space-y-3">
            <details className="rounded-lg p-3 bg-white/5 border border-white/10">
              <summary className="font-semibold cursor-pointer">How long does delivery take?</summary>
              <p className="mt-2 text-sm text-gray-300">Usually 25-45 minutes depending on your location.</p>
            </details>
            <details className="rounded-lg p-3 bg-white/5 border border-white/10">
              <summary className="font-semibold cursor-pointer">Do you support COD?</summary>
              <p className="mt-2 text-sm text-gray-300">Online payments are preferred; COD availability may vary by area.</p>
            </details>
            <details className="rounded-lg p-3 bg-white/5 border border-white/10">
              <summary className="font-semibold cursor-pointer">Can I customize my order?</summary>
              <p className="mt-2 text-sm text-gray-300">Yes, add instructions during checkout in order notes.</p>
            </details>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
