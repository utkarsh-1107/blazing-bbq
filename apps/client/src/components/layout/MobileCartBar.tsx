'use client';

import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function MobileCartBar() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { items, toggleCart, getTotal, getTotalItems } = useCartStore();

  const totalItems = getTotalItems();
  const total = getTotal();

  // Only show on mobile when there are items
  if (items.length === 0) return null;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/cart');
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-100 shadow-lg safe-bottom z-40">
      <div className="flex items-center justify-between p-4">
        {/* Cart Summary */}
        <button
          onClick={toggleCart}
          className="flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-white text-primary text-xs font-bold rounded-full flex items-center justify-center shadow-md">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            <p className="font-bold text-gray-900">Rs. {total.toFixed(0)}</p>
          </div>
        </button>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors btn-press"
        >
          View Cart
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
