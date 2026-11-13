import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'
import { useStore } from '../store/useStore'

export default function ToastHost() {
  const toast = useStore((s) => s.toast)
  const hide = useStore((s) => s.hideToast)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="glass-strong pointer-events-auto flex items-center gap-3 rounded-full py-2.5 pl-3 pr-3 text-sm"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/25 text-emerald-200">
              <Check className="h-4 w-4" />
            </span>
            <span className="max-w-[60vw] truncate">{toast.message}</span>
            {toast.to && (
              <Link to={toast.to} onClick={hide} className="rounded-full bg-gold-400/90 px-3 py-1 text-xs font-semibold text-forest-950 hover:bg-gold-300">
                {toast.action || 'View'}
              </Link>
            )}
            <button onClick={hide} aria-label="Dismiss" className="grid h-7 w-7 place-items-center rounded-full hover:bg-white/15">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
