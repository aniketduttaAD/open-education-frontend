import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  return {
    ref,
    isInView,
    variants: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    }
  }
}

export function useStaggerAnimation(delay: number = 0.1) {
  return {
    container: {
      animate: {
        transition: {
          staggerChildren: delay
        }
      }
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  }
}
