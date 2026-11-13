import { Component, lazy, Suspense } from 'react'
import ProductArt from './ProductArt'

const CupCanvas = lazy(() => import('./CupCanvas'))

class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.warn('3D view unavailable, showing illustration instead.', err)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/** Lazy 3D cup with a graceful illustrated fallback (loading, or no WebGL). */
export default function CupStage({ product, className = '', ...rest }) {
  const fallback = (
    <div className={`grid place-items-center ${className}`}>
      <ProductArt product={product} className="h-3/4 w-3/4 max-w-[340px] animate-pulse drop-shadow-2xl" />
    </div>
  )
  return (
    <Boundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <CupCanvas product={product} className={className} {...rest} />
      </Suspense>
    </Boundary>
  )
}
