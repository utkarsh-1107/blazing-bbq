'use client';

import Image from 'next/image';

const banners = [
  {
    id: 1,
    title: 'Welcome to Blazing Barbecue',
    subtitle: 'Authentic BBQ flavors delivered to your doorstep',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=400&fit=crop',
    cta: 'Order Now',
  },
  {
    id: 2,
    title: 'Special Weekend Offer',
    subtitle: 'Get 20% off on your first order with WELCOME20',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=400&fit=crop',
    cta: 'Browse Menu',
  },
  {
    id: 3,
    title: 'Fresh & Delicious',
    subtitle: 'Made with premium ingredients and authentic spices',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1200&h=400&fit=crop',
    cta: 'View Menu',
  },
];

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden rounded-xl">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <h2 className="text-white text-2xl md:text-4xl font-bold mb-2">
              {banner.title}
            </h2>
            <p className="text-white/80 text-sm md:text-lg mb-4">
              {banner.subtitle}
            </p>
            <Link
              href="/menu"
              className="inline-block w-fit bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              {banner.cta}
            </Link>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === current ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
