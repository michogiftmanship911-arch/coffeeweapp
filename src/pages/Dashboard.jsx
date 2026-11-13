import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Crown, LayoutDashboard, LogOut, Package, ShoppingBag } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatPrice } from '../lib/site'
import { getSize } from '../lib/pricing'
import { products } from '../data/products'

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Order history', icon: Package },
  { id: 'reserve', label: 'Members’ Reserve', icon: Crown },
]

const guides = [
  {
    title: 'The 18-hour cold brew ratio',
    tag: 'Coffee',
    summary: 'Our exact grind, ratio and steep time for silky, zero-carb cold brew.',
    body: 'Use a coarse grind at roughly 1 part coffee to 8 parts cold, filtered water. Stir gently once, cover and steep in the fridge for 16–18 hours. Filter twice — first through a mesh, then through paper — and serve over ice. Dilute 1:1 with water or milk if you prefer it lighter.',
  },
  {
    title: 'Whisking matcha like a pro',
    tag: 'Tea',
    summary: 'Sift, splash, whisk — three steps to a foam-topped bowl.',
    body: 'Sift 2 g of matcha into a warm bowl. Add a splash of water just below boiling (about 80 °C) and make a smooth paste. Add the rest of the water (60–70 ml) and whisk in a quick “M” motion until a fine foam forms. Drink immediately.',
  },
  {
    title: 'Gongfu-style brewing at home',
    tag: 'Tea',
    summary: 'Short, hot infusions that reveal a tea’s layers one by one.',
    body: 'Use a small pot with a generous amount of leaf and short steeps — 10 to 20 seconds for the first infusions, lengthening slightly with each pour. Taste each infusion; the character shifts. Good oolongs and pearl teas can yield six or more rounds.',
  },
  {
    title: 'Pairing sugar-free drinks with food',
    tag: 'Pairing',
    summary: 'What to eat with our unsweetened matcha, espresso and Earl Grey.',
    body: 'Unsweetened matcha loves salty-sweet bites like sesame cookies. A double espresso is wonderful beside something buttery. Earl Grey and bergamot sing alongside lemon cake or shortbread. Let the drink stay the star and keep desserts light.',
  },
]

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const [open, setOpen] = useState(null)
  const user = useStore((s) => s.user)
  const orders = useStore((s) => s.orders)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()

  const mine = useMemo(() => orders.filter((o) => o.email === user?.email), [orders, user?.email])
  const spent = mine.reduce((n, o) => n + o.total, 0)
  const picks = useMemo(() => products.filter((p) => p.sugarFree).slice(0, 3), [])

  const out = () => {
    navigate('/', { replace: true })
    logout()
  }

  if (!user) return null // signed out while the page animates away

  return (
    <div className="container-x pb-8 pt-32">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-strong flex flex-wrap items-center justify-between gap-5 rounded-[2rem] p-6 sm:p-8"
      >
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600 font-serif text-3xl font-semibold text-forest-950">
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1 className="font-serif text-3xl font-semibold text-cream-50 sm:text-4xl">{user.name}</h1>
            <p className="text-sm text-cream-200/70">{user.email}</p>
          </div>
        </div>
        <button onClick={out} className="btn-glass">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </motion.header>

      {/* tabs */}
      <div className="glass mt-6 flex gap-1 overflow-x-auto rounded-full p-1.5" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className="relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
          >
            {tab === id && (
              <motion.span
                layoutId="dash-tab"
                className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className={`relative flex items-center gap-2 ${tab === id ? 'text-forest-950' : 'text-cream-100'}`}>
              <Icon className="h-4 w-4" /> {label}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-6"
        >
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ['Orders placed', mine.length],
                  ['Total spent', formatPrice(spent)],
                  ['Member status', 'Gold'],
                ].map(([label, value]) => (
                  <div key={label} className="glass rounded-3xl p-6">
                    <p className="text-xs uppercase tracking-widest text-cream-200/60">{label}</p>
                    <p className="mt-2 font-serif text-4xl font-semibold text-gold-200">{value}</p>
                  </div>
                ))}
              </div>

              <div className="glass rounded-3xl p-6 sm:p-8">
                <h2 className="font-serif text-3xl font-semibold text-cream-50">Picked for you</h2>
                <p className="mt-1 text-sm text-cream-200/70">Sugar-free favourites from the menu.</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                  {picks.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.slug}`}
                        className="glass-card flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5"
                      >
                        <span className="font-serif text-lg font-semibold text-cream-50">{p.name}</span>
                        <span className="text-sm text-gold-200">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              {mine.length === 0 ? (
                <div className="glass rounded-3xl p-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-white/10 text-gold-200">
                    <ShoppingBag className="h-6 w-6" />
                  </span>
                  <h2 className="mt-4 font-serif text-3xl font-semibold text-cream-50">No orders yet</h2>
                  <p className="mt-1 text-cream-200/75">Orders you place while signed in with this email appear here.</p>
                  <Link to="/shop" className="btn-gold mt-5">
                    Start shopping
                  </Link>
                </div>
              ) : (
                mine.map((o) => (
                  <article key={o.id} className="glass rounded-3xl p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm text-gold-200">{o.id}</p>
                        <p className="text-xs text-cream-200/60">
                          {new Date(o.date).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} · {o.payment}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full border border-emerald-300/40 bg-emerald-400/15 px-3 py-1 text-xs text-emerald-100">
                          {o.status}
                        </span>
                        <span className="font-serif text-2xl font-semibold text-gold-200">{formatPrice(o.total)}</span>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-1.5 border-t border-white/10 pt-4 text-sm text-cream-100/90">
                      {o.items.map((it, i) => (
                        <li key={i} className="flex justify-between">
                          <span>
                            {it.qty} × {it.name} <span className="text-cream-200/60">({getSize(it.size).label})</span>
                          </span>
                          <span>{formatPrice(it.price * it.qty)}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))
              )}
            </div>
          )}

          {tab === 'reserve' && (
            <div>
              <div className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8">
                <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gold-400/25 blur-3xl" />
                <p className="eyebrow relative flex items-center gap-2">
                  <Crown className="h-4 w-4" /> Members only
                </p>
                <h2 className="relative mt-2 font-serif text-4xl font-semibold text-cream-50">The Members’ Reserve</h2>
                <p className="relative mt-2 max-w-2xl text-cream-200/80">
                  Brewing guides and pairing notes from our bar — shared only with signed-in guests.
                </p>
              </div>

              <ul className="mt-5 space-y-3">
                {guides.map((g, i) => (
                  <li key={g.title} className="glass rounded-3xl">
                    <button
                      onClick={() => setOpen(open === i ? null : i)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                      aria-expanded={open === i}
                    >
                      <div>
                        <span className="rounded-full border border-gold-300/40 bg-gold-400/15 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wider text-gold-100">
                          {g.tag}
                        </span>
                        <h3 className="mt-2 font-serif text-2xl font-semibold text-cream-50">{g.title}</h3>
                        <p className="mt-0.5 text-sm text-cream-200/70">{g.summary}</p>
                      </div>
                      <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="shrink-0">
                        <ChevronDown className="h-5 w-5 text-gold-300" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="border-t border-white/10 px-5 pb-6 pt-4 leading-relaxed text-cream-100/90 sm:px-6">{g.body}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
