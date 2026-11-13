import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from 'lucide-react'
import ProductArt from '../components/ProductArt'
import { getProduct } from '../data/products'
import { getSize, unitPrice } from '../lib/pricing'
import { DELIVERY_FEE, FREE_DELIVERY_OVER, TAX_RATE, formatPrice } from '../lib/site'
import { useStore } from '../store/useStore'

/** Shared with Checkout so totals always agree. */
export function useCartTotals() {
  const cart = useStore((s) => s.cart)
  return useMemo(() => {
    const lines = cart
      .map((l) => {
        const product = getProduct(l.id)
        if (!product) return null
        const price = unitPrice(product, l.size)
        return { ...l, product, price, total: price * l.qty }
      })
      .filter(Boolean)
    const subtotal = lines.reduce((n, l) => n + l.total, 0)
    const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE
    const tax = subtotal * TAX_RATE
    return { lines, subtotal, delivery, tax, total: subtotal + delivery + tax, count: lines.reduce((n, l) => n + l.qty, 0) }
  }, [cart])
}

export default function Cart() {
  const { lines, subtotal, delivery, tax, total, count } = useCartTotals()
  const setQty = useStore((s) => s.setQty)
  const remove = useStore((s) => s.removeFromCart)
  const clear = useStore((s) => s.clearCart)

  if (lines.length === 0) {
    return (
      <div className="container-x grid min-h-[80vh] place-items-center pt-28">
        <div className="glass-strong max-w-md rounded-[2rem] p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/10 text-gold-200">
            <ShoppingBag className="h-7 w-7" />
          </span>
          <h1 className="mt-5 font-serif text-4xl font-semibold text-cream-50">Your cart is empty</h1>
          <p className="mt-2 text-cream-200/80">Add a drink or two and they’ll show up here.</p>
          <Link to="/shop" className="btn-gold mt-6">
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    )
  }

  const remaining = Math.max(0, FREE_DELIVERY_OVER - subtotal)

  return (
    <div className="container-x pb-8 pt-32">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="eyebrow">Your order</p>
          <h1 className="mt-2 font-serif text-5xl font-semibold text-cream-50">Cart</h1>
        </div>
        <button onClick={clear} className="text-sm text-cream-200/70 underline-offset-4 hover:text-rose-300 hover:underline">
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((l) => (
              <motion.li
                key={l.key}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="glass flex gap-4 rounded-3xl p-3.5 sm:p-4"
              >
                <Link
                  to={`/product/${l.product.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
                  style={{ background: `linear-gradient(145deg, ${l.product.colors.bgFrom}, ${l.product.colors.bgTo})` }}
                >
                  <ProductArt product={l.product} className="h-full w-full p-1.5" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={`/product/${l.product.slug}`} className="block truncate font-serif text-xl font-semibold text-cream-50 hover:text-gold-200">
                        {l.product.name}
                      </Link>
                      <p className="text-sm text-cream-200/70">
                        {getSize(l.size).label} · {getSize(l.size).oz} oz · {formatPrice(l.price)} each
                      </p>
                    </div>
                    <button onClick={() => remove(l.key)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-rose-400/20" aria-label={`Remove ${l.product.name}`}>
                      <Trash2 className="h-4 w-4 text-rose-300" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="glass inline-flex items-center rounded-full">
                      <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15" onClick={() => setQty(l.key, l.qty - 1)} aria-label="Decrease quantity">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{l.qty}</span>
                      <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/15" onClick={() => setQty(l.key, l.qty + 1)} aria-label="Increase quantity">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-serif text-2xl font-semibold text-gold-200">{formatPrice(l.total)}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <aside className="glass-strong h-fit rounded-3xl p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl font-semibold text-cream-50">Summary</h2>

          <div className="mt-4 rounded-2xl border border-white/15 bg-white/5 p-3.5 text-xs text-cream-100">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-gold-300" />
              {remaining > 0 ? (
                <span>
                  Add <b className="text-gold-200">{formatPrice(remaining)}</b> more for free delivery
                </span>
              ) : (
                <span className="text-emerald-200">You’ve unlocked free delivery!</span>
              )}
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-300 to-gold-500"
                animate={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_OVER) * 100)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
          </div>

          <dl className="mt-5 space-y-2.5 text-sm">
            <div className="flex justify-between text-cream-200/85">
              <dt>Subtotal ({count} items)</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-cream-200/85">
              <dt>Delivery</dt>
              <dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
            </div>
            <div className="flex justify-between text-cream-200/85">
              <dt>Tax ({(TAX_RATE * 100).toFixed(1)}%)</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-white/15 pt-3 text-lg font-semibold text-cream-50">
              <dt>Total</dt>
              <dd className="font-serif text-3xl text-gold-200">{formatPrice(total)}</dd>
            </div>
          </dl>

          <Link to="/checkout" className="btn-gold mt-6 w-full !py-4">
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-sm text-cream-200/75 hover:text-gold-200">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
