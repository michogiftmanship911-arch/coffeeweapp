import { motion } from 'framer-motion'

// NOTE: opacity + transform only. A CSS `filter` on this wrapper would stop the
// glass cards inside it from blurring the ambient background (backdrop-root).
export default function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
