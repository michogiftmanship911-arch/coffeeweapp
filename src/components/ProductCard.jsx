import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Plus, Snowflake } from 'lucide-react'
import ProductArt from './ProductArt'
import { useStore } from '../store/useStore'
import { formatPrice } from '../lib/site'

// forwardRef: <AnimatePresence mode="popLayout"> on the Shop page needs to measure the card.
const ProductCard = forwardRef(function ProductCard({ product, className = '' }, ref) {
  const addToCart = useStore((s) => s.addToCart)
  const showToast = useStore((s) => s.showToast)

  const quickAdd = () => {
    addToCart(product.id, 'M', 1)
    showToast({ message: `${product.name} added to cart`, to: '/cart', action: 'View cart' })
  }

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94 }}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      className={`glass-card group flex flex-col rounded-3xl p-3.5 ${className}`}
    >
      <Link to={`/product/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
        <div
          className="relative aspect-square overflow-hidden rounded-2xl"
          style={{ background: `linear-gradient(145deg, ${product.colors.bgFrom}, ${product.colors.bgTo})` }}
        >
          <div
            className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-2xl"
            style={{ background: product.colors.accent }}
          />
          <ProductArt
            product={product}
            className="relative h-full w-full p-3 transition duration-500 group-hover:-rotate-3 group-hover:scale-110"
          />
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {product.badge && (
              <span className="rounded-full border border-white/25 bg-black/25 px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-cream-50 backdrop-blur-md">
                {product.badge}
              </span>
            )}
          </div>
          <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border border-white/25 bg-black/25 text-cream-50 backdrop-blur-md">
            {product.temp === 'hot' ? <Flame className="h-3.5 w-3.5" /> : <Snowflake className="h-3.5 w-3.5" />}
          </span>
        </div>
        <h3 className="mt-4 font-serif text-xl font-semibold leading-tight text-cream-50">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-cream-200/75">{product.tagline}</p>
      </Link>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div>
          <span className="text-[0.65rem] uppercase tracking-widest text-cream-200/60">from</span>
          <p className="font-serif text-2xl font-semibold text-gold-200">{formatPrice(product.price)}</p>
        </div>
        <button onClick={quickAdd} className="btn-gold !px-4 !py-2.5" aria-label={`Add ${product.name} to cart`}>
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
    </motion.article>
  )
})

export default ProductCard
