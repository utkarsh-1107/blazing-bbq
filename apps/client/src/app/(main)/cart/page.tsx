'use client';

import { useState } from 'react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { formatPrice, cn } from '@/lib/utils';
import { Minus, Plus, Trash2, Tag, CreditCard, MapPin } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const subtotal = getSubtotal();
  const gst = Math.round(subtotal * 0.05);
  const deliveryFee = address ? 50 : 0;
  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.min(
        (coupon.discountValue / 100) * subtotal,
        Number(coupon.maxDiscount) || Infinity
      );
    } else {
      discount = Number(coupon.discountValue);
    }
  }
  const total = subtotal + gst + deliveryFee - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    setCouponSuccess('');

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await api.applyCoupon(token, couponCode);
      if (res.success) {
        setCoupon(res.data.coupon);
        setCouponSuccess('Coupon applied successfully!');
      }
    } catch (error: any) {
      setCouponError(error.message || 'Invalid coupon');
      setCoupon(null);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order
      const orderRes = await api.createOrder(token, {
        deliveryAddress: address || undefined,
        notes: notes || undefined,
        couponCode: coupon?.code || undefined,
      });

      if (orderRes.success) {
        // Clear local cart
        clearCart();
        // Navigate to payment
        router.push(`/orders/${orderRes.data.id}`);
      }
    } catch (error: any) {
      alert(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some delicious items from our menu</p>
        <Link
          href="/menu"
          className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.menuItem.name}</h3>
                <p className="text-primary font-semibold">{formatPrice(item.menuItem.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatPrice(item.menuItem.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Delivery Address</h3>
            </div>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your delivery address..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
          </div>

          {/* Order Notes */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-3">Order Notes (Optional)</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={2}
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

            {/* Coupon */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-2 block">Have a coupon?</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-sm mt-1">{couponSuccess}</p>}
              {coupon && (
                <p className="text-green-600 text-sm mt-1">
                  {coupon.description}
                </p>
              )}
            </div>

            <div className="space-y-2 py-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (5%)</span>
                <span>{formatPrice(gst)}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between py-4 border-t font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className={cn(
                'w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2',
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-600'
              )}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Proceed to Payment
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Payment via Razorpay (UPI, Cards, Net Banking)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
