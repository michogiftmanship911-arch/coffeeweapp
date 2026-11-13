import { motion } from 'framer-motion'
import { ease } from '../lib/motion'

/** Fade-and-rise when scrolled into view (once). */
export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const Comp = motion[as]
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </Comp>
  )
}
