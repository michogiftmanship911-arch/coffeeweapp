import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Banknote, Check, CreditCard, Loader2, Lock, MapPin, Phone, User, Mail } from 'lucide-react'
import Field from '../components/Field'
import { useCartTotals } from './Cart'
import { useStore } from '../store/useStore'
import { useForm } from '../lib/useForm'
import { isEmail, isFutureExpiry, isPhone, luhn } from '../lib/validators'
import { formatPrice } from '../lib/site'
import { getSize } from '../lib/pricing'

const validate = (v) => {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your full name.'
  if (!isEmail(v.email)) e.email = 'Enter a valid email address.'
  if (!isPhone(v.phone)) e.phone = 'Enter a valid phone number (7–15 digits).'
  if (v.address.trim().length < 5) e.address = 'Enter your delivery address.'
  if (v.city.trim().length < 2) e.city = 'Enter your city.'
  if (v.payment === 'card') {
    if (!luhn(v.cardNumber)) e.cardNumber = 'Enter a valid card number.'
    if (!isFutureExpiry(v.expiry)) e.expiry = 'Use a future date as MM/YY.'
    if (!/^\d{3,4}$/.test(v.cvc)) e.cvc = '3 or 4 digits.'
  }
  return e
}

export default function Checkout() {
  const { lines, subtotal, delivery, tax, total } = useCartTotals()
  const user = useStore((s) => s.user)
  const addOrder = useStore((s) => s.addOrder)
  const clearCart = useStore((s) => s.clearCart)
  const [status, setStatus] = useState('idle') // idle | processing | done
  const [order, setOrder] = useState(null)

  const { values, errors, onChange, onBlur, setValue, submit } = useForm(
    {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: '',
      address: '',
      city: '',
      payment: 'card',
      cardNumber: '',
      expiry: '',
      cvc: '',
    },
    validate,
  )

  const place = submit((v) => {
    setStatus('processing')
    // Simulated payment — nothing is sent anywhere.
    setTimeout(() => {
      const placed = {
        id: `ME-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        date: new Date().toISOString(),
        email: v.email.trim().toLowerCase(),
        name: v.name.trim(),
        payment: v.payment === 'card' ? `Card ending ${v.cardNumber.replace(/\s/g, '').slice(-4)}` : 'Pay on delivery',
        items: lines.map((l) => ({ name: l.product.name, size: l.size, qty: l.qty, price: l.price })),
        total,
        status: 'Preparing',
      }
      addOrder(placed)
      clearCart()
      setOrder(placed)
      setStatus('done')
    }, 1800)
  })

  const formatCard = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 19)
    setValue('cardNumber', digits.replace(/(.{4})/g, '$1 ').trim())
  }
  const formatExpiry = (e) => {
    const d = e.target.value.replace(/\D/g, '').slice(0, 4)
    setValue('expiry', d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d)
  }

  /* ---------------- success ---------------- */
  if (status === 'done' && order) {
    return (
      <div className="container-x grid min-h-[85vh] place-items-center pt-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="glass-strong max-w-lg rounded-[2rem] p-10 text-center"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 14 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-400/25 text-emerald-200"
          >
            <Check className="h-10 w-10" />
          </motion.span>
          <h1 className="mt-6 font-serif text-4xl font-semibold text-cream-50">Thank you, {order.name.split(' ')[0]}!</h1>
          <p className="mt-2 text-cream-200/80">Your order is confirmed and being prepared.</p>
          <p className="mt-5 inline-block rounded-full border border-gold-300/40 bg-gold-400/15 px-5 py-2 font-mono text-sm text-gold-100">
            {order.id}
          </p>
          <p className="mt-4 text-sm text-cream-200/70">
            Total paid: <span className="font-semibold text-cream-50">{formatPrice(order.total)}</span> · {order.payment}
          </p>
          <p className="mt-1 text-xs text-cream-200/50">Demo checkout — no real payment was taken.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/dashboard" className="btn-gold">
              View order history
            </Link>
            <Link to="/shop" className="btn-glass">
              Keep shopping
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  /* ---------------- empty ---------------- */
  if (lines.length === 0) {
    return (
      <div className="container-x grid min-h-[80vh] place-items-center pt-28">
        <div className="glass-strong max-w-md rounded-[2rem] p-10 text-center">
          <h1 className="font-serif text-4xl font-semibold text-cream-50">Nothing to check out</h1>
          <p className="mt-2 text-cream-200/80">Your cart is empty.</p>
          <Link to="/shop" className="btn-gold mt-6">
            Browse the shop
          </Link>
        </div>
      </div>
    )
  }

  const busy = status === 'processing'

  return (
    <div className="container-x pb-8 pt-32">
      <Link to="/cart" className="mb-4 inline-flex items-center gap-1.5 text-sm text-cream-200/70 hover:text-gold-200">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </Link>
      <h1 className="font-serif text-5xl font-semibold text-cream-50">Checkout</h1>

      <form onSubmit={place} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* delivery */}
          <section className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="font-serif text-3xl font-semibold text-cream-50">Delivery details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" icon={User} value={values.name} onChange={onChange} onBlur={onBlur} error={errors.name} autoComplete="name" />
              <Field label="Email" name="email" type="email" icon={Mail} value={values.email} onChange={onChange} onBlur={onBlur} error={errors.email} autoComplete="email" />
              <Field label="Phone" name="phone" type="tel" icon={Phone} placeholder="+234 …" value={values.phone} onChange={onChange} onBlur={onBlur} error={errors.phone} autoComplete="tel" />
              <Field label="City" name="city" icon={MapPin} value={values.city} onChange={onChange} onBlur={onBlur} error={errors.city} autoComplete="address-level2" />
              <Field className="sm:col-span-2" label="Delivery address" name="address" icon={MapPin} value={values.address} onChange={onChange} onBlur={onBlur} error={errors.address} autoComplete="street-address" />
            </div>
          </section>

          {/* payment */}
          <section className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="font-serif text-3xl font-semibold text-cream-50">Payment</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
              {[
                ['card', 'Card', CreditCard],
                ['cod', 'Pay on delivery', Banknote],
              ].map(([id, label, Icon]) => {
                const on = values.payment === id
                return (
                  <button
                    type="button"
                    key={id}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setValue('payment', id)}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition ${
                      on ? 'border-gold-300 bg-gold-400/20' : 'border-white/20 bg-white/5 hover:bg-white/15'
                    }`}
                  >
                    <Icon className="h-5 w-5 text-gold-300" />
                    <span className="font-medium">{label}</span>
                    {on && <Check className="ml-auto h-4 w-4 text-gold-200" />}
                  </button>
                )
              })}
            </div>

            <AnimatePresence initial={false}>
              {values.payment === 'card' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-4 pt-5 sm:grid-cols-2">
                    <Field
                      className="sm:col-span-2"
                      label="Card number"
                      name="cardNumber"
                      icon={CreditCard}
                      inputMode="numeric"
                      placeholder="4242 4242 4242 4242"
                      value={values.cardNumber}
                      onChange={formatCard}
                      onBlur={onBlur}
                      error={errors.cardNumber}
                      autoComplete="cc-number"
                      hint="Demo only — use 4242 4242 4242 4242. Nothing is charged."
                    />
                    <Field label="Expiry" name="expiry" inputMode="numeric" placeholder="MM/YY" value={values.expiry} onChange={formatExpiry} onBlur={onBlur} error={errors.expiry} autoComplete="cc-exp" />
                    <Field label="CVC" name="cvc" inputMode="numeric" maxLength={4} placeholder="123" value={values.cvc} onChange={onChange} onBlur={onBlur} error={errors.cvc} autoComplete="cc-csc" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* summary */}
        <aside className="glass-strong h-fit rounded-3xl p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl font-semibold text-cream-50">Order summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-3">
                <span className="text-cream-100/90">
                  {l.qty} × {l.product.name}
                  <span className="block text-xs text-cream-200/60">{getSize(l.size).label}</span>
                </span>
                <span className="shrink-0 text-cream-50">{formatPrice(l.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-white/15 pt-4 text-sm text-cream-200/85">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Delivery</dt><dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(tax)}</dd></div>
            <div className="flex justify-between border-t border-white/15 pt-3 text-lg font-semibold text-cream-50">
              <dt>Total</dt>
              <dd className="font-serif text-3xl text-gold-200">{formatPrice(total)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={busy} className="btn-gold mt-6 w-full !py-4">
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing…
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Place order · {formatPrice(total)}
              </>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-cream-200/55">Simulated checkout — no payment is processed.</p>
        </aside>
      </form>
    </div>
  )
}
