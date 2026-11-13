import { Link } from 'react-router-dom'

/** The "o" in Mother is a tiny globe with a gold leaf growing inside it. */
function LeafO() {
  return (
    <svg
      viewBox="0 0 32 32"
      className="mx-[0.03em] inline-block h-[0.74em] w-[0.74em] align-baseline"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8.5 21.5C8.5 14 14 10 23.5 10c0 8.5-4.2 13.5-11.6 13.5-1.2 0-2.3-.5-3.4-2Z" fill="#c9962a" />
      <path d="M9.5 22.5c3.2-4.4 6.8-7.6 11-9.6" stroke="#12281d" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function Logo({ to = '/', className = '', size = 'md' }) {
  const word = size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-xl' : 'text-[1.7rem]'
  return (
    <Link to={to} className={`group inline-flex flex-col leading-none text-cream-50 ${className}`} aria-label="MotherEarth Tea Shop — home">
      <span className={`font-serif font-semibold tracking-tight ${word}`}>
        M<LeafO />ther<span className="italic text-gold-300 transition-colors group-hover:text-gold-200">Earth</span>
      </span>
      <span className="mt-1 flex items-center gap-2 font-sans text-[0.56rem] font-medium uppercase tracking-[0.46em] text-cream-200/80">
        <span className="h-px w-5 bg-gold-400/70" />
        Tea Shop
        <span className="h-px w-5 bg-gold-400/70" />
      </span>
    </Link>
  )
}
