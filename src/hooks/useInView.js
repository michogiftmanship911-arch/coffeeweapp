import { useEffect, useState } from 'react'

// Used to pause the WebGL render loop when the 3D canvas is scrolled off-screen.
export default function useInView(ref, rootMargin = '120px') {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
