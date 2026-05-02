'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

interface CategorySectionProps {
  categories: Category[];
}

const categoryImages: Record<string, string> = {
  'appetizers': 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=200&h=200&fit=crop',
  'wraps': 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&h=200&fit=crop',
  'wings': 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=200&h=200&fit=crop',
  'sandwiches': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=200&h=200&fit=crop',
  'hot-dogs': 'https://images.unsplash.com/photo-1612392062631-e94c5fd9d298?w=200&h=200&fit=crop',
  'full-leg': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
  'drumsticks': 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=200&h=200&fit=crop',
  'extras': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
};

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
    <div className="py-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/menu?category=${category.slug}`}
            className="flex-shrink-0 w-28 sm:w-32"
          >
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative w-full h-24">
                <Image
                  src={categoryImages[category.slug] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2 text-center">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {category.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
