'use client';

import Image from 'next/image';
import { Plus } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';

interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  image?: string;
  isVeg: boolean;
}

interface FoodCardProps {
  item: MenuItem;
}

const placeholderImages: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
};

export default function FoodCard({ item }: FoodCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      menuItemId: item.id,
      menuItem: {
        id: item.id,
        name: item.name,
        price: Number(item.price),
        image: item.image,
        isVeg: item.isVeg,
      },
      quantity: 1,
    });
  };

  return (
    <div className="card group">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image || placeholderImages.default}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-0.5 text-xs font-semibold rounded ${
              item.isVeg
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {item.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            {formatPrice(Number(item.price))}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
