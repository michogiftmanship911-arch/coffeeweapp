import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import Logo from './Logo'
import { WhatsAppButton } from './ContactCTA'
import { useStore } from '../store/useStore'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const count = useStore((s) => s.cart.reduce((n, l) => n + l.qty, 0))
  const user = useStore((s) => s.user)

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? 'border-white/25 bg-forest-900/70 shadow-glass-lg'
            : 'border-white/15 bg-white/[0.07] shadow-glass'
        }`}
        aria-label="Main"
      >
        <Logo size="sm" />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative block rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive ? 'text-cream-50' : 'text-cream-200/75 hover:text-cream-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-white/20 bg-white/15"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link to={user ? '/dashboard' : '/auth'} className="icon-btn" aria-label={user ? 'Your account' : 'Sign in'}>
            {user ? (
              <span className="font-serif text-lg font-semibold text-gold-200">{user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User className="h-5 w-5" />
            )}
          </Link>
          <Link to="/cart" className="icon-btn relative" aria-label={`Cart, ${count} items`}>
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                  className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[0.65rem] font-bold text-forest-950"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button className="icon-btn md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="glass-strong mx-auto mt-2 max-w-7xl rounded-3xl p-4 md:hidden"
          >
            <ul className="flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 font-serif text-2xl ${isActive ? 'bg-white/10 text-gold-200' : 'text-cream-50'}`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2 border-t border-white/15 pt-4">
              <Link to={user ? '/dashboard' : '/auth'} className="btn-glass flex-1">
                {user ? 'My account' : 'Sign in'}
              </Link>
              <WhatsAppButton label="Contact Us" className="btn-gold flex-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
