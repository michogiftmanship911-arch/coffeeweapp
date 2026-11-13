import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import {
  ArrowLeft, Check, ChevronRight, Droplets, Flame, MapPin, Minus, Plus, ShieldCheck, ShoppingBag, Snowflake, Sprout, Truck,
} from 'lucide-react'
import CupStage from '../components/CupStage'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { getProduct, getRelated } from '../data/products'
import { SIZES, getSize, scaledNutrition, unitPrice } from '../lib/pricing'
import { formatPrice } from '../lib/site'
import { useStore } from '../store/useStore'
import NotFound from './NotFound'

export default function Product() {
  const { slug } = useParams()
  const product = getProduct(slug)
  if (!product) return <NotFound />
  // key resets size/quantity when navigating between related products
  return <ProductView key={product.id} product={product} />
}

function ProductView({ product }) {
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const navigate = useNavigate()
  const addToCart = useStore((s) => s.addToCart)
  const showToast = useStore((s) => s.showToast)

  // Drag-to-rotate: horizontal pans nudge the cup's rotation; vertical scrolling still works on touch.
  const dragX = useMotionValue(0)
  const dragSmooth = useSpring(dragX, { stiffness: 120, damping: 20 })

  const price = unitPrice(product, size)
  const n = scaledNutrition(product, size)
  const related = useMemo(() => getRelated(product, 4), [product])

  const sugar = product.sugarFree
    ? {
        tone: 'border-emerald-300/40 bg-emerald-400/15 text-emerald-100',
        title: 'Sugar-Free',
        text: `No added sugar. ${n.sugar > 0 ? `${n.sugar} g total sugar — ${product.sugarSource?.toLowerCase() ?? 'naturally occurring'}.` : 'Zero sugar of any kind.'}`,
      }
    : n.addedSugar > 0
      ? {
          tone: 'border-amber-300/40 bg-amber-400/15 text-amber-100',
          title: `Contains ${n.addedSugar} g added sugar`,
          text: `${n.sugar} g total sugar in a ${getSize(size).label.toLowerCase()}. Ask us to make it with less syrup, or try our Sugar-Free range.`,
        }
      : {
          tone: 'border-white/25 bg-white/10 text-cream-100',
          title: 'No added sugar by default',
          text: `${n.sugar} g total sugar — ${product.sugarSource?.toLowerCase() ?? 'naturally occurring'}.`,
        }

  const add = () => {
    addToCart(product.id, size, qty)
    showToast({
      message: `${qty} × ${product.name} (${getSize(size).label}) added`,
      to: '/cart',
      action: 'View cart',
    })
  }

  const buyNow = () => {
    addToCart(product.id, size, qty)
    navigate('/cart')
  }

  const rows = [
    ['Calories', `${n.calories} kcal`],
    ['Total sugar', `${n.sugar} g`, true],
    ['Added sugar', `${n.addedSugar} g`, true],
    ['Carbohydrates', `${n.carbs} g`],
    ['Fat', `${n.fat} g`],
    ['Protein', `${n.protein} g`],
    ['Caffeine', `${n.caffeine} mg`],
  ]

  return (
    <div className="container-x pb-8 pt-28">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-cream-200/70">
        <Link to="/shop" className="inline-flex items-center gap-1 hover:text-gold-200">
          <ArrowLeft className="h-4 w-4" /> Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-cream-50">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* ---------- 3D view ---------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div
            className="glass relative h-[400px] overflow-hidden rounded-[2rem] sm:h-[520px]"
            style={{ background: `radial-gradient(110% 90% at 50% 40%, ${product.colors.bgTo}cc, ${product.colors.bgFrom}f2)` }}
          >
            <div
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
              style={{ background: product.colors.accent }}
            />
            <CupStage product={product} drag={dragSmooth} className="absolute inset-0" />
            <motion.div
              className="absolute inset-0 z-10 cursor-grab touch-pan-y active:cursor-grabbing"
              onPan={(_, info) => dragX.set(dragX.get() + info.delta.x * 1.4)}
              aria-label="Drag to rotate the drink"
            />
            <span className="glass pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.22em] text-cream-100">
              Drag to rotate · 3D view
            </span>
          </div>
        </motion.div>

        {/* ---------- details ---------- */}
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="flex flex-wrap gap-2">
              <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
                {product.temp === 'hot' ? <Flame className="h-3.5 w-3.5" /> : <Snowflake className="h-3.5 w-3.5" />}
                {product.temp === 'hot' ? 'Served hot' : 'Served iced'}
              </span>
              {product.categories.map((c) => (
                <span key={c} className="glass rounded-full px-3 py-1 text-xs capitalize">
                  {c}
                </span>
              ))}
              {product.sugarFree && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-xs text-emerald-100">
                  <Sprout className="h-3.5 w-3.5" /> Sugar-Free
                </span>
              )}
            </div>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight text-cream-50 sm:text-5xl">{product.name}</h1>
            <p className="mt-2 font-serif text-xl italic text-gold-200">{product.tagline}</p>
            <p className="mt-5 leading-relaxed text-cream-100/85">{product.description}</p>
          </motion.div>

          {/* purchase panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-strong mt-7 rounded-3xl p-5 sm:p-6"
          >
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-cream-200/60">Price</p>
                <motion.p
                  key={price}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-serif text-4xl font-semibold text-gold-200"
                >
                  {formatPrice(price)}
                </motion.p>
              </div>
              <p className="text-sm text-cream-200/70">
                Total <span className="font-semibold text-cream-50">{formatPrice(price * qty)}</span>
              </p>
            </div>

            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-medium text-cream-100/90">Size</legend>
              <div className="grid grid-cols-3 gap-2.5" role="radiogroup">
                {SIZES.map((s) => {
                  const on = s.id === size
                  return (
                    <button
                      key={s.id}
                      role="radio"
                      aria-checked={on}
                      onClick={() => setSize(s.id)}
                      className={`relative rounded-2xl border px-3 py-3 text-center transition ${
                        on ? 'border-gold-300 bg-gold-400/20' : 'border-white/20 bg-white/5 hover:bg-white/15'
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="size-ring"
                          className="absolute inset-0 rounded-2xl ring-2 ring-gold-300"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      <span className="relative block text-sm font-semibold text-cream-50">{s.label}</span>
                      <span className="relative block text-xs text-cream-200/70">{s.oz} oz</span>
                      <span className="relative block text-xs text-gold-200">{formatPrice(unitPrice(product, s.id))}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="glass inline-flex items-center rounded-full">
                <button
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/15 disabled:opacity-40"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-semibold" aria-live="polite">
                  {qty}
                </span>
                <button
                  className="grid h-11 w-11 place-items-center rounded-full hover:bg-white/15 disabled:opacity-40"
                  onClick={() => setQty((q) => Math.min(20, q + 1))}
                  disabled={qty >= 20}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button onClick={add} className="btn-gold flex-1 !py-3.5">
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>
              <button onClick={buyNow} className="btn-glass !py-3.5">
                Buy now
              </button>
            </div>

            <ul className="mt-5 grid gap-2 text-xs text-cream-200/75 sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gold-300" /> Fast local delivery
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-gold-300" /> Freshness guaranteed
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* ---------- tasting notes + origin + nutrition ---------- */}
      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        <Reveal className="glass rounded-3xl p-6 sm:p-8">
          <h2 className="font-serif text-3xl font-semibold text-cream-50">Tasting notes</h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {product.notes.map((note) => (
              <li
                key={note}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-cream-50"
              >
                <Droplets className="h-3.5 w-3.5 text-gold-300" /> {note}
              </li>
            ))}
          </ul>
          <h3 className="mt-7 flex items-center gap-2 font-serif text-2xl font-semibold text-cream-50">
            <MapPin className="h-5 w-5 text-gold-300" /> Origin
          </h3>
          <p className="mt-2 leading-relaxed text-cream-100/85">{product.origin}</p>
        </Reveal>

        <Reveal delay={0.1} className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-3xl font-semibold text-cream-50">Nutrition</h2>
            <span className="text-xs text-cream-200/60">
              {getSize(size).label} · {getSize(size).oz} oz
            </span>
          </div>

          <div className={`mt-4 flex items-start gap-3 rounded-2xl border p-4 ${sugar.tone}`}>
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/15">
              {product.sugarFree ? <Check className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
            </span>
            <div>
              <p className="font-semibold">{sugar.title}</p>
              <p className="mt-0.5 text-sm opacity-90">{sugar.text}</p>
            </div>
          </div>

          <dl className="mt-4 divide-y divide-white/10 text-sm">
            {rows.map(([label, value, highlight]) => (
              <div key={label} className="flex justify-between py-2.5">
                <dt className={highlight ? 'font-semibold text-gold-200' : 'text-cream-200/80'}>{label}</dt>
                <dd className={highlight ? 'font-semibold text-gold-200' : 'text-cream-50'}>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-cream-200/55">Values are estimates and vary with milk choice and preparation.</p>
        </Reveal>
      </div>

      {/* ---------- related ---------- */}
      <section className="mt-20">
        <Reveal className="mb-7">
          <p className="eyebrow">You might also love</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-cream-50">Related drinks</h2>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07} className="h-full">
              <ProductCard product={p} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}
