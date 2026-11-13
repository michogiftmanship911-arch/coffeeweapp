import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, Flame, Snowflake, Sprout, ShoppingBag, ArrowRight } from 'lucide-react'
import CupStage from './CupStage'
import { useStore } from '../store/useStore'
import { formatPrice } from '../lib/site'
import { ease } from '../lib/motion'

const SWIPE_DISTANCE = 90
const SWIPE_VELOCITY = 450

const textVariants = {
  enter: (d) => ({ opacity: 0, x: d >= 0 ? 70 : -70 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d >= 0 ? -70 : 70 }),
}

/**
 * Swipe mechanism
 *  - A transparent layer over the 3D cup is draggable on the X axis (framer-motion).
 *  - While dragging, `x` is fed straight into the cup's rotation (rotation.y = spin + x * 0.012),
 *    so the cup follows your finger 1:1.
 *  - On release, if you passed the distance/velocity threshold the carousel advances and a
 *    spring adds a full 360° turn; the layer snaps back to origin with a springy bounce.
 */
export default function SwipeCarousel({ items }) {
  const [[index, dir], setPage] = useState([0, 0])
  const product = items[index]
  const { colors } = product

  const addToCart = useStore((s) => s.addToCart)
  const showToast = useStore((s) => s.showToast)

  const x = useMotionValue(0)
  const spinTarget = useMotionValue(0)
  const spin = useSpring(spinTarget, { stiffness: 60, damping: 14, mass: 1 })
  const parallax = useTransform(x, (v) => v * -0.18)
  const parallaxSlow = useTransform(x, (v) => v * 0.1)

  const go = useCallback(
    (d) => {
      setPage(([i]) => [(i + d + items.length) % items.length, d])
      spinTarget.set(spinTarget.get() - d * Math.PI * 2)
    },
    [items.length, spinTarget],
  )

  const goTo = (i) => {
    if (i === index) return
    const d = i > index ? 1 : -1
    setPage([i, d])
    spinTarget.set(spinTarget.get() - d * Math.PI * 2)
  }

  const onDragEnd = (_, info) => {
    const passed = Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY
    if (passed) go(info.offset.x < 0 ? 1 : -1)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  const quickAdd = () => {
    addToCart(product.id, 'M', 1)
    showToast({ message: `${product.name} added to cart`, to: '/cart', action: 'View cart' })
  }

  return (
    <section
      className="relative isolate min-h-[100svh] overflow-hidden pb-14 pt-28 outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label="Signature beverages. Swipe or use arrow keys."
    >
      {/* ---------- dynamic background (cross-fades per beverage) ---------- */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence initial={false}>
          <motion.div
            key={product.id}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 90% at 50% 38%, ${colors.bgTo} 0%, ${colors.bgFrom} 62%, #0a1a12 100%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />
        </AnimatePresence>
        <motion.div
          className="absolute -left-24 top-24 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ x: parallax }}
          animate={{ backgroundColor: colors.accent }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute -right-24 bottom-24 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ x: parallaxSlow }}
          animate={{ backgroundColor: colors.accent }}
          transition={{ duration: 1 }}
        />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-forest-950 to-transparent" />
      </div>

      <div className="container-x relative">
        <motion.p
          className="eyebrow mb-4 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          Swipe the cup · {items.length} signature brews
        </motion.p>

        <div className="grid items-center gap-5 lg:grid-cols-[1fr_minmax(340px,520px)_1fr]">
          {/* ---------------- name ---------------- */}
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={product.id}
                custom={dir}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease }}
              >
                <p className="font-serif text-lg italic text-gold-200">
                  {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </p>
                <h1 className="mt-1 font-serif text-4xl font-semibold leading-[1.05] text-cream-50 sm:text-5xl xl:text-6xl">
                  {product.name}
                </h1>
                <p className="mt-3 font-serif text-xl italic text-cream-200/90">{product.tagline}</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs">
                    {product.temp === 'hot' ? <Flame className="h-3.5 w-3.5" /> : <Snowflake className="h-3.5 w-3.5" />}
                    {product.temp === 'hot' ? 'Served hot' : 'Served iced'}
                  </span>
                  {product.sugarFree && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-400/20 px-3 py-1 text-xs text-emerald-100 backdrop-blur-md">
                      <Sprout className="h-3.5 w-3.5" /> Sugar-Free
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ---------------- cup + swipe layer ---------------- */}
          <div className="order-1 lg:order-2">
            <div className="relative h-[360px] sm:h-[450px] lg:h-[520px]">
              <CupStage product={product} spin={spin} drag={x} className="absolute inset-0" />
              <motion.div
                className="absolute inset-0 z-10 cursor-grab touch-pan-y active:cursor-grabbing"
                style={{ x }}
                drag="x"
                dragSnapToOrigin
                dragElastic={1}
                dragTransition={{ bounceStiffness: 260, bounceDamping: 24 }}
                onDragEnd={onDragEnd}
                aria-label="Swipe left or right to change beverage"
              />
            </div>

            <div className="mt-2 flex items-center justify-center gap-4">
              <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous beverage">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2" role="tablist" aria-label="Choose beverage">
                {items.map((it, i) => (
                  <button
                    key={it.id}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={it.name}
                    onClick={() => goTo(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === index ? 'w-8 bg-gold-300' : 'w-2 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <button className="icon-btn" onClick={() => go(1)} aria-label="Next beverage">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <motion.p
              className="mt-3 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-cream-200/70"
              animate={{ x: [0, 6, -6, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> drag to spin <ChevronRight className="h-3.5 w-3.5" />
            </motion.p>
          </div>

          {/* ---------------- description ---------------- */}
          <div className="order-3">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={product.id}
                custom={dir}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease, delay: 0.04 }}
                className="glass-strong mx-auto max-w-md rounded-3xl p-6 text-center lg:mx-0 lg:text-left"
              >
                <p className="text-sm leading-relaxed text-cream-100/90">{product.blurb}</p>
                <ul className="mt-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {product.notes.map((n) => (
                    <li key={n} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-cream-100">
                      {n}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-center gap-3 lg:justify-start">
                  <span className="font-serif text-3xl font-semibold text-gold-200">{formatPrice(product.price)}</span>
                  <span className="text-xs text-cream-200/60">from</span>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-3 lg:justify-start">
                  <Link to={`/product/${product.slug}`} className="btn-gold">
                    Explore <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button onClick={quickAdd} className="btn-glass">
                    <ShoppingBag className="h-4 w-4" /> Add
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
