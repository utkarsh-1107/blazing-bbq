'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { Plus, Check } from 'lucide-react';
import HeroCarousel from '@/components/home/HeroCarousel';

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  isVeg?: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  items?: MenuItem[];
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const { addItem, items } = useCartStore();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.getMenu();
        if (res.success) {
          const data = (res.data as any).categories ?? [];
          setCategories(data);
          if (data.length > 0) {
            setActiveCategory(data[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const allItems = useMemo(() => categories.flatMap((c) => c.items ?? []), [categories]);
  const filteredItems = useMemo(() => {
    if (!activeCategory) return allItems;
    return allItems.filter((item) => item.categoryId === activeCategory);
  }, [activeCategory, allItems]);

  const trendingItems = useMemo(() => {
    const shuffled = [...allItems].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 8);
  }, [allItems, categories]);

  const cartCountByMenuItem = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of items) {
      map.set(item.menuItemId, (map.get(item.menuItemId) || 0) + item.quantity);
    }
    return map;
  }, [items]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
              <div className="h-24 bg-gray-100 rounded mb-3" />
              <div className="h-4 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <HeroCarousel />

      <div className="mt-8 mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Menu</h1>
        <button
          onClick={() => setCategories((prev) => [...prev])}
          className="px-3 py-1.5 text-sm rounded-lg bg-primary text-white"
        >
          Refresh Trending
        </button>
      </div>

      <div className="card p-4 mb-6">
        <h2 className="font-semibold mb-3">Quick Select</h2>
        <div className="flex flex-wrap gap-2">
          {['Best Seller', 'Veg', 'Spicy', 'Starter', 'Main Course', 'Under Rs.199'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                if (categories.length > 0) {
                  setActiveCategory(categories[0].id);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm hover:bg-white/20 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              activeCategory === cat.id ? 'bg-primary text-white' : 'bg-white text-gray-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const inCart = cartCountByMenuItem.get(item.id) || 0;
          return (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description || 'Freshly prepared'}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-primary">Rs.{item.price}</p>
                <button
                  onClick={() =>
                    addItem({
                      menuItemId: item.id,
                      menuItem: {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        isVeg: item.isVeg,
                      },
                      quantity: 1,
                    })
                  }
                  className="inline-flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm"
                >
                  {inCart > 0 ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {inCart > 0 ? inCart : 'Add'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Trending Right Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trendingItems.map((item) => {
            const inCart = cartCountByMenuItem.get(item.id) || 0;
            return (
              <div key={`trending-${item.id}`} className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description || 'Chef special'}</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-primary">Rs.{item.price}</p>
                  <button
                    onClick={() =>
                      addItem({
                        menuItemId: item.id,
                        menuItem: {
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          image: item.image,
                          isVeg: item.isVeg,
                        },
                        quantity: 1,
                      })
                    }
                    className="inline-flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    {inCart > 0 ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {inCart > 0 ? inCart : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 card p-6">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <details className="rounded-lg p-3 bg-white/5 border border-white/10">
            <summary className="font-semibold cursor-pointer">Are these items freshly prepared?</summary>
            <p className="mt-2 text-sm text-gray-300">Yes, every order is prepared fresh and packed immediately.</p>
          </details>
          <details className="rounded-lg p-3 bg-white/5 border border-white/10">
            <summary className="font-semibold cursor-pointer">Can I schedule an order?</summary>
            <p className="mt-2 text-sm text-gray-300">Currently we support immediate orders; scheduling is coming soon.</p>
          </details>
          <details className="rounded-lg p-3 bg-white/5 border border-white/10">
            <summary className="font-semibold cursor-pointer">Do you offer party packs?</summary>
            <p className="mt-2 text-sm text-gray-300">Yes, contact us from the Contact page for bulk and party orders.</p>
          </details>
        </div>
      </section>
    </div>
  );
}
