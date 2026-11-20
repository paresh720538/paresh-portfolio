import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { storageGet, storageSet } from '../lib/safeStorage'

export const BOOT_KEY = 'pt-boot-intro-seen'
export const BOOT_MS = 720
export const BOOT_EXIT_MS = 350

function shouldShowBoot(reduced: boolean) {
  if (reduced) return false
  if (typeof window === 'undefined') return false
  return storageGet(BOOT_KEY) === null
}

export function BootIntro() {
  const reduced = usePrefersReducedMotion()
  // Sync init avoids one-frame FOUC of the page before the overlay mounts
  const [show, setShow] = useState(() => shouldShowBoot(reduced))

  useEffect(() => {
    if (reduced) {
      setShow(false)
      return
    }
    if (storageGet(BOOT_KEY)) {
      setShow(false)
      return
    }
    setShow(true)
    const timer = window.setTimeout(() => {
      storageSet(BOOT_KEY, '1')
      setShow(false)
    }, BOOT_MS)
    return () => window.clearTimeout(timer)
  }, [reduced])

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="boot-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: BOOT_EXIT_MS / 1000 } }}
          aria-hidden="true"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              storageSet(BOOT_KEY, '1')
              setShow(false)
            }
          }}
        >
          <motion.svg
            className="boot-intro__mark"
            viewBox="0 0 200 120"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
          >
            <motion.path
              d="M48 28 L48 92 M48 28 L92 28 Q118 28 118 52 Q118 76 92 76 L48 76"
              fill="none"
              stroke="var(--cds-link-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M132 28 L188 28 M160 28 L160 92"
              fill="none"
              stroke="var(--cds-link-primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
