import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Facebook, Instagram, Leaf, Mail, MessageCircle, Send, Twitter } from 'lucide-react'
import Logo from './Logo'
import Field from './Field'
import { SITE, SOCIALS } from '../lib/site'
import { useForm } from '../lib/useForm'
import { isEmail } from '../lib/validators'

const validate = (v) => ({
  email: !v.email.trim() ? 'Enter your email address.' : !isEmail(v.email) ? 'That email doesn’t look right.' : '',
})

const social =
  'grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-white/10 text-cream-50 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-gold-300 hover:bg-gold-400/25'

export default function Footer() {
  const [done, setDone] = useState(false)
  const { values, errors, onChange, onBlur, submit, reset } = useForm({ email: '' }, validate)

  const onSubmit = submit(() => {
    setDone(true)
    reset()
    setTimeout(() => setDone(false), 4000)
  })

  return (
    <footer className="relative mt-24 px-3 pb-6 sm:px-6">
      <div className="glass-strong mx-auto max-w-7xl rounded-[2rem] p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1.2fr]">
          {/* brand */}
          <div>
            <Logo size="md" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/75">
              Ethically sourced coffees and teas, poured with care — including a full range of sugar-free brews.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {/* WhatsApp icon → wa.me */}
              <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className={social} aria-label="Chat on WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href={SITE.mailto} className={social} aria-label="Email us">
                <Mail className="h-5 w-5" />
              </a>
              <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" className={social} aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" className={social} aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" className={social} aria-label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* quick links */}
          <nav aria-label="Quick links">
            <h4 className="eyebrow mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-cream-100/85">
              {[
                ['/', 'Home'],
                ['/shop', 'Shop all'],
                ['/about', 'About us'],
                ['/contact', 'Contact'],
                ['/cart', 'Cart'],
                ['/dashboard', 'My account'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} className="transition hover:text-gold-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Shop categories">
            <h4 className="eyebrow mb-4">Menu</h4>
            <ul className="space-y-2.5 text-sm text-cream-100/85">
              {[
                ['coffee', 'Coffee'],
                ['tea', 'Tea'],
                ['sugar-free', 'Sugar-Free'],
                ['hot', 'Hot drinks'],
                ['iced', 'Iced drinks'],
              ].map(([f, label]) => (
                <li key={f}>
                  <Link to={`/shop?filter=${f}`} className="transition hover:text-gold-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* newsletter */}
          <div>
            <h4 className="eyebrow mb-4">Newsletter</h4>
            <p className="mb-3 text-sm text-cream-200/75">New blends, brewing tips and the odd treat. No spam.</p>
            <form onSubmit={onSubmit} noValidate className="space-y-2">
              <Field
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={values.email}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.email}
                autoComplete="email"
              />
              <button type="submit" className="btn-gold w-full">
                {done ? (
                  <>
                    <Check className="h-4 w-4" /> Subscribed — thank you!
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs text-cream-200/70 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold-200">
              WhatsApp {SITE.whatsappDisplay}
            </a>
            <a href={SITE.mailto} className="hover:text-gold-200">
              {SITE.email}
            </a>
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/40 bg-gold-400/10 px-3.5 py-1.5 font-medium text-gold-100">
            <Leaf className="h-3.5 w-3.5 text-gold-300" />
            Built by {SITE.owner}
          </p>
        </div>
      </div>
    </footer>
  )
}
