'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  isVeg?: boolean;
}

interface CartItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: { menuItemId: string; menuItem: MenuItem; quantity?: number; notes?: string }) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getGst: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find((i) => i.menuItemId === item.menuItemId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${item.menuItemId}-${Date.now()}`,
            menuItemId: item.menuItemId,
            menuItem: item.menuItem,
            quantity: item.quantity || 1,
            notes: item.notes,
          };
          set({ items: [...get().items, newItem] });
        }
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      setCartOpen: (open) => set({ isOpen: open }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + Number(i.menuItem.price) * i.quantity, 0),
      getGst: () => Math.round(get().getSubtotal() * 0.05 * 100) / 100,
      getDeliveryFee: () => 50,
      getTotal: () => get().getSubtotal() + get().getGst() + get().getDeliveryFee(),
    }),
    {
      name: 'blazing-bbq-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);