import { useEffect, useState } from 'react'
import { Button } from '@carbon/react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useContent } from '../hooks/useContent'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { softClick } from '../lib/softNavigate'
import { storageGet } from '../lib/safeStorage'
import { fadeUp, heroStagger } from '../motion/presets'
import { BOOT_EXIT_MS, BOOT_KEY, BOOT_MS } from './BootIntro'
import { ProfileAvatar } from './ProfileAvatar'
import { SystemsMapVisual } from './SystemsMapVisual'

function shouldStartReady(reduced: boolean) {
  if (reduced) return true
  if (typeof window === 'undefined') return true
  return Boolean(storageGet(BOOT_KEY))
}

export function Hero() {
  const { profile, site } = useContent()
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const [ready, setReady] = useState(() => shouldStartReady(reduced))

  useEffect(() => {
    if (reduced || storageGet(BOOT_KEY)) {
      setReady(true)
      return
    }
    // Wait for boot hold + exit so hero motion is not hidden under the overlay
    const timer = window.setTimeout(() => setReady(true), BOOT_MS + BOOT_EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [reduced])

  return (
    <section className="hero hero--premium" aria-labelledby="hero-title">
      <motion.div
        className="hero__copy"
        variants={reduced ? undefined : heroStagger}
        initial={reduced || ready ? false : 'hidden'}
        animate={ready && !reduced ? 'visible' : reduced ? undefined : 'hidden'}
      >
        <motion.div className="hero__identity" variants={reduced ? undefined : fadeUp}>
          <div className="hero__glow" aria-hidden="true" />
          <ProfileAvatar name={profile.name} src={profile.avatarUrl} size="lg" />
          <div className="hero__identity-copy">
            <p className="hero__eyebrow">
              <span className="hero__status-dot" aria-hidden="true" />
              <span className="hero__eyebrow-badge">Available for senior roles</span>
            </p>
            <h1 id="hero-title" className="hero__title">
              <span className="hero__name">{profile.name}</span>
              <span className="hero__role">{profile.title}</span>
            </h1>
          </div>
        </motion.div>
        <motion.p className="hero__tagline" variants={reduced ? undefined : fadeUp}>
          {profile.tagline}
        </motion.p>
        <motion.div className="hero__actions" variants={reduced ? undefined : fadeUp}>
          <Button
            href="/resume"
            onClick={(e) => softClick(e, navigate, '/resume')}
          >
            {site.cta.primary}
          </Button>
          <Button kind="tertiary" href={`mailto:${profile.email}`}>
            {site.cta.secondary}
          </Button>
        </motion.div>
      </motion.div>
      <motion.div
        initial={reduced || ready ? false : { opacity: 0, scale: 0.97 }}
        animate={
          ready || reduced
            ? { opacity: 1, scale: 1 }
            : { opacity: 0, scale: 0.97 }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: ready ? 0.04 : 0 }}
      >
        <SystemsMapVisual active={ready || reduced} />
      </motion.div>
    </section>
  )
}
