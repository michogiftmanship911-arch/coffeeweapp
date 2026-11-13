import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Coffee, Flame, Leaf, Recycle, Snowflake, Sprout } from 'lucide-react'
import SwipeCarousel from '../components/SwipeCarousel'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { EmailButton, WhatsAppButton } from '../components/ContactCTA'
import { heroProducts, products } from '../data/products'
import { rise, stagger } from '../lib/motion'

const pillars = [
  { icon: Leaf, title: 'Ethically sourced', text: 'Direct, fairly paid relationships with the growers behind every leaf and bean.' },
  { icon: Coffee, title: 'Small-batch craft', text: 'Roasted and blended in small runs so every cup tastes fresh, never stale.' },
  { icon: Sprout, title: 'Sugar-smart menu', text: 'A full range of no-added-sugar brews that still taste indulgent.' },
  { icon: Recycle, title: 'Low-waste mindset', text: 'Reusable-first service, recyclable packaging and spent grounds given a second life.' },
]

const categories = [
  { id: 'coffee', label: 'Coffee', icon: Coffee, test: (p) => p.categories.includes('coffee') },
  { id: 'tea', label: 'Tea', icon: Leaf, test: (p) => p.categories.includes('tea') },
  { id: 'sugar-free', label: 'Sugar-Free', icon: Sprout, test: (p) => p.sugarFree },
  { id: 'hot', label: 'Hot', icon: Flame, test: (p) => p.temp === 'hot' },
  { id: 'iced', label: 'Iced', icon: Snowflake, test: (p) => p.temp === 'iced' },
]

const featured = ['flat-white', 'no-sugar-vanilla', 'unsweetened-matcha', 'iced-caramel-oat-latte']
  .map((id) => products.find((p) => p.id === id))
  .filter(Boolean)

export default function Home() {
  return (
    <>
      <SwipeCarousel items={heroProducts} />

      {/* ---------------- brand intro ---------------- */}
      <section className="container-x py-16 sm:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Our philosophy</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight text-cream-50 sm:text-5xl">
              Rooted in the earth,
              <br />
              <span className="italic text-gold-300">poured with care.</span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-cream-200/80">
              MotherEarth Tea Shop began with a simple belief: a great cup should be good for the people who grow it, the
              people who drink it and the planet that makes it possible. From bold espressos to delicate white teas, every
              brew is crafted slowly — and many are made without a single gram of added sugar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/about" className="btn-glass">
                Our story <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/shop" className="btn-gold">
                Browse the menu
              </Link>
            </div>
          </Reveal>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {pillars.map(({ icon: Icon, title, text }) => (
              <motion.li key={title} variants={rise} whileHover={{ y: -6 }} className="glass-card rounded-3xl p-5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-gold-300/40 bg-gold-400/15 text-gold-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold text-cream-50">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-200/75">{text}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ---------------- featured categories ---------------- */}
      <section className="container-x py-10">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow">Find your cup</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-cream-50">Featured categories</h2>
        </Reveal>
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
        >
          {categories.map(({ id, label, icon: Icon, test }) => (
            <motion.li key={id} variants={rise} whileHover={{ y: -8 }}>
              <Link
                to={`/shop?filter=${id}`}
                className="glass-card group flex h-full flex-col items-center rounded-3xl px-4 py-7 text-center"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full border border-white/25 bg-white/10 text-gold-200 transition duration-500 group-hover:scale-110 group-hover:bg-gold-400/25">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="mt-4 font-serif text-2xl font-semibold text-cream-50">{label}</span>
                <span className="mt-1 text-xs text-cream-200/70">{products.filter(test).length} drinks</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* ---------------- bestsellers ---------------- */}
      <section className="container-x py-16">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Guest favourites</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-cream-50">Fresh from the bar</h2>
          </div>
          <Link to="/shop" className="btn-glass">
            View all {products.length} drinks <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="h-full">
              <ProductCard product={p} className="h-full" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- contact band ---------------- */}
      <section className="container-x pb-8">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-14">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-forest-400/25 blur-3xl" />
            <p className="eyebrow relative">Say hello</p>
            <h2 className="relative mt-3 font-serif text-4xl font-semibold text-cream-50 sm:text-5xl">
              Custom order or a question?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-cream-200/80">
              Planning an event, want bulk blends or need help choosing? Message us directly — we usually reply quickly.
            </p>
            <div className="relative mt-7 flex flex-wrap justify-center gap-3">
              <WhatsAppButton label="Get in Touch" className="btn-gold" />
              <EmailButton label="Email Us" className="btn-glass" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
