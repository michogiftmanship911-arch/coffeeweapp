import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Coffee, Flame, Leaf, Search, Snowflake, Sprout, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { products } from '../data/products'

// Filters in the same `group` are OR-ed; different groups are AND-ed.
const FILTERS = [
  { id: 'coffee', label: 'Coffee', icon: Coffee, group: 'type', test: (p) => p.categories.includes('coffee') },
  { id: 'tea', label: 'Tea', icon: Leaf, group: 'type', test: (p) => p.categories.includes('tea') },
  { id: 'sugar-free', label: 'Sugar-Free', icon: Sprout, group: 'diet', test: (p) => p.sugarFree },
  { id: 'hot', label: 'Hot', icon: Flame, group: 'temp', test: (p) => p.temp === 'hot' },
  { id: 'iced', label: 'Iced', icon: Snowflake, group: 'temp', test: (p) => p.temp === 'iced' },
]

const SORTS = {
  featured: { label: 'Featured', fn: () => 0 },
  'price-asc': { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  name: { label: 'Name A–Z', fn: (a, b) => a.name.localeCompare(b.name) },
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')

  const active = useMemo(
    () => (params.get('filter') || '').split(',').filter((id) => FILTERS.some((f) => f.id === id)),
    [params],
  )

  const toggle = (id) => {
    const next = active.includes(id) ? active.filter((a) => a !== id) : [...active, id]
    setParams(next.length ? { filter: next.join(',') } : {}, { replace: true })
  }
  const clear = () => {
    setParams({}, { replace: true })
    setQuery('')
  }

  const visible = useMemo(() => {
    const groups = {}
    active.forEach((id) => {
      const f = FILTERS.find((x) => x.id === id)
      ;(groups[f.group] ||= []).push(f)
    })
    const q = query.trim().toLowerCase()
    return products
      .filter((p) => Object.values(groups).every((fs) => fs.some((f) => f.test(p))))
      .filter((p) => !q || `${p.name} ${p.tagline} ${p.notes.join(' ')}`.toLowerCase().includes(q))
      .sort(SORTS[sort].fn)
  }, [active, query, sort])

  const hasFilters = active.length > 0 || query

  return (
    <div className="container-x pb-8 pt-32">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="eyebrow">The menu</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-cream-50 sm:text-6xl">Shop all drinks</h1>
        <p className="mt-4 text-cream-200/80">
          {products.length} brews — from classic espresso to sugar-free specialty blends. Filter, sort and find your cup.
        </p>
      </motion.header>

      {/* controls */}
      <div className="glass sticky top-24 z-30 mt-10 rounded-3xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
            <button
              onClick={clear}
              aria-pressed={!active.length}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                !active.length
                  ? 'border-gold-300 bg-gold-400/25 text-gold-100'
                  : 'border-white/20 bg-white/5 text-cream-100 hover:bg-white/15'
              }`}
            >
              All
            </button>
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const on = active.includes(id)
              return (
                <button
                  key={id}
                  onClick={() => toggle(id)}
                  aria-pressed={on}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                    on
                      ? 'border-gold-300 bg-gold-400/25 text-gold-100'
                      : 'border-white/20 bg-white/5 text-cream-100 hover:bg-white/15'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-56">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-300/80" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search drinks…"
                aria-label="Search drinks"
                className="field !rounded-full !py-2.5 pl-10"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort drinks"
              className="field !w-auto !rounded-full !py-2.5"
            >
              {Object.entries(SORTS).map(([id, s]) => (
                <option key={id} value={id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-6 flex items-center gap-3 text-sm text-cream-200/70" aria-live="polite">
        Showing {visible.length} of {products.length}
        {hasFilters && (
          <button onClick={clear} className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs hover:bg-white/20">
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </p>

      <motion.div layout className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <div className="glass mx-auto mt-10 max-w-md rounded-3xl p-10 text-center">
          <p className="font-serif text-2xl text-cream-50">Nothing matches that.</p>
          <p className="mt-2 text-sm text-cream-200/75">Try removing a filter or searching for something else.</p>
          <button onClick={clear} className="btn-gold mt-5">
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
