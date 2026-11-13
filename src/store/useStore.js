import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const lineKey = (id, size) => `${id}:${size}`

export const useStore = create(
  persist(
    (set) => ({
      // ----- cart -----
      cart: [], // [{ key, id, size, qty }]
      addToCart: (id, size = 'M', qty = 1) =>
        set((s) => {
          const key = lineKey(id, size)
          const found = s.cart.find((l) => l.key === key)
          if (found) {
            return { cart: s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(20, l.qty + qty) } : l)) }
          }
          return { cart: [...s.cart, { key, id, size, qty }] }
        }),
      setQty: (key, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((l) => l.key !== key)
              : s.cart.map((l) => (l.key === key ? { ...l, qty: Math.min(20, qty) } : l)),
        })),
      removeFromCart: (key) => set((s) => ({ cart: s.cart.filter((l) => l.key !== key) })),
      clearCart: () => set({ cart: [] }),

      // ----- auth (demo, client-side only) -----
      user: null, // { name, email }
      profiles: {}, // { [email]: name } remembered from sign-ups
      login: (user) => set({ user }),
      signup: (user) => set((s) => ({ user, profiles: { ...s.profiles, [user.email]: user.name } })),
      logout: () => set({ user: null }),

      // ----- orders (simulated checkout) -----
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),

      // ----- toast (not persisted) -----
      toast: null,
      showToast: (t) => {
        const id = Date.now()
        set({ toast: { id, ...t } })
        setTimeout(() => set((s) => (s.toast?.id === id ? { toast: null } : {})), 3400)
      },
      hideToast: () => set({ toast: null }),
    }),
    {
      name: 'motherearth-store-v1',
      partialize: (s) => ({ cart: s.cart, user: s.user, profiles: s.profiles, orders: s.orders }),
    },
  ),
)
