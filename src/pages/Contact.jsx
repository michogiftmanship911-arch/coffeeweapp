import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Clock, Mail, MessageCircle, Send, User, UserCircle } from 'lucide-react'
import Field from '../components/Field'
import Reveal from '../components/Reveal'
import { EmailButton, WhatsAppButton } from '../components/ContactCTA'
import { SITE } from '../lib/site'
import { useForm } from '../lib/useForm'
import { isEmail } from '../lib/validators'

const validate = (v) => {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email.'
  else if (!isEmail(v.email)) e.email = 'That email doesn’t look right.'
  if (v.message.trim().length < 10) e.message = 'Tell us a little more (at least 10 characters).'
  else if (v.message.length > 1000) e.message = 'Please keep it under 1000 characters.'
  return e
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const { values, errors, onChange, onBlur, submit, reset } = useForm({ name: '', email: '', message: '' }, validate)

  const send = submit((v) => {
    // No backend: hand the message to the visitor's email app, addressed to the shop.
    const subject = encodeURIComponent(`Message from ${v.name.trim()} via MotherEarth website`)
    const body = encodeURIComponent(`${v.message.trim()}\n\n— ${v.name.trim()} (${v.email.trim()})`)
    window.location.href = `${SITE.mailto}?subject=${subject}&body=${body}`
    setSent(true)
    reset()
  })

  return (
    <div className="container-x pb-8 pt-32">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-2xl text-center"
      >
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-cream-50 sm:text-6xl">We’d love to hear from you</h1>
        <p className="mt-4 text-cream-200/80">Questions, custom orders, feedback — reach out in whichever way suits you.</p>
      </motion.header>

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* info */}
        <Reveal className="space-y-4">
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-300/40 bg-gold-400/15 text-gold-200">
                <UserCircle className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-widest text-cream-200/60">Owner</p>
                <p className="font-serif text-2xl font-semibold text-cream-50">{SITE.owner}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-emerald-300/40 bg-emerald-400/15 text-emerald-200">
                <MessageCircle className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-cream-200/60">WhatsApp</p>
                <p className="font-semibold text-cream-50">{SITE.whatsappDisplay}</p>
              </div>
            </div>
            <WhatsAppButton label="Contact Us on WhatsApp" className="btn-gold mt-4 w-full" />
          </div>

          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-gold-300/40 bg-gold-400/15 text-gold-200">
                <Mail className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-cream-200/60">Email</p>
                <p className="truncate font-semibold text-cream-50">{SITE.email}</p>
              </div>
            </div>
            <EmailButton label="Email Us" className="btn-glass mt-4 w-full" />
          </div>

          <div className="glass flex items-center gap-4 rounded-3xl p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/25 bg-white/10 text-cream-100">
              <Clock className="h-6 w-6" />
            </span>
            <p className="text-sm text-cream-200/80">
              WhatsApp is the quickest way to reach us. Emails are answered within one working day.
            </p>
          </div>
        </Reveal>

        {/* form */}
        <Reveal delay={0.1}>
          <div className="glass-strong rounded-[2rem] p-6 sm:p-10">
            <h2 className="font-serif text-3xl font-semibold text-cream-50">Send a message</h2>

            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-300/40 bg-emerald-400/15 p-4 text-emerald-100">
                    <Check className="mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm">
                      Thanks! Your email app should have opened with your message ready to send. If it didn’t, tap{' '}
                      <a href={SITE.mailto} className="font-semibold underline">Email Us</a> or message us on WhatsApp.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={send} noValidate className="mt-6 space-y-5">
              <Field label="Your name" name="name" icon={User} value={values.name} onChange={onChange} onBlur={onBlur} error={errors.name} autoComplete="name" placeholder="Jane Doe" />
              <Field label="Email address" name="email" type="email" icon={Mail} value={values.email} onChange={onChange} onBlur={onBlur} error={errors.email} autoComplete="email" placeholder="you@example.com" />
              <Field
                label="Message"
                name="message"
                as="textarea"
                rows={6}
                value={values.message}
                onChange={onChange}
                onBlur={onBlur}
                error={errors.message}
                placeholder="How can we help?"
                hint={`${values.message.length}/1000`}
              />
              <button type="submit" className="btn-gold w-full !py-4">
                <Send className="h-4 w-4" /> Send message
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
