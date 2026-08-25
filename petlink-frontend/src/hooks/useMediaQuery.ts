import { useEffect, useState } from 'react'
import { breakpoints } from '../theme/tokens'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

export const useIsMobile = () => useMediaQuery(`(max-width: ${breakpoints.md}px)`)

export const useIsTablet = () => useMediaQuery(`(max-width: ${breakpoints.lg}px)`)
