'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { Plus, Check } from 'lucide-react';

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
      <h1 className="text-2xl font-bold mb-4">Menu</h1>

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
    </div>
  );
}
