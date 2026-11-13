import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Droplets, Handshake, Leaf, Recycle, Sprout, Sun } from 'lucide-react'
import Reveal from '../components/Reveal'
import Logo from '../components/Logo'
import { EmailButton, WhatsAppButton } from '../components/ContactCTA'
import { SITE } from '../lib/site'
import { rise, stagger } from '../lib/motion'

const sourcing = [
  { icon: Handshake, title: 'Fair, direct relationships', text: 'We buy as directly as we can from growers and co-operatives, and we pay prices that let farming families thrive — not just survive.' },
  { icon: Leaf, title: 'Traceable origins', text: 'Every coffee and tea on our menu lists where it grew. If we can’t tell you the origin, we don’t serve it.' },
  { icon: Sun, title: 'Seasonal & small-batch', text: 'We buy in small lots and roast or blend in short runs so you taste each harvest at its best.' },
]

const sustainability = [
  { icon: Recycle, title: 'Reusable first', text: 'Bring your own cup and we’ll make it worth your while. For takeaway, we use recyclable and compostable packaging wherever possible.' },
  { icon: Droplets, title: 'Waste, reconsidered', text: 'Spent coffee grounds and tea leaves are set aside for gardeners and compost instead of heading to landfill.' },
  { icon: Sprout, title: 'Plants over plastic', text: 'Our menu leans on plant-based options and our packaging leans away from single-use plastic.' },
]

function Cards({ items }) {
  return (
    <motion.ul
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      className="grid gap-5 md:grid-cols-3"
    >
      {items.map(({ icon: Icon, title, text }) => (
        <motion.li key={title} variants={rise} whileHover={{ y: -8 }} className="glass-card rounded-3xl p-6">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-300/40 bg-gold-400/15 text-gold-200">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-serif text-2xl font-semibold text-cream-50">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-cream-200/80">{text}</p>
        </motion.li>
      ))}
    </motion.ul>
  )
}

export default function About() {
  return (
    <div className="container-x pb-8 pt-32">
      {/* hero */}
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="eyebrow">About us</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-tight text-cream-50 sm:text-7xl">
          A shop that <span className="italic text-gold-300">grows</span> with the earth.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-cream-200/85">
          MotherEarth Tea Shop is a love letter to the leaves, beans and flowers that make a good cup — and to the people
          who grow them.
        </p>
      </motion.header>

      {/* story */}
      <section className="mt-20 grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="glass-strong relative grid min-h-[320px] place-items-center overflow-hidden rounded-[2rem] p-10">
          <div className="absolute -left-10 -top-10 h-52 w-52 rounded-full bg-gold-400/25 blur-3xl" />
          <div className="absolute -bottom-12 -right-10 h-60 w-60 rounded-full bg-forest-400/30 blur-3xl" />
          <div className="relative text-center">
            <Logo size="lg" to="/about" />
            <p className="mt-6 font-serif text-2xl italic text-cream-100">“Good drinks start in good soil.”</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="eyebrow">Our story</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-cream-50">From a love of the leaf</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-cream-200/85">
            <p>
              MotherEarth began with a simple frustration: too many cups were rushed, over-sweetened and disconnected from
              where they came from. We wanted to slow things down — to brew with intention, to name the farms, and to make
              it easy to enjoy a great drink without a mountain of sugar.
            </p>
            <p>
              Today our menu spans bold espressos, hand-whisked matcha, fragrant specialty blends and a full sugar-free
              range. Everything is made to order, because the best cups are never rushed.
            </p>
            <p className="text-sm text-cream-200/60">
              Owner &amp; founder: <span className="font-semibold text-cream-100">{SITE.owner}</span>
            </p>
          </div>
        </Reveal>
      </section>

      {/* sourcing ethics */}
      <section className="mt-24">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow">Sourcing ethics</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-cream-50">Good for growers, good for you</h2>
        </Reveal>
        <Cards items={sourcing} />
      </section>

      {/* sustainability */}
      <section className="mt-24">
        <Reveal className="mb-8 text-center">
          <p className="eyebrow">Sustainability</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-cream-50">Light on the planet</h2>
        </Reveal>
        <Cards items={sustainability} />
      </section>

      {/* CTA */}
      <Reveal className="mt-24">
        <div className="glass-strong relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-14">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/25 blur-3xl" />
          <h2 className="relative font-serif text-4xl font-semibold text-cream-50">Let’s talk tea.</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-cream-200/80">
            Questions about sourcing, wholesale or a custom blend? We’d love to hear from you.
          </p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <WhatsAppButton label="Get in Touch" className="btn-gold" />
            <EmailButton label="Email Us" className="btn-glass" />
            <Link to="/shop" className="btn-glass">
              Shop the menu <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
