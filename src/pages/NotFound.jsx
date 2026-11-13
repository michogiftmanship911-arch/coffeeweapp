import { Link } from 'react-router-dom'
import { Coffee } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[80vh] place-items-center pt-28">
      <div className="glass-strong max-w-lg rounded-[2rem] p-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/10 text-gold-200">
          <Coffee className="h-7 w-7" />
        </span>
        <p className="eyebrow mt-6">404</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-cream-50">This cup is empty.</h1>
        <p className="mt-3 text-cream-200/80">We couldn’t find the page or drink you were looking for.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/shop" className="btn-gold">
            Browse the shop
          </Link>
          <Link to="/" className="btn-glass">
            Back home
          </Link>
        </div>
      </div>
    </div>
  )
}
