import { useEffect, useState } from 'react'

// Returns true once the page is scrolled past `threshold` px.
// Used to switch the floating nav from transparent to a frosted background.
export default function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    const id = requestAnimationFrame(onScroll) // sync initial state (deferred)
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return scrolled
}
