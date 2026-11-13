import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Info, Lock, Mail, User } from 'lucide-react'
import Field from '../components/Field'
import Logo from '../components/Logo'
import { useStore } from '../store/useStore'
import { useForm } from '../lib/useForm'
import { isEmail } from '../lib/validators'
import { DEMO_PASSWORD } from '../lib/site'

const nameFromEmail = (email) => {
  const local = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return local ? local.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Friend'
}

const validateLogin = (v) => {
  const e = {}
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!isEmail(v.email)) e.email = 'That email doesn’t look right.'
  if (!v.password) e.password = 'Enter your password.'
  else if (v.password !== DEMO_PASSWORD) e.password = 'Incorrect password.'
  return e
}

const validateSignup = (v) => {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Enter your email address.'
  else if (!isEmail(v.email)) e.email = 'That email doesn’t look right.'
  if (!v.password) e.password = 'Choose a password.'
  else if (v.password !== DEMO_PASSWORD) e.password = 'This demo build only accepts the access password shown above.'
  if (!v.confirm) e.confirm = 'Please confirm your password.'
  else if (v.confirm !== v.password) e.confirm = 'Passwords don’t match.'
  return e
}

function PasswordToggle({ shown, onClick }) {
  return (
    <button type="button" onClick={onClick} className="grid h-9 w-9 place-items-center rounded-full text-cream-200/70 hover:bg-white/15" aria-label={shown ? 'Hide password' : 'Show password'}>
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  )
}

function LoginForm({ onDone }) {
  const [show, setShow] = useState(false)
  const profiles = useStore((s) => s.profiles)
  const login = useStore((s) => s.login)
  const { values, errors, onChange, onBlur, submit } = useForm({ email: '', password: '' }, validateLogin)

  const go = submit((v) => {
    const email = v.email.trim().toLowerCase()
    login({ email, name: profiles[email] ?? nameFromEmail(email) })
    onDone()
  })

  return (
    <form onSubmit={go} noValidate className="space-y-5">
      <Field label="Email" name="email" type="email" icon={Mail} value={values.email} onChange={onChange} onBlur={onBlur} error={errors.email} autoComplete="email" placeholder="you@example.com" />
      <Field
        label="Password"
        name="password"
        type={show ? 'text' : 'password'}
        icon={Lock}
        value={values.password}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.password}
        autoComplete="current-password"
        right={<PasswordToggle shown={show} onClick={() => setShow((s) => !s)} />}
      />
      <button type="submit" className="btn-gold w-full !py-3.5">Log in</button>
    </form>
  )
}

function SignupForm({ onDone }) {
  const [show, setShow] = useState(false)
  const signup = useStore((s) => s.signup)
  const { values, errors, onChange, onBlur, submit } = useForm({ name: '', email: '', password: '', confirm: '' }, validateSignup)

  const go = submit((v) => {
    signup({ name: v.name.trim(), email: v.email.trim().toLowerCase() })
    onDone()
  })

  return (
    <form onSubmit={go} noValidate className="space-y-5">
      <Field label="Full name" name="name" icon={User} value={values.name} onChange={onChange} onBlur={onBlur} error={errors.name} autoComplete="name" placeholder="Jane Doe" />
      <Field label="Email" name="email" type="email" icon={Mail} value={values.email} onChange={onChange} onBlur={onBlur} error={errors.email} autoComplete="email" placeholder="you@example.com" />
      <Field
        label="Password"
        name="password"
        type={show ? 'text' : 'password'}
        icon={Lock}
        value={values.password}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.password}
        autoComplete="new-password"
        right={<PasswordToggle shown={show} onClick={() => setShow((s) => !s)} />}
      />
      <Field label="Confirm password" name="confirm" type={show ? 'text' : 'password'} icon={Lock} value={values.confirm} onChange={onChange} onBlur={onBlur} error={errors.confirm} autoComplete="new-password" />
      <button type="submit" className="btn-gold w-full !py-3.5">Create account</button>
    </form>
  )
}

export default function Auth() {
  const [mode, setMode] = useState('login')
  const user = useStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  // signed in (just now, or already) → continue to where they were headed
  if (user) return <Navigate to={from} replace />

  const done = () => navigate(from, { replace: true })

  return (
    <div className="container-x grid min-h-[100svh] place-items-center pb-10 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-strong w-full max-w-md rounded-[2rem] p-7 sm:p-10"
      >
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        {location.state?.protectedArea && (
          <p className="mt-5 rounded-2xl border border-gold-300/40 bg-gold-400/15 px-4 py-3 text-center text-sm text-gold-100">
            Please log in to view your account and Members’ Reserve.
          </p>
        )}

        <div className="relative mt-7 grid grid-cols-2 rounded-full border border-white/20 bg-white/5 p-1" role="tablist">
          {[
            ['login', 'Log in'],
            ['signup', 'Sign up'],
          ].map(([id, label]) => (
            <button
              key={id}
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className="relative rounded-full py-2.5 text-sm font-medium"
            >
              {mode === id && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative ${mode === id ? 'text-forest-950' : 'text-cream-100'}`}>{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-white/15 bg-white/5 p-3.5 text-xs text-cream-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
          <p>
            Demo access: use the password <code className="rounded bg-white/15 px-1.5 py-0.5 font-semibold text-gold-100">{DEMO_PASSWORD}</code> with
            any valid email.
          </p>
        </div>

        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -24 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 24 : -24 }}
              transition={{ duration: 0.25 }}
            >
              {mode === 'login' ? <LoginForm onDone={done} /> : <SignupForm onDone={done} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
